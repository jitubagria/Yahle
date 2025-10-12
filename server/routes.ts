import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import { db } from "./db";
import { users, doctorProfiles, courses, quizzes, quizQuestions, quizSessions, quizResponses, quizLeaderboard, certificates, jobs, masterclasses, researchServiceRequests, aiToolRequests, hospitals, jobApplications, masterclassBookings, quizAttempts, enrollments, courseModules, courseProgress, courseCertificates, entityTemplates, insertUserSchema, insertDoctorProfileSchema, insertCourseSchema, insertJobSchema, insertQuizSchema, insertQuizSessionSchema, insertQuizResponseSchema, insertQuizLeaderboardSchema, insertMasterclassSchema, insertResearchServiceRequestSchema, insertAiToolRequestSchema, quizSubmissionSchema, jobApplicationCreateSchema, aiToolRequestCreateSchema, courseEnrollmentNotificationSchema, quizCertificateNotificationSchema, masterclassBookingNotificationSchema, researchServiceNotificationSchema, insertCourseModuleSchema, insertCourseProgressSchema, insertCourseCertificateSchema, insertEntityTemplateSchema } from "@shared/schema";
import { eq, like, or, and, sql, inArray } from "drizzle-orm";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { bigtosService } from "./bigtos";
import { requireAuth, requireAdmin, getAuthenticatedUser } from "./auth";
import { z } from "zod";
import { sessionParser } from "./index";

// Helper function to recalculate quiz leaderboard ranks with tie-breaking
async function recalculateQuizRanks(quizId: number) {
  const result = await db.execute(sql`
    UPDATE quiz_leaderboard
    SET rank = subquery.new_rank
    FROM (
      SELECT id, ROW_NUMBER() OVER (
        ORDER BY total_score DESC, created_at ASC
      ) as new_rank
      FROM quiz_leaderboard
      WHERE quiz_id = ${quizId}
    ) AS subquery
    WHERE quiz_leaderboard.id = subquery.id
  `);
  return result;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ===== AUTH ROUTES =====
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      // Generate OTP - use fixed 123456 in development
      const otpCode = process.env.NODE_ENV === 'development' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Check if user exists
      const [existingUser] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);

      if (existingUser) {
        // Update existing user's OTP
        await db.update(users)
          .set({ otpCode, otpExpiry })
          .where(eq(users.id, existingUser.id));
      } else {
        // Create new user
        // In development mode, specific phones get admin role for testing
        const adminPhones = ['9999999999', '9799720730'];
        const role = (process.env.NODE_ENV === 'development' && adminPhones.includes(phone)) ? 'admin' : 'doctor';
        await db.insert(users).values({
          phone,
          otpCode,
          otpExpiry,
          role,
        });
      }

      // Send OTP via BigTos WhatsApp
      try {
        await bigtosService.sendOTP(phone, otpCode);
        res.json({ success: true, message: "OTP sent successfully via WhatsApp" });
      } catch (whatsappError) {
        console.error("WhatsApp send error:", whatsappError);
        // Fallback: Still allow login with dev_otp in development
        res.json({ 
          success: true, 
          message: "OTP generated (WhatsApp delivery failed)", 
          dev_otp: process.env.NODE_ENV === 'development' ? otpCode : undefined 
        });
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phone, otp } = req.body;
      if (!phone || !otp) {
        return res.status(400).json({ error: "Phone and OTP are required" });
      }

      const [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.otpCode !== otp) {
        return res.status(401).json({ error: "Invalid OTP" });
      }

      if (user.otpExpiry && user.otpExpiry < new Date()) {
        return res.status(401).json({ error: "OTP expired" });
      }

      // Mark user as verified
      await db.update(users)
        .set({ isVerified: true })
        .where(eq(users.id, user.id));

      // Store userId in session
      req.session.userId = user.id;
      
      res.json({ success: true, user: { id: user.id, phone: user.phone, role: user.role } });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  // ===== DOCTOR ROUTES =====
  app.get("/api/doctors", async (req, res) => {
    try {
      const { search, location, specialty } = req.query;
      
      let query = db.select().from(doctorProfiles);
      
      if (search || location || specialty) {
        const conditions = [];
        if (search) {
          conditions.push(
            or(
              like(doctorProfiles.firstName, `%${search}%`),
              like(doctorProfiles.lastName, `%${search}%`),
              like(doctorProfiles.professionaldegree, `%${search}%`)
            )
          );
        }
        if (location) {
          conditions.push(
            or(
              like(doctorProfiles.jobCity, `%${location}%`),
              like(doctorProfiles.jobState, `%${location}%`)
            )
          );
        }
        if (specialty && specialty !== 'All Specialties') {
          conditions.push(like(doctorProfiles.pgBranch, `%${specialty}%`));
        }
        
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
      }

      const doctors = await query.limit(50);
      res.json(doctors);
    } catch (error) {
      console.error("Get doctors error:", error);
      res.status(500).json({ error: "Failed to fetch doctors" });
    }
  });

  app.get("/api/doctors/:id", async (req, res) => {
    try {
      const [doctor] = await db.select()
        .from(doctorProfiles)
        .where(eq(doctorProfiles.id, parseInt(req.params.id)))
        .limit(1);

      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      res.json(doctor);
    } catch (error) {
      console.error("Get doctor error:", error);
      res.status(500).json({ error: "Failed to fetch doctor" });
    }
  });

  app.post("/api/doctors", async (req, res) => {
    try {
      const validated = insertDoctorProfileSchema.parse(req.body);
      
      const [newDoctor] = await db.insert(doctorProfiles)
        .values(validated)
        .returning();

      res.json(newDoctor);
    } catch (error) {
      console.error("Create doctor error:", error);
      res.status(400).json({ error: "Failed to create doctor profile" });
    }
  });

  app.patch("/api/doctors/:id", async (req, res) => {
    try {
      const doctorId = parseInt(req.params.id);
      const validated = insertDoctorProfileSchema.partial().parse(req.body);

      await db.update(doctorProfiles)
        .set({ ...validated, updatedAt: new Date() })
        .where(eq(doctorProfiles.id, doctorId));

      const [updated] = await db.select()
        .from(doctorProfiles)
        .where(eq(doctorProfiles.id, doctorId))
        .limit(1);

      res.json(updated);
    } catch (error) {
      console.error("Update doctor error:", error);
      res.status(500).json({ error: "Failed to update doctor" });
    }
  });

  // ===== COURSE ROUTES =====
  app.get("/api/courses", async (req, res) => {
    try {
      const allCourses = await db.select().from(courses).limit(50);
      res.json(allCourses);
    } catch (error) {
      console.error("Get courses error:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const [course] = await db.select()
        .from(courses)
        .where(eq(courses.id, parseInt(req.params.id)))
        .limit(1);

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json(course);
    } catch (error) {
      console.error("Get course error:", error);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // Create course (admin only)
  app.post("/api/courses", requireAdmin, async (req, res) => {
    try {
      const validated = insertCourseSchema.parse(req.body);
      
      const [newCourse] = await db.insert(courses)
        .values(validated)
        .returning();

      res.json(newCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Create course error:", error);
      res.status(500).json({ error: "Failed to create course" });
    }
  });

  // Update course (admin only)
  app.put("/api/courses/:id", requireAdmin, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      const courseUpdateSchema = z.object({
        title: z.string().max(255).optional(),
        description: z.string().optional(),
        category: z.string().max(100).optional(),
        level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        duration: z.string().max(50).optional(),
        price: z.number().int().min(0).optional(),
        instructor: z.string().max(255).optional(),
        imageUrl: z.string().optional(),
        thumbnailImage: z.string().optional(),
        syllabus: z.string().optional(),
        prerequisites: z.string().optional(),
        targetAudience: z.string().optional(),
        learningObjectives: z.array(z.string()).optional(),
        status: z.enum(['draft', 'published', 'archived']).optional(),
      }).strict();
      
      const validated = courseUpdateSchema.parse(req.body);
      
      const [updatedCourse] = await db.update(courses)
        .set({ ...validated, updatedAt: new Date() })
        .where(eq(courses.id, courseId))
        .returning();

      if (!updatedCourse) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json(updatedCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Update course error:", error);
      res.status(500).json({ error: "Failed to update course" });
    }
  });

  // Delete course (admin only)
  app.delete("/api/courses/:id", requireAdmin, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      const [deleted] = await db.delete(courses)
        .where(eq(courses.id, courseId))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json({ success: true, deletedCourse: deleted });
    } catch (error) {
      console.error("Delete course error:", error);
      res.status(500).json({ error: "Failed to delete course" });
    }
  });

  // ===== COURSE MODULE ROUTES =====
  // Get modules for a course
  app.get("/api/courses/:id/modules", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      const modules = await db.select()
        .from(courseModules)
        .where(eq(courseModules.courseId, courseId))
        .orderBy(courseModules.orderNo);
      
      res.json(modules);
    } catch (error) {
      console.error("Get modules error:", error);
      res.status(500).json({ error: "Failed to fetch modules" });
    }
  });

  // Create module (admin only)
  app.post("/api/courses/:id/modules", requireAdmin, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      const validated = insertCourseModuleSchema.parse({ 
        ...req.body, 
        courseId 
      });

      const [module] = await db.insert(courseModules)
        .values(validated)
        .returning();

      res.json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Create module error:", error);
      res.status(500).json({ error: "Failed to create module" });
    }
  });

  // Update module (admin only)
  app.patch("/api/courses/:courseId/modules/:moduleId", requireAdmin, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const moduleId = parseInt(req.params.moduleId);
      
      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }
      if (isNaN(moduleId)) {
        return res.status(400).json({ error: "Invalid module ID" });
      }

      const validated = insertCourseModuleSchema.partial().parse(req.body);

      const [updated] = await db.update(courseModules)
        .set(validated)
        .where(and(
          eq(courseModules.id, moduleId),
          eq(courseModules.courseId, courseId)
        ))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "Module not found in this course" });
      }

      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Update module error:", error);
      res.status(500).json({ error: "Failed to update module" });
    }
  });

  // Delete module (admin only)
  app.delete("/api/courses/:courseId/modules/:moduleId", requireAdmin, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const moduleId = parseInt(req.params.moduleId);
      
      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }
      if (isNaN(moduleId)) {
        return res.status(400).json({ error: "Invalid module ID" });
      }

      const [deleted] = await db.delete(courseModules)
        .where(and(
          eq(courseModules.id, moduleId),
          eq(courseModules.courseId, courseId)
        ))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: "Module not found in this course" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Delete module error:", error);
      res.status(500).json({ error: "Failed to delete module" });
    }
  });

  // Reorder modules (admin only)
  app.patch("/api/courses/:id/modules/reorder", requireAdmin, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      // Validate moduleOrder with Zod schema
      const moduleOrderSchema = z.array(z.object({
        id: z.number().int().positive(),
        orderNo: z.number().int().nonnegative()
      }));

      const { moduleOrder } = req.body;
      const validated = moduleOrderSchema.parse(moduleOrder);

      if (validated.length === 0) {
        return res.status(400).json({ error: "moduleOrder cannot be empty" });
      }

      // Execute reorder within transaction
      await db.transaction(async (tx) => {
        // Verify all modules belong to this course
        const moduleIds = validated.map(item => item.id);
        const existingModules = await tx.select({ id: courseModules.id })
          .from(courseModules)
          .where(and(
            eq(courseModules.courseId, courseId),
            inArray(courseModules.id, moduleIds)
          ));

        if (existingModules.length !== validated.length) {
          throw new Error("One or more module IDs not found in this course");
        }

        // Update each module's order
        for (const item of validated) {
          const result = await tx.update(courseModules)
            .set({ orderNo: item.orderNo })
            .where(and(
              eq(courseModules.id, item.id),
              eq(courseModules.courseId, courseId)
            ))
            .returning();

          if (result.length === 0) {
            throw new Error(`Module ${item.id} not found or not in course ${courseId}`);
          }
        }
      });

      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Reorder modules error:", error);
      res.status(500).json({ error: "Failed to reorder modules" });
    }
  });

  // ===== CERTIFICATE TEMPLATE ROUTES =====
  // Get all templates (admin only)
  app.get("/api/admin/templates", requireAdmin, async (req, res) => {
    try {
      const templates = await db.select()
        .from(entityTemplates)
        .orderBy(entityTemplates.createdAt);
      res.json(templates);
    } catch (error) {
      console.error("Get templates error:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // Get template by entity
  app.get("/api/admin/templates/:entityType/:entityId", requireAdmin, async (req, res) => {
    try {
      const { entityType, entityId } = req.params;
      
      if (!['course', 'quiz', 'masterclass'].includes(entityType)) {
        return res.status(400).json({ error: "Invalid entity type" });
      }

      const [template] = await db.select()
        .from(entityTemplates)
        .where(and(
          eq(entityTemplates.entityType, entityType as any),
          eq(entityTemplates.entityId, parseInt(entityId))
        ))
        .limit(1);

      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Get template error:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // Create or update template (admin only)
  app.post("/api/admin/templates", requireAdmin, async (req, res) => {
    try {
      const validated = insertEntityTemplateSchema.parse(req.body);
      
      // Check if template exists for this entity
      const [existing] = await db.select()
        .from(entityTemplates)
        .where(and(
          eq(entityTemplates.entityType, validated.entityType),
          eq(entityTemplates.entityId, validated.entityId)
        ))
        .limit(1);

      if (existing) {
        // Update existing template
        const [updated] = await db.update(entityTemplates)
          .set({
            ...validated,
            updatedAt: new Date()
          })
          .where(eq(entityTemplates.id, existing.id))
          .returning();
        
        return res.json(updated);
      } else {
        // Create new template
        const [newTemplate] = await db.insert(entityTemplates)
          .values(validated)
          .returning();
        
        return res.json(newTemplate);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Create/Update template error:", error);
      res.status(500).json({ error: "Failed to save template" });
    }
  });

  // Delete template (admin only)
  app.delete("/api/admin/templates/:id", requireAdmin, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      if (isNaN(templateId)) {
        return res.status(400).json({ error: "Invalid template ID" });
      }

      const [deleted] = await db.delete(entityTemplates)
        .where(eq(entityTemplates.id, templateId))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json({ success: true, deletedTemplate: deleted });
    } catch (error) {
      console.error("Delete template error:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  // ===== ENROLLMENT ROUTES =====
  // Enroll in a course (authenticated users)
  app.post("/api/courses/:id/enroll", requireAuth, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      const user = getAuthenticatedUser(req);
      
      // Validate request body
      const enrollmentSchema = z.object({
        paymentStatus: z.enum(["free", "pending", "paid", "failed"]).default("free"),
        amountPaid: z.number().nonnegative().optional(),
        paymentMethod: z.string().optional(),
      });

      const validated = enrollmentSchema.parse(req.body);

      // Check if course exists
      const [course] = await db.select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1);

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Check if already enrolled
      const [existing] = await db.select()
        .from(enrollments)
        .where(and(
          eq(enrollments.userId, user.id),
          eq(enrollments.courseId, courseId)
        ))
        .limit(1);

      if (existing) {
        return res.status(400).json({ error: "Already enrolled in this course" });
      }

      // Create enrollment and update course enrollment count
      const [enrollment] = await db.insert(enrollments)
        .values({
          userId: user.id,
          courseId,
          paymentStatus: validated.paymentStatus,
          amountPaid: validated.amountPaid,
          paymentMethod: validated.paymentMethod,
        })
        .returning();

      // Update enrollment count
      await db.update(courses)
        .set({ 
          enrollmentCount: sql`${courses.enrollmentCount} + 1` 
        })
        .where(eq(courses.id, courseId));

      // Send WhatsApp enrollment notification
      try {
        await bigtosService.sendCourseEnrollmentNotification(user.phone, course.title);
      } catch (notifError) {
        console.error('Failed to send enrollment notification:', notifError);
      }

      res.json(enrollment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Enroll error:", error);
      res.status(500).json({ error: "Failed to enroll in course" });
    }
  });

  // Get user's enrollments
  app.get("/api/enrollments", requireAuth, async (req, res) => {
    try {
      const user = getAuthenticatedUser(req);

      const userEnrollments = await db.select({
        id: enrollments.id,
        courseId: enrollments.courseId,
        paymentStatus: enrollments.paymentStatus,
        amountPaid: enrollments.amountPaid,
        paymentMethod: enrollments.paymentMethod,
        enrolledAt: enrollments.enrolledAt,
        courseTitle: courses.title,
        courseDescription: courses.description,
        courseImage: courses.imageUrl,
        courseDuration: courses.duration,
        coursePrice: courses.price,
      })
        .from(enrollments)
        .innerJoin(courses, eq(enrollments.courseId, courses.id))
        .where(eq(enrollments.userId, user.id));

      res.json(userEnrollments);
    } catch (error) {
      console.error("Get enrollments error:", error);
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  // Get enrollment status for a specific course
  app.get("/api/courses/:id/enrollment", requireAuth, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      const user = getAuthenticatedUser(req);

      const [enrollment] = await db.select()
        .from(enrollments)
        .where(and(
          eq(enrollments.userId, user.id),
          eq(enrollments.courseId, courseId)
        ))
        .limit(1);

      if (!enrollment) {
        return res.status(404).json({ error: "Not enrolled in this course" });
      }

      res.json(enrollment);
    } catch (error) {
      console.error("Get enrollment error:", error);
      res.status(500).json({ error: "Failed to fetch enrollment" });
    }
  });

  // ===== COURSE PROGRESS ROUTES =====
  // Get user's progress for a course
  app.get("/api/courses/:id/progress", requireAuth, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      const user = getAuthenticatedUser(req);

      // Verify enrollment
      const [enrollment] = await db.select()
        .from(enrollments)
        .where(and(
          eq(enrollments.userId, user.id),
          eq(enrollments.courseId, courseId)
        ))
        .limit(1);

      if (!enrollment) {
        return res.status(403).json({ error: "Not enrolled in this course" });
      }

      // Get all progress records for this course
      const progress = await db.select()
        .from(courseProgress)
        .where(and(
          eq(courseProgress.userId, user.id),
          eq(courseProgress.courseId, courseId)
        ));

      res.json(progress);
    } catch (error) {
      console.error("Get progress error:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // Mark module as complete or update progress
  app.post("/api/courses/:courseId/modules/:moduleId/progress", requireAuth, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const moduleId = parseInt(req.params.moduleId);

      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }
      if (isNaN(moduleId)) {
        return res.status(400).json({ error: "Invalid module ID" });
      }

      const user = getAuthenticatedUser(req);

      // Validate request body
      const progressSchema = z.object({
        completed: z.boolean().default(false),
        progressPercentage: z.number().min(0).max(100).optional(),
        lastPosition: z.string().optional(),
      });

      const validated = progressSchema.parse(req.body);

      // Verify enrollment
      const [enrollment] = await db.select()
        .from(enrollments)
        .where(and(
          eq(enrollments.userId, user.id),
          eq(enrollments.courseId, courseId)
        ))
        .limit(1);

      if (!enrollment) {
        return res.status(403).json({ error: "Not enrolled in this course" });
      }

      // Verify module belongs to course
      const [module] = await db.select()
        .from(courseModules)
        .where(and(
          eq(courseModules.id, moduleId),
          eq(courseModules.courseId, courseId)
        ))
        .limit(1);

      if (!module) {
        return res.status(404).json({ error: "Module not found in this course" });
      }

      // Check if progress record exists
      const [existing] = await db.select()
        .from(courseProgress)
        .where(and(
          eq(courseProgress.userId, user.id),
          eq(courseProgress.courseId, courseId),
          eq(courseProgress.moduleId, moduleId)
        ))
        .limit(1);

      let progress;
      if (existing) {
        // Update existing progress
        [progress] = await db.update(courseProgress)
          .set({
            completed: validated.completed,
            progressPercentage: validated.progressPercentage ?? existing.progressPercentage,
            lastPosition: validated.lastPosition ?? existing.lastPosition,
            completedAt: validated.completed ? new Date() : existing.completedAt,
          })
          .where(eq(courseProgress.id, existing.id))
          .returning();
      } else {
        // Create new progress record
        [progress] = await db.insert(courseProgress)
          .values({
            userId: user.id,
            courseId,
            moduleId,
            completed: validated.completed,
            progressPercentage: validated.progressPercentage ?? 0,
            lastPosition: validated.lastPosition,
            completedAt: validated.completed ? new Date() : null,
          })
          .returning();
      }

      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Update progress error:", error);
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  // ===== CERTIFICATE ROUTES =====
  // Check course completion and generate certificate if eligible
  app.post("/api/courses/:id/check-completion", requireAuth, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      const user = getAuthenticatedUser(req);

      // Check if course exists
      const [course] = await db.select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1);

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Verify enrollment
      const [enrollment] = await db.select()
        .from(enrollments)
        .where(and(
          eq(enrollments.userId, user.id),
          eq(enrollments.courseId, courseId)
        ))
        .limit(1);

      if (!enrollment) {
        return res.status(403).json({ error: "Not enrolled in this course" });
      }

      // Get all modules for this course
      const modules = await db.select()
        .from(courseModules)
        .where(eq(courseModules.courseId, courseId));

      if (modules.length === 0) {
        return res.status(400).json({ error: "Course has no modules" });
      }

      // Get user's progress for all modules
      const progress = await db.select()
        .from(courseProgress)
        .where(and(
          eq(courseProgress.userId, user.id),
          eq(courseProgress.courseId, courseId)
        ));

      // Check if all modules are completed
      const completedModuleIds = progress
        .filter(p => p.completed)
        .map(p => p.moduleId);

      const allModulesCompleted = modules.every(module => 
        completedModuleIds.includes(module.id)
      );

      if (!allModulesCompleted) {
        return res.json({
          completed: false,
          totalModules: modules.length,
          completedModules: completedModuleIds.length,
        });
      }

      // Check if certificate already exists or generate new one
      // Database unique constraint on (userId, courseId) prevents duplicates
      const [existingCertificate] = await db.select()
        .from(courseCertificates)
        .where(and(
          eq(courseCertificates.userId, user.id),
          eq(courseCertificates.courseId, courseId)
        ))
        .limit(1);

      if (existingCertificate) {
        return res.json({
          completed: true,
          certificateExists: true,
          certificate: existingCertificate,
          courseName: course?.title,
        });
      }

      // Generate new certificate using certificate generation service
      const certificateNumber = `CERT-${Date.now()}-${user.id}-${courseId}`;
      
      let certificate;
      try {
        // Get user info for certificate
        const [userInfo] = await db.select()
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);
        
        // Generate certificate image using certificate service
        const { generateCertificate } = await import('./services/certificates');
        const certificateUrl = await generateCertificate({
          userId: user.id,
          entityId: courseId,
          entityType: 'course',
          userName: userInfo?.email?.split('@')[0] || `User${user.id}`,
          title: course.title,
          completionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        });

        [certificate] = await db.insert(courseCertificates)
          .values({
            userId: user.id,
            courseId,
            certificateNumber,
            certificateUrl: certificateUrl || `/certificates/${certificateNumber}.pdf`,
          })
          .returning();

        res.json({
          completed: true,
          certificateExists: false,
          certificate,
          courseName: course?.title,
        });
      } catch (insertError: any) {
        // Handle unique constraint violation (race condition)
        if (insertError?.code === '23505') { // PostgreSQL unique violation error code
          const [cert] = await db.select()
            .from(courseCertificates)
            .where(and(
              eq(courseCertificates.userId, user.id),
              eq(courseCertificates.courseId, courseId)
            ))
            .limit(1);

          return res.json({
            completed: true,
            certificateExists: true,
            certificate: cert,
            courseName: course?.title,
          });
        }
        throw insertError; // Re-throw if it's not a unique violation
      }
    } catch (error) {
      console.error("Check completion error:", error);
      res.status(500).json({ error: "Failed to check course completion" });
    }
  });

  // Get user's certificates
  app.get("/api/certificates", requireAuth, async (req, res) => {
    try {
      const user = getAuthenticatedUser(req);

      const userCertificates = await db.select({
        id: courseCertificates.id,
        certificateNumber: courseCertificates.certificateNumber,
        certificateUrl: courseCertificates.certificateUrl,
        issuedAt: courseCertificates.issuedAt,
        courseId: courseCertificates.courseId,
        courseTitle: courses.title,
        courseDescription: courses.description,
        courseImage: courses.imageUrl,
      })
        .from(courseCertificates)
        .innerJoin(courses, eq(courseCertificates.courseId, courses.id))
        .where(eq(courseCertificates.userId, user.id));

      res.json(userCertificates);
    } catch (error) {
      console.error("Get certificates error:", error);
      res.status(500).json({ error: "Failed to fetch certificates" });
    }
  });

  // Get specific certificate details
  app.get("/api/certificates/:certificateNumber", async (req, res) => {
    try {
      const { certificateNumber } = req.params;

      const [certificate] = await db.select({
        id: courseCertificates.id,
        certificateNumber: courseCertificates.certificateNumber,
        certificateUrl: courseCertificates.certificateUrl,
        issuedAt: courseCertificates.issuedAt,
        userId: courseCertificates.userId,
        courseId: courseCertificates.courseId,
        userName: users.fullName,
        userPhone: users.phone,
        courseTitle: courses.title,
        courseDescription: courses.description,
        courseDuration: courses.duration,
      })
        .from(courseCertificates)
        .innerJoin(users, eq(courseCertificates.userId, users.id))
        .innerJoin(courses, eq(courseCertificates.courseId, courses.id))
        .where(eq(courseCertificates.certificateNumber, certificateNumber))
        .limit(1);

      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      res.json(certificate);
    } catch (error) {
      console.error("Get certificate error:", error);
      res.status(500).json({ error: "Failed to fetch certificate" });
    }
  });

  // ===== QUIZ ROUTES =====
  app.get("/api/quizzes", async (req, res) => {
    try {
      const allQuizzes = await db.select().from(quizzes).limit(50);
      res.json(allQuizzes);
    } catch (error) {
      console.error("Get quizzes error:", error);
      res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  });

  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const [quiz] = await db.select()
        .from(quizzes)
        .where(eq(quizzes.id, parseInt(req.params.id)))
        .limit(1);

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      res.json(quiz);
    } catch (error) {
      console.error("Get quiz error:", error);
      res.status(500).json({ error: "Failed to fetch quiz" });
    }
  });

  app.get("/api/quiz-questions", requireAuth, async (req, res) => {
    try {
      const quizId = parseInt(req.query.quizId as string);
      
      if (!quizId || isNaN(quizId)) {
        return res.status(400).json({ error: "Valid quizId parameter is required" });
      }

      const questions = await db.select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, quizId));

      res.json(questions);
    } catch (error) {
      console.error("Get quiz questions error:", error);
      res.status(500).json({ error: "Failed to fetch quiz questions" });
    }
  });

  app.post("/api/quizzes/:quizId/submit", requireAuth, async (req, res) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const user = getAuthenticatedUser(req);
      const validated = quizSubmissionSchema.parse(req.body);

      const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
      
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      const passed = validated.score >= (quiz.passingScore || 60);

      const [attempt] = await db.insert(quizAttempts)
        .values({
          userId: user.id, // Use authenticated user ID
          quizId,
          score: validated.score,
          totalQuestions: validated.totalQuestions,
          timeTaken: validated.timeTaken,
          passed,
          certificateIssued: passed,
        })
        .returning();

      // Generate certificate if passed
      if (passed) {
        try {
          const [userInfo] = await db.select()
            .from(users)
            .where(eq(users.id, user.id))
            .limit(1);
          
          const { generateCertificate } = await import('./services/certificates');
          await generateCertificate({
            userId: user.id,
            entityId: quizId,
            entityType: 'quiz',
            userName: userInfo?.email?.split('@')[0] || `User${user.id}`,
            title: quiz.title,
            score: `${validated.score}%`,
            completionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          });
        } catch (certError) {
          console.error('Failed to generate quiz certificate:', certError);
        }
      }

      res.json(attempt);
    } catch (error) {
      console.error("Submit quiz error:", error);
      res.status(400).json({ error: "Failed to submit quiz" });
    }
  });

  app.get("/api/quizzes/:quizId/leaderboard", requireAuth, async (req, res) => {
    try {
      const quizId = parseInt(req.params.quizId);
      
      const leaderboard = await db.select()
        .from(quizLeaderboard)
        .where(eq(quizLeaderboard.quizId, quizId))
        .orderBy(sql`rank ASC`)
        .limit(100);

      res.json(leaderboard);
    } catch (error) {
      console.error("Get leaderboard error:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Create quiz (admin only)
  app.post("/api/quizzes", requireAdmin, async (req, res) => {
    try {
      const validated = insertQuizSchema.parse(req.body);
      
      const [newQuiz] = await db.insert(quizzes)
        .values(validated)
        .returning();

      res.json(newQuiz);
    } catch (error) {
      console.error("Create quiz error:", error);
      res.status(400).json({ error: "Failed to create quiz" });
    }
  });

  // Update quiz (admin only)
  app.put("/api/quizzes/:id", requireAdmin, async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      
      // Validate update data with dedicated schema for updates
      const quizUpdateSchema = z.object({
        title: z.string().max(255).optional(),
        description: z.string().optional(),
        category: z.string().max(100).optional(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        type: z.enum(['free', 'paid', 'live', 'practice']).optional(),
        totalQuestions: z.number().int().min(0).optional(),
        questionTime: z.number().int().min(1).optional(),
        duration: z.number().int().min(0).optional(),
        passingScore: z.number().int().min(0).max(100).optional(),
        entryFee: z.number().int().min(0).optional(),
        rewardInfo: z.string().optional(),
        certificateType: z.string().max(100).optional(),
        startTime: z.string().datetime().optional().or(z.date().optional()),
        endTime: z.string().datetime().optional().or(z.date().optional()),
        status: z.enum(['draft', 'active', 'completed', 'archived']).optional(),
      }).strict();
      
      const validated = quizUpdateSchema.parse(req.body);
      
      const [updatedQuiz] = await db.update(quizzes)
        .set({ ...validated, updatedAt: new Date() })
        .where(eq(quizzes.id, quizId))
        .returning();

      if (!updatedQuiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      res.json(updatedQuiz);
    } catch (error) {
      console.error("Update quiz error:", error);
      res.status(400).json({ error: "Failed to update quiz" });
    }
  });

  // Join quiz (create session participation)
  app.post("/api/quizzes/:id/join", requireAuth, async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const user = getAuthenticatedUser(req);

      const [quiz] = await db.select()
        .from(quizzes)
        .where(eq(quizzes.id, quizId))
        .limit(1);

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      // Check if user already joined
      const existing = await db.select()
        .from(quizLeaderboard)
        .where(and(
          eq(quizLeaderboard.quizId, quizId),
          eq(quizLeaderboard.userId, user.id)
        ))
        .limit(1);

      if (existing.length > 0) {
        return res.json({ success: true, message: "Already joined", alreadyJoined: true });
      }

      // Create leaderboard entry
      const [entry] = await db.insert(quizLeaderboard)
        .values({
          quizId,
          userId: user.id,
          totalScore: 0,
          rank: 0
        })
        .returning();

      res.json({ success: true, entry });
    } catch (error) {
      console.error("Join quiz error:", error);
      res.status(500).json({ error: "Failed to join quiz" });
    }
  });

  // Submit answer for real-time quiz
  app.post("/api/quizzes/:quizId/responses", requireAuth, async (req, res) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const user = getAuthenticatedUser(req);
      const { questionId, selectedOption, responseTime } = req.body;

      // Get the question to check correct answer
      const [question] = await db.select()
        .from(quizQuestions)
        .where(eq(quizQuestions.id, questionId))
        .limit(1);

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      const isCorrect = question.correctOption === selectedOption;
      const score = isCorrect ? (question.marks || 1) : 0;

      // Save response
      const [response] = await db.insert(quizResponses)
        .values({
          quizId,
          questionId,
          userId: user.id,
          selectedOption,
          isCorrect,
          responseTime,
          score
        })
        .returning();

      // Update leaderboard score
      await db.execute(sql`
        UPDATE quiz_leaderboard 
        SET total_score = total_score + ${score}
        WHERE user_id = ${user.id} AND quiz_id = ${quizId}
      `);

      // Recalculate ranks
      await recalculateQuizRanks(quizId);

      res.json({ success: true, response, isCorrect, score });
    } catch (error) {
      console.error("Submit response error:", error);
      res.status(500).json({ error: "Failed to submit response" });
    }
  });

  // Get quiz session
  app.get("/api/quizzes/:id/session", requireAuth, async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);

      const result = await db.execute(sql`
        SELECT * FROM quiz_sessions
        WHERE quiz_id = ${quizId}
        ORDER BY id DESC
        LIMIT 1
      `);

      const session = result.rows[0] || null;

      res.json({ session });
    } catch (error) {
      console.error("Get session error:", error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // Start quiz session (admin only)
  app.post("/api/quizzes/:id/start", requireAdmin, async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);

      const [quiz] = await db.select()
        .from(quizzes)
        .where(eq(quizzes.id, quizId))
        .limit(1);

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      // Create new session
      const [session] = await db.insert(quizSessions)
        .values({
          quizId,
          currentQuestion: 0,
          startedAt: new Date(),
          status: 'running'
        })
        .returning();

      // Update quiz status
      await db.update(quizzes)
        .set({ status: 'active' })
        .where(eq(quizzes.id, quizId));

      res.json({ success: true, session });
    } catch (error) {
      console.error("Start quiz error:", error);
      res.status(500).json({ error: "Failed to start quiz" });
    }
  });

  // Get quiz result for user
  app.get("/api/quizzes/:quizId/result/:userId", requireAuth, async (req, res) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const userId = parseInt(req.params.userId);
      const currentUser = getAuthenticatedUser(req);

      // Only allow users to see their own results (unless admin)
      if (currentUser.id !== userId && currentUser.role !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
      }

      const [result] = await db.select()
        .from(quizLeaderboard)
        .where(and(
          eq(quizLeaderboard.quizId, quizId),
          eq(quizLeaderboard.userId, userId)
        ))
        .limit(1);

      if (!result) {
        return res.status(404).json({ error: "Result not found" });
      }

      // Get quiz details
      const [quiz] = await db.select()
        .from(quizzes)
        .where(eq(quizzes.id, quizId))
        .limit(1);

      // Calculate if passed: compare percentage score against passing percentage
      const percentage = quiz?.totalQuestions ? (result.totalScore / quiz.totalQuestions) * 100 : 0;
      const passed = percentage >= (quiz?.passingScore || 60);

      res.json({ ...result, passed, percentage, quiz });
    } catch (error) {
      console.error("Get result error:", error);
      res.status(500).json({ error: "Failed to fetch result" });
    }
  });

  // ===== JOB ROUTES =====
  app.get("/api/jobs", async (req, res) => {
    try {
      const { search, location, specialty } = req.query;
      
      let query = db.select().from(jobs).where(eq(jobs.isActive, true));
      
      if (search || location || specialty) {
        const conditions = [eq(jobs.isActive, true)];
        if (search) {
          conditions.push(like(jobs.title, `%${search}%`));
        }
        if (location) {
          conditions.push(like(jobs.location, `%${location}%`));
        }
        if (specialty && specialty !== 'all') {
          conditions.push(like(jobs.specialty, `%${specialty}%`));
        }
        
        query = query.where(and(...conditions));
      }

      const jobsList = await query.limit(50);
      res.json(jobsList);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const [job] = await db.select()
        .from(jobs)
        .where(eq(jobs.id, parseInt(req.params.id)))
        .limit(1);

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.error("Get job error:", error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const validated = insertJobSchema.parse(req.body);
      
      const [newJob] = await db.insert(jobs)
        .values(validated)
        .returning();

      res.json(newJob);
    } catch (error) {
      console.error("Create job error:", error);
      res.status(400).json({ error: "Failed to create job" });
    }
  });

  app.post("/api/jobs/:jobId/apply", async (req, res) => {
    try {
      const jobId = parseInt(req.params.jobId);
      const validated = jobApplicationCreateSchema.parse(req.body);

      // Check if job exists
      const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      const [application] = await db.insert(jobApplications)
        .values({
          jobId,
          userId: validated.userId,
          coverLetter: validated.coverLetter,
          status: "pending",
        })
        .returning();

      res.json(application);
    } catch (error) {
      console.error("Apply to job error:", error);
      res.status(400).json({ error: "Failed to apply to job" });
    }
  });

  // ===== MASTERCLASS ROUTES =====
  app.get("/api/masterclasses", async (req, res) => {
    try {
      const allMasterclasses = await db.select()
        .from(masterclasses)
        .where(eq(masterclasses.isActive, true))
        .limit(50);
      res.json(allMasterclasses);
    } catch (error) {
      console.error("Get masterclasses error:", error);
      res.status(500).json({ error: "Failed to fetch masterclasses" });
    }
  });

  app.get("/api/masterclasses/:id", async (req, res) => {
    try {
      const [masterclass] = await db.select()
        .from(masterclasses)
        .where(eq(masterclasses.id, parseInt(req.params.id)))
        .limit(1);

      if (!masterclass) {
        return res.status(404).json({ error: "Masterclass not found" });
      }

      res.json(masterclass);
    } catch (error) {
      console.error("Get masterclass error:", error);
      res.status(500).json({ error: "Failed to fetch masterclass" });
    }
  });

  app.post("/api/masterclasses/book", requireAuth, async (req, res) => {
    try {
      const user = getAuthenticatedUser(req);
      const { masterclassId } = req.body;
      
      if (!masterclassId) {
        return res.status(400).json({ error: "masterclassId is required" });
      }

      // Check for duplicate booking
      const [existingBooking] = await db.select()
        .from(masterclassBookings)
        .where(and(
          eq(masterclassBookings.userId, user.id),
          eq(masterclassBookings.masterclassId, masterclassId)
        ))
        .limit(1);

      if (existingBooking) {
        return res.status(400).json({ error: "Already booked for this masterclass" });
      }

      const [masterclass] = await db.select()
        .from(masterclasses)
        .where(eq(masterclasses.id, masterclassId))
        .limit(1);

      if (!masterclass) {
        return res.status(404).json({ error: "Masterclass not found" });
      }

      // Check capacity only if maxParticipants is set (not null)
      if (masterclass.maxParticipants !== null && 
          masterclass.currentParticipants >= masterclass.maxParticipants) {
        return res.status(400).json({ error: "Masterclass is full" });
      }

      const [booking] = await db.insert(masterclassBookings)
        .values({
          userId: user.id,
          masterclassId,
        })
        .returning();

      await db.update(masterclasses)
        .set({ currentParticipants: masterclass.currentParticipants + 1 })
        .where(eq(masterclasses.id, masterclassId));

      // Generate certificate for masterclass attendance (booking = attendance in this system)
      try {
        const [userInfo] = await db.select()
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);
        
        const { generateCertificate } = await import('./services/certificates');
        await generateCertificate({
          userId: user.id,
          entityId: masterclassId,
          entityType: 'masterclass',
          userName: userInfo?.email?.split('@')[0] || `User${user.id}`,
          title: masterclass.title,
          completionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        });
      } catch (certError) {
        console.error('Failed to generate masterclass certificate:', certError);
      }

      // Send WhatsApp booking confirmation notification
      try {
        const scheduledDate = masterclass.scheduledAt 
          ? new Date(masterclass.scheduledAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          : 'TBD';
        await bigtosService.sendMasterclassBookingNotification(user.phone, masterclass.title, scheduledDate);
      } catch (notifError) {
        console.error('Failed to send masterclass booking notification:', notifError);
      }

      res.json({ success: true, booking });
    } catch (error) {
      console.error("Book masterclass error:", error);
      res.status(500).json({ error: "Failed to book masterclass" });
    }
  });

  // ===== AI TOOLS ROUTES =====
  app.post("/api/ai-tools/diagnostic", async (req, res) => {
    try {
      const validated = aiToolRequestCreateSchema.parse({
        ...req.body,
        toolType: req.body.toolType || "diagnostic_helper"
      });

      const output = `AI Analysis: Based on the provided symptoms and data, here are the diagnostic suggestions...`;
      
      // Log the request
      await db.insert(aiToolRequests).values({
        userId: validated.userId,
        toolType: validated.toolType,
        inputData: validated.inputData,
        outputData: output,
      });
      
      res.json({ output });
    } catch (error) {
      console.error("AI diagnostic error:", error);
      res.status(400).json({ error: "Failed to process AI request" });
    }
  });

  app.post("/api/ai-tools/stats", async (req, res) => {
    try {
      const validated = aiToolRequestCreateSchema.parse({
        ...req.body,
        toolType: req.body.toolType || "stats_calculator"
      });

      const output = `Statistical Analysis Results:\n- Mean: 45.2\n- Median: 44.8\n- Standard Deviation: 5.3\n- P-value: 0.032`;
      
      await db.insert(aiToolRequests).values({
        userId: validated.userId,
        toolType: validated.toolType,
        inputData: validated.inputData,
        outputData: output,
      });
      
      res.json({ output });
    } catch (error) {
      console.error("AI stats error:", error);
      res.status(400).json({ error: "Failed to process stats request" });
    }
  });

  app.post("/api/ai-tools/clinical-notes", async (req, res) => {
    try {
      const validated = aiToolRequestCreateSchema.parse({
        ...req.body,
        toolType: req.body.toolType || "clinical_notes"
      });

      const output = `CLINICAL NOTE\n\nChief Complaint: [Based on input]\n\nHistory of Present Illness:\n[AI-generated structured note]\n\nPhysical Examination:\n[AI-generated findings]\n\nAssessment and Plan:\n[AI-generated recommendations]`;
      
      await db.insert(aiToolRequests).values({
        userId: validated.userId,
        toolType: validated.toolType,
        inputData: validated.inputData,
        outputData: output,
      });
      
      res.json({ output });
    } catch (error) {
      console.error("AI clinical notes error:", error);
      res.status(400).json({ error: "Failed to generate clinical notes" });
    }
  });

  // ===== RESEARCH SERVICE ROUTES =====
  app.get("/api/research-services/requests", async (req, res) => {
    try {
      const { userId } = req.query;
      
      let query = db.select().from(researchServiceRequests);
      
      if (userId) {
        query = query.where(eq(researchServiceRequests.userId, parseInt(userId as string)));
      }
      
      const requests = await query.limit(50);
      res.json(requests);
    } catch (error) {
      console.error("Get research requests error:", error);
      res.status(500).json({ error: "Failed to fetch research requests" });
    }
  });

  app.post("/api/research-services/requests", async (req, res) => {
    try {
      const { userId, serviceType, title, description } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const validated = insertResearchServiceRequestSchema.parse({
        userId,
        serviceType,
        title,
        description,
        status: "pending",
      });
      
      const [newRequest] = await db.insert(researchServiceRequests)
        .values(validated)
        .returning();

      res.json(newRequest);
    } catch (error) {
      console.error("Create research request error:", error);
      res.status(400).json({ error: "Failed to create research request" });
    }
  });

  // Update research service request status (admin only)
  app.patch("/api/admin/research-services/requests/:id", requireAdmin, async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      if (isNaN(requestId)) {
        return res.status(400).json({ error: "Invalid request ID" });
      }

      const { status } = req.body;
      if (!status || !['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: "Valid status is required (pending, in_progress, completed, cancelled)" });
      }

      // Get the request with user info for WhatsApp notification
      const [request] = await db.select({
        id: researchServiceRequests.id,
        userId: researchServiceRequests.userId,
        title: researchServiceRequests.title,
        serviceType: researchServiceRequests.serviceType,
        userPhone: users.phone,
      })
        .from(researchServiceRequests)
        .innerJoin(users, eq(researchServiceRequests.userId, users.id))
        .where(eq(researchServiceRequests.id, requestId))
        .limit(1);

      if (!request) {
        return res.status(404).json({ error: "Research request not found" });
      }

      // Update the status
      const [updated] = await db.update(researchServiceRequests)
        .set({ status })
        .where(eq(researchServiceRequests.id, requestId))
        .returning();

      // Send WhatsApp notification about status change
      try {
        await bigtosService.sendResearchServiceNotification(
          request.userPhone, 
          request.title || request.serviceType, 
          status
        );
      } catch (notifError) {
        console.error('Failed to send research service notification:', notifError);
      }

      res.json({ success: true, request: updated });
    } catch (error) {
      console.error("Update research request error:", error);
      res.status(500).json({ error: "Failed to update research request" });
    }
  });

  // ===== DASHBOARD ROUTES =====
  app.get("/api/dashboard/user", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Get enrolled courses count
      const enrolledCourses = await db.select({ count: sql<number>`count(*)` })
        .from(enrollments)
        .where(eq(enrollments.userId, userId));

      // Get certificates count (courses + quizzes)
      const quizCertificates = await db.select({ count: sql<number>`count(*)` })
        .from(quizAttempts)
        .where(and(
          eq(quizAttempts.userId, userId),
          sql`${quizAttempts.score} >= 70`
        ));

      // Get active research requests
      const activeRequests = await db.select({ count: sql<number>`count(*)` })
        .from(researchServiceRequests)
        .where(and(
          eq(researchServiceRequests.userId, userId),
          sql`${researchServiceRequests.status} IN ('pending', 'in_progress')`
        ));

      // Get next masterclass
      const nextMasterclass = await db.select()
        .from(masterclassBookings)
        .innerJoin(masterclasses, eq(masterclassBookings.masterclassId, masterclasses.id))
        .where(and(
          eq(masterclassBookings.userId, userId),
          sql`${masterclasses.eventDate} > NOW()`
        ))
        .orderBy(masterclasses.eventDate)
        .limit(1);

      // Get doctor profile completeness
      const [profile] = await db.select()
        .from(doctorProfiles)
        .where(eq(doctorProfiles.userId, userId))
        .limit(1);

      let profileCompleteness = 20; // Base for having account
      if (profile) {
        if (profile.name) profileCompleteness += 20;
        if (profile.specialty) profileCompleteness += 20;
        if (profile.experience) profileCompleteness += 20;
        if (profile.education) profileCompleteness += 20;
      }

      res.json({
        profileCompleteness,
        enrolledCourses: enrolledCourses[0]?.count || 0,
        certificates: (enrolledCourses[0]?.count || 0) + (quizCertificates[0]?.count || 0),
        activeRequests: activeRequests[0]?.count || 0,
        nextMasterclass: nextMasterclass[0]?.masterclasses || null,
        quizRank: '-',
        recentActivity: []
      });
    } catch (error) {
      console.error("Get user dashboard error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // ===== ADMIN ROUTES =====
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      // Get user statistics
      const userStatsResult = await db.execute(sql`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN role = 'doctor' THEN 1 END) as total_doctors,
          COUNT(CASE WHEN role = 'student' THEN 1 END) as total_students
        FROM users
      `);
      const userStats = userStatsResult.rows[0];

      // Get job statistics
      const jobStatsResult = await db.execute(sql`
        SELECT COUNT(*) as active_jobs FROM jobs WHERE is_active = true
      `);
      const jobStats = jobStatsResult.rows[0];

      // Get course statistics
      const courseStatsResult = await db.execute(sql`
        SELECT COUNT(*) as total_courses FROM courses
      `);
      const courseStats = courseStatsResult.rows[0];

      res.json({
        totalUsers: parseInt(userStats.total_users as string) || 0,
        totalDoctors: parseInt(userStats.total_doctors as string) || 0,
        totalStudents: parseInt(userStats.total_students as string) || 0,
        activeJobs: parseInt(jobStats.active_jobs as string) || 0,
        totalCourses: parseInt(courseStats.total_courses as string) || 0,
      });
    } catch (error) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const allUsers = await db.select().from(users).limit(100);
      res.json(allUsers);
    } catch (error) {
      console.error("Get admin users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // ===== HOSPITAL ROUTES =====
  app.get("/api/hospitals", async (req, res) => {
    try {
      const allHospitals = await db.select().from(hospitals).limit(50);
      res.json(allHospitals);
    } catch (error) {
      console.error("Get hospitals error:", error);
      res.status(500).json({ error: "Failed to fetch hospitals" });
    }
  });

  // ===== OBJECT STORAGE ROUTES =====
  // Endpoint to get presigned upload URL and object path
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      
      // Extract object path from upload URL for ACL setting
      const url = new URL(uploadURL);
      const objectPath = objectStorageService.normalizeObjectEntityPath(url.pathname);
      
      res.json({ uploadURL, objectPath });
    } catch (error) {
      console.error("Upload URL error:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Endpoint to set ACL for profile images
  app.put("/api/profile-images", async (req, res) => {
    try {
      const { userId, imagePaths } = req.body;
      if (!userId || !imagePaths) {
        return res.status(400).json({ error: "userId and imagePaths are required" });
      }

      const objectStorageService = new ObjectStorageService();

      // Set ACL policy for each image path
      for (const [key, path] of Object.entries(imagePaths)) {
        await objectStorageService.trySetObjectEntityAclPolicy(
          path as string,
          {
            owner: userId.toString(),
            visibility: "public", // Profile images are public
          }
        );
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Set profile images error:", error);
      res.status(500).json({ error: "Failed to set profile images" });
    }
  });

  // Endpoint to serve objects with ACL check
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      
      // For now, just serve the file - ACL check can be added for private files
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Object access error:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  // ===== WHATSAPP NOTIFICATION ROUTES =====
  // Note: All endpoints require authentication via requireAuth middleware
  
  app.post("/api/notifications/course-enrollment", requireAuth, async (req, res) => {
    try {
      const authenticatedUser = getAuthenticatedUser(req);
      const { courseName } = req.body;
      
      if (!courseName) {
        return res.status(400).json({ error: "courseName is required" });
      }

      await bigtosService.sendCourseEnrollmentNotification(authenticatedUser.phone, courseName);
      res.json({ success: true, message: "Enrollment notification sent" });
    } catch (error) {
      console.error("Send enrollment notification error:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  app.post("/api/notifications/quiz-certificate", requireAuth, async (req, res) => {
    try {
      const authenticatedUser = getAuthenticatedUser(req);
      const { quizName, score } = req.body;
      
      if (!quizName || score === undefined) {
        return res.status(400).json({ error: "quizName and score are required" });
      }

      await bigtosService.sendQuizCertificateNotification(authenticatedUser.phone, quizName, score);
      res.json({ success: true, message: "Quiz certificate notification sent" });
    } catch (error) {
      console.error("Send quiz notification error:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  app.post("/api/notifications/masterclass-booking", requireAuth, async (req, res) => {
    try {
      const authenticatedUser = getAuthenticatedUser(req);
      const { masterclassName, scheduledAt } = req.body;
      
      if (!masterclassName || !scheduledAt) {
        return res.status(400).json({ error: "masterclassName and scheduledAt are required" });
      }

      await bigtosService.sendMasterclassBookingNotification(authenticatedUser.phone, masterclassName, scheduledAt);
      res.json({ success: true, message: "Masterclass booking notification sent" });
    } catch (error) {
      console.error("Send masterclass notification error:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  app.post("/api/notifications/research-service", requireAuth, async (req, res) => {
    try {
      const authenticatedUser = getAuthenticatedUser(req);
      const { serviceName, status } = req.body;
      
      if (!serviceName || !status) {
        return res.status(400).json({ error: "serviceName and status are required" });
      }

      await bigtosService.sendResearchServiceNotification(authenticatedUser.phone, serviceName, status);
      res.json({ success: true, message: "Research service notification sent" });
    } catch (error) {
      console.error("Send research notification error:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  const httpServer = createServer(app);

  // ===== WEBSOCKET SERVER FOR REAL-TIME QUIZ =====
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket upgrade with session verification
  httpServer.on('upgrade', (req: IncomingMessage, socket, head) => {
    if (req.url !== '/ws/quiz') {
      socket.destroy();
      return;
    }

    // Parse session from cookie
    sessionParser(req as any, {} as any, async () => {
      const session = (req as any).session;
      
      if (!session || !session.userId) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      // Load authenticated user from database
      const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
      
      if (!user) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      // Attach verified user to request
      (req as any).user = user;

      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    });
  });

  // Store quiz rooms and participants
  interface QuizClient {
    ws: WebSocket;
    userId: number;
    quizId: number;
    username: string;
    role: string;
  }

  const quizRooms = new Map<number, Set<QuizClient>>();

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const user = (req as any).user; // Server-verified user from session
    let currentClient: QuizClient | null = null;

    ws.on("message", async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case "join":
            // Join a quiz room using server-verified user
            const { quizId } = message;
            
            if (!quizId) {
              ws.send(JSON.stringify({ type: "error", message: "Quiz ID required" }));
              return;
            }

            if (!quizRooms.has(quizId)) {
              quizRooms.set(quizId, new Set());
            }

            currentClient = { 
              ws, 
              userId: user.id, 
              quizId, 
              username: user.phone || `User${user.id}`,
              role: user.role 
            };
            quizRooms.get(quizId)!.add(currentClient);

            // Broadcast participant count
            const participantCount = quizRooms.get(quizId)!.size;
            broadcast(quizId, {
              type: "participant_update",
              count: participantCount,
              participants: Array.from(quizRooms.get(quizId)!).map(c => ({
                userId: c.userId,
                username: c.username,
              })),
            });
            break;

          case "start_quiz":
            // Admin starts the quiz (server-verified admin only)
            if (!currentClient) {
              ws.send(JSON.stringify({ type: "error", message: "Must join quiz first" }));
              return;
            }
            if (user.role === 'admin') {
              broadcast(currentClient.quizId, {
                type: "quiz_started",
                timestamp: new Date().toISOString(),
              });
            } else {
              ws.send(JSON.stringify({ type: "error", message: "Admin access required" }));
            }
            break;

          case "broadcast_question":
            // Admin broadcasts next question (server-verified admin only)
            if (!currentClient) {
              ws.send(JSON.stringify({ type: "error", message: "Must join quiz first" }));
              return;
            }
            if (user.role === 'admin') {
              const { questionData, questionNumber, timeLimit } = message;
              broadcast(currentClient.quizId, {
                type: "question",
                questionNumber,
                question: questionData,
                timeLimit,
                timestamp: new Date().toISOString(),
              });
            } else {
              ws.send(JSON.stringify({ type: "error", message: "Admin access required" }));
            }
            break;

          case "submit_answer":
            // User submits an answer (using server-verified user ID)
            const { questionId, selectedOption, correctAnswer, responseTime } = message;
            
            if (!currentClient) {
              ws.send(JSON.stringify({ type: "error", message: "Not joined to quiz" }));
              return;
            }

            // Calculate score (e.g., 10 points for correct answer)
            const isCorrect = selectedOption === correctAnswer;
            const score = isCorrect ? 10 : 0;

            // Save response to database using server-verified user ID
            await db.insert(quizResponses).values({
              quizId: currentClient.quizId,
              questionId,
              userId: user.id, // Server-verified user ID
              selectedOption,
              isCorrect,
              responseTime: responseTime || 0,
              score,
            });

            // Update or create leaderboard entry using server-verified user ID
            const [existingEntry] = await db
              .select()
              .from(quizLeaderboard)
              .where(
                and(
                  eq(quizLeaderboard.quizId, currentClient.quizId),
                  eq(quizLeaderboard.userId, user.id)
                )
              )
              .limit(1);

            if (existingEntry) {
              // Update existing entry
              await db
                .update(quizLeaderboard)
                .set({
                  totalScore: (existingEntry.totalScore || 0) + score,
                })
                .where(eq(quizLeaderboard.id, existingEntry.id));
            } else {
              // Create new entry
              await db.insert(quizLeaderboard).values({
                quizId: currentClient.quizId,
                userId: user.id, // Server-verified user ID
                totalScore: score,
              });
            }

            // Recalculate ranks
            await recalculateQuizRanks(currentClient.quizId);

            // Broadcast updated leaderboard
            const leaderboardData = await db
              .select()
              .from(quizLeaderboard)
              .where(eq(quizLeaderboard.quizId, currentClient.quizId))
              .orderBy(sql`rank ASC`)
              .limit(10);

            broadcast(currentClient.quizId, {
              type: "leaderboard_update",
              leaderboard: leaderboardData,
            });
            break;

          case "end_quiz":
            // Admin ends the quiz (server-verified admin only)
            if (!currentClient) {
              ws.send(JSON.stringify({ type: "error", message: "Must join quiz first" }));
              return;
            }
            if (user.role === 'admin') {
              broadcast(currentClient.quizId, {
                type: "quiz_ended",
                timestamp: new Date().toISOString(),
              });
            } else {
              ws.send(JSON.stringify({ type: "error", message: "Admin access required" }));
            }
            break;

          case "timer_tick":
            // Countdown timer update (server-verified admin only)
            if (!currentClient) {
              ws.send(JSON.stringify({ type: "error", message: "Must join quiz first" }));
              return;
            }
            if (user.role === 'admin') {
              const { secondsRemaining } = message;
              broadcast(currentClient.quizId, {
                type: "timer_update",
                secondsRemaining,
              });
            } else {
              ws.send(JSON.stringify({ type: "error", message: "Admin access required" }));
            }
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
        ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
      }
    });

    ws.on("close", () => {
      // Remove client from room
      if (currentClient) {
        const room = quizRooms.get(currentClient.quizId);
        if (room) {
          room.delete(currentClient);
          
          // Broadcast updated participant count
          if (room.size > 0) {
            broadcast(currentClient.quizId, {
              type: "participant_update",
              count: room.size,
              participants: Array.from(room).map(c => ({
                userId: c.userId,
                username: c.username,
              })),
            });
          }

          // Clean up empty rooms
          if (room.size === 0) {
            quizRooms.delete(currentClient.quizId);
          }
        }
        currentClient = null;
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      // Clean up on error
      if (currentClient) {
        const room = quizRooms.get(currentClient.quizId);
        if (room) {
          room.delete(currentClient);
        }
      }
    });
  });

  function broadcast(quizId: number, message: any) {
    const room = quizRooms.get(quizId);
    if (room) {
      const messageStr = JSON.stringify(message);
      room.forEach((client) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(messageStr);
        }
      });
    }
  }

  return httpServer;
}

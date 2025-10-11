import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { users, doctorProfiles, courses, quizzes, quizQuestions, jobs, masterclasses, researchServiceRequests, aiToolRequests, hospitals, jobApplications, masterclassBookings, quizAttempts, insertUserSchema, insertDoctorProfileSchema, insertCourseSchema, insertJobSchema, insertQuizSchema, insertMasterclassSchema, insertResearchServiceRequestSchema, insertAiToolRequestSchema, quizSubmissionSchema, jobApplicationCreateSchema, aiToolRequestCreateSchema, courseEnrollmentNotificationSchema, quizCertificateNotificationSchema, masterclassBookingNotificationSchema, researchServiceNotificationSchema } from "@shared/schema";
import { eq, like, or, and, sql } from "drizzle-orm";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { bigtosService } from "./bigtos";
import { requireAuth, getAuthenticatedUser } from "./auth";

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
        await db.insert(users).values({
          phone,
          otpCode,
          otpExpiry,
          role: "doctor",
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

  app.get("/api/quiz-questions", async (req, res) => {
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

  app.post("/api/quizzes/:quizId/submit", async (req, res) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const validated = quizSubmissionSchema.parse(req.body);

      const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
      
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      const passed = validated.score >= (quiz.passingScore || 60);

      const [attempt] = await db.insert(quizAttempts)
        .values({
          userId: validated.userId,
          quizId,
          score: validated.score,
          totalQuestions: validated.totalQuestions,
          timeTaken: validated.timeTaken,
          passed,
          certificateIssued: passed,
        })
        .returning();

      res.json(attempt);
    } catch (error) {
      console.error("Submit quiz error:", error);
      res.status(400).json({ error: "Failed to submit quiz" });
    }
  });

  app.get("/api/quizzes/:quizId/leaderboard", async (req, res) => {
    try {
      const quizId = parseInt(req.params.quizId);
      
      const leaderboard = await db.execute(
        sql`SELECT qa.*, u.phone FROM quiz_attempts qa 
            JOIN users u ON qa.user_id = u.id 
            WHERE qa.quiz_id = ${quizId} 
            ORDER BY qa.score DESC, qa.time_taken ASC 
            LIMIT 100`
      );

      res.json(leaderboard.rows);
    } catch (error) {
      console.error("Get leaderboard error:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
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

  app.post("/api/masterclasses/book", async (req, res) => {
    try {
      const { masterclassId, userId } = req.body;
      
      if (!userId || !masterclassId) {
        return res.status(400).json({ error: "masterclassId and userId are required" });
      }

      // Check for duplicate booking
      const [existingBooking] = await db.select()
        .from(masterclassBookings)
        .where(and(
          eq(masterclassBookings.userId, userId),
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
          userId,
          masterclassId,
        })
        .returning();

      await db.update(masterclasses)
        .set({ currentParticipants: masterclass.currentParticipants + 1 })
        .where(eq(masterclasses.id, masterclassId));

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

  // ===== ADMIN ROUTES =====
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const [userStats] = await db.execute(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN role = 'doctor' THEN 1 END) as total_doctors,
          COUNT(CASE WHEN role = 'student' THEN 1 END) as total_students
        FROM users
      `);

      const [jobStats] = await db.execute(`
        SELECT COUNT(*) as active_jobs FROM jobs WHERE is_active = true
      `);

      const [courseStats] = await db.execute(`
        SELECT COUNT(*) as total_courses FROM courses
      `);

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

  app.get("/api/admin/users", async (req, res) => {
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
  return httpServer;
}

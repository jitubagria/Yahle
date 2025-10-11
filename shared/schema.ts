import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, integer, boolean, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "doctor", "student", "service_provider"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const maritalStatusEnum = pgEnum("marital_status", ["single", "married", "divorced", "widowed"]);
export const serviceStatusEnum = pgEnum("service_status", ["pending", "in_progress", "completed", "cancelled"]);
export const quizStatusEnum = pgEnum("quiz_status", ["draft", "active", "archived"]);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 255 }).unique(),
  role: userRoleEnum("role").notNull().default("doctor"),
  otpCode: varchar("otp_code", { length: 10 }),
  otpExpiry: timestamp("otp_expiry"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Doctor profiles table with exact fields from user requirements
export const doctorProfiles = pgTable("doctor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  
  // Profile General
  email: varchar("email", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  middleName: varchar("middle_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  dob: date("dob"),
  gender: genderEnum("gender"),
  marriatialstatus: maritalStatusEnum("marriatialstatus"),
  professionaldegree: varchar("professionaldegree", { length: 255 }),
  profilePic: text("profile_pic"),
  thumbl: text("thumbl"),
  thumbs: text("thumbs"),
  thumbimage: text("thumbimage"),
  
  // Contact
  userMobile: varchar("user_mobile", { length: 20 }),
  alternateno: varchar("alternateno", { length: 20 }),
  userWebsite: varchar("user_website", { length: 255 }),
  userFacebook: varchar("user_facebook", { length: 255 }),
  userTwitter: varchar("user_twitter", { length: 255 }),
  userInstagram: varchar("user_instagram", { length: 255 }),
  contactOthers: text("contact_others"),
  
  // Academic
  ugAdmissionYear: varchar("ug_admission_year", { length: 10 }),
  ugLocation: varchar("ug_location", { length: 255 }),
  ugCollege: varchar("ug_college", { length: 255 }),
  pgAdmissionYear: varchar("pg_admission_year", { length: 10 }),
  pgLocation: varchar("pg_location", { length: 255 }),
  pgCollege: varchar("pg_college", { length: 255 }),
  pgType: varchar("pg_type", { length: 100 }),
  pgBranch: varchar("pg_branch", { length: 100 }),
  ssAdmissionYear: varchar("ss_admission_year", { length: 10 }),
  ssLocation: varchar("ss_location", { length: 255 }),
  ssCollege: varchar("ss_college", { length: 255 }),
  ssType: varchar("ss_type", { length: 100 }),
  ssBranch: varchar("ss_branch", { length: 100 }),
  additionalqualificationCourse: varchar("additionalqualification_course", { length: 255 }),
  additionalqualificationAdmissionYear: varchar("additionalqualification_admission_year", { length: 10 }),
  additionalqualificationLocation: varchar("additionalqualification_location", { length: 255 }),
  additionalqualificationCollege: varchar("additionalqualification_college", { length: 255 }),
  additionalqualificationDetails: text("additionalqualification_details"),
  
  // Job
  jobSector: varchar("job_sector", { length: 100 }),
  jobCountry: varchar("job_country", { length: 100 }),
  jobState: varchar("job_state", { length: 100 }),
  jobCity: varchar("job_city", { length: 100 }),
  jobCentralSub: varchar("job_central_sub", { length: 100 }),
  centralOthers: varchar("central_others", { length: 255 }),
  jobStateSub: varchar("job_state_sub", { length: 100 }),
  stateOthers: varchar("state_others", { length: 255 }),
  jobPrivateHospital: varchar("job_private_hospital", { length: 255 }),
  jobAddedPrivateHospital: varchar("job_added_private_hospital", { length: 255 }),
  jobMedicalcollege: varchar("job_medicalcollege", { length: 255 }),
  jobRajDistrict: varchar("job_raj_district", { length: 100 }),
  jobRajBlock: varchar("job_raj_block", { length: 100 }),
  jobRajPlace: varchar("job_raj_place", { length: 100 }),
  jaipurarea: varchar("jaipurarea", { length: 100 }),
  
  // Flags
  isprofilecomplete: boolean("isprofilecomplete").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hospitals table
export const hospitals = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }).default("India"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 255 }),
  specialties: text("specialties"),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  instructor: varchar("instructor", { length: 255 }),
  duration: integer("duration"), // in hours
  price: integer("price").default(0),
  thumbnailImage: text("thumbnail_image"),
  enrollmentCount: integer("enrollment_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enrollments table
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  progress: integer("progress").default(0), // percentage 0-100
  completedAt: timestamp("completed_at"),
  certificateIssued: boolean("certificate_issued").default(false),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});

// Masterclasses table
export const masterclasses = pgTable("masterclasses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  instructor: varchar("instructor", { length: 255 }),
  eventDate: timestamp("event_date").notNull(),
  duration: integer("duration"), // in minutes
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  price: integer("price").default(0),
  location: varchar("location", { length: 255 }), // or online platform
  thumbnailImage: text("thumbnail_image"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Masterclass bookings
export const masterclassBookings = pgTable("masterclass_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  masterclassId: integer("masterclass_id").references(() => masterclasses.id).notNull(),
  bookedAt: timestamp("booked_at").defaultNow(),
});

// Quizzes table
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  timeLimit: integer("time_limit"), // in minutes
  passingScore: integer("passing_score").default(60), // percentage
  status: quizStatusEnum("status").default("active"),
  certificateTemplate: text("certificate_template"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz questions table
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  questionText: text("question_text").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctOption: varchar("correct_option", { length: 1 }).notNull(), // A, B, C, or D
  orderIndex: integer("order_index").default(0),
});

// Quiz attempts table
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  timeTaken: integer("time_taken"), // in seconds
  passed: boolean("passed").default(false),
  certificateIssued: boolean("certificate_issued").default(false),
  attemptedAt: timestamp("attempted_at").defaultNow(),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  hospitalId: integer("hospital_id").references(() => hospitals.id),
  hospitalName: varchar("hospital_name", { length: 255 }),
  specialty: varchar("specialty", { length: 255 }),
  location: varchar("location", { length: 255 }),
  state: varchar("state", { length: 100 }),
  city: varchar("city", { length: 100 }),
  experienceRequired: varchar("experience_required", { length: 100 }),
  salaryRange: varchar("salary_range", { length: 100 }),
  jobType: varchar("job_type", { length: 50 }), // full-time, part-time, contract
  description: text("description"),
  requirements: text("requirements"),
  postedBy: integer("posted_by").references(() => users.id),
  isActive: boolean("is_active").default(true),
  postedAt: timestamp("posted_at").defaultNow(),
});

// Job applications table
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  coverLetter: text("cover_letter"),
  status: varchar("status", { length: 50 }).default("pending"), // pending, reviewed, shortlisted, rejected
  appliedAt: timestamp("applied_at").defaultNow(),
});

// AI tool requests table
export const aiToolRequests = pgTable("ai_tool_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  toolType: varchar("tool_type", { length: 100 }).notNull(), // diagnostic_helper, stats_calculator, clinical_notes
  inputData: text("input_data").notNull(),
  outputData: text("output_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Research service requests table
export const researchServiceRequests = pgTable("research_service_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  serviceType: varchar("service_type", { length: 100 }).notNull(), // article_writing, thesis_support, statistical_consulting
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: serviceStatusEnum("status").default("pending"),
  assignedTo: integer("assigned_to").references(() => users.id),
  estimatedCost: integer("estimated_cost"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// BigTos WhatsApp messages log table
export const bigtosMessages = pgTable("bigtos_messages", {
  id: serial("id").primaryKey(),
  mobile: varchar("mobile", { length: 20 }).notNull(),
  message: text("message").notNull(),
  imageUrl: text("image_url"),
  type: varchar("type", { length: 20 }).notNull(), // Text or Image
  apiResponse: text("api_response"),
  status: varchar("status", { length: 20 }).notNull(), // success or failed
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  doctorProfile: one(doctorProfiles, {
    fields: [users.id],
    references: [doctorProfiles.userId],
  }),
  enrollments: many(enrollments),
  quizAttempts: many(quizAttempts),
  jobApplications: many(jobApplications),
  aiToolRequests: many(aiToolRequests),
  researchServiceRequests: many(researchServiceRequests),
  masterclassBookings: many(masterclassBookings),
}));

export const doctorProfilesRelations = relations(doctorProfiles, ({ one }) => ({
  user: one(users, {
    fields: [doctorProfiles.userId],
    references: [users.id],
  }),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  enrollments: many(enrollments),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(quizQuestions),
  attempts: many(quizAttempts),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  hospital: one(hospitals, {
    fields: [jobs.hospitalId],
    references: [hospitals.id],
  }),
  applications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  job: one(jobs, {
    fields: [jobApplications.jobId],
    references: [jobs.id],
  }),
  user: one(users, {
    fields: [jobApplications.userId],
    references: [users.id],
  }),
}));

export const masterclassesRelations = relations(masterclasses, ({ many }) => ({
  bookings: many(masterclassBookings),
}));

export const masterclassBookingsRelations = relations(masterclassBookings, ({ one }) => ({
  user: one(users, {
    fields: [masterclassBookings.userId],
    references: [users.id],
  }),
  masterclass: one(masterclasses, {
    fields: [masterclassBookings.masterclassId],
    references: [masterclasses.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDoctorProfileSchema = createInsertSchema(doctorProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHospitalSchema = createInsertSchema(hospitals).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertMasterclassSchema = createInsertSchema(masterclasses).omit({
  id: true,
  createdAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  attemptedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  postedAt: true,
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  appliedAt: true,
});

export const insertAiToolRequestSchema = createInsertSchema(aiToolRequests).omit({
  id: true,
  createdAt: true,
});

export const insertResearchServiceRequestSchema = createInsertSchema(researchServiceRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMasterclassBookingSchema = createInsertSchema(masterclassBookings).omit({
  id: true,
  bookedAt: true,
});

export const insertBigtosMessageSchema = createInsertSchema(bigtosMessages).omit({
  id: true,
  createdAt: true,
});

// Additional validation schemas for API endpoints
export const quizSubmissionSchema = z.object({
  userId: z.number(),
  score: z.number(),
  totalQuestions: z.number(),
  timeTaken: z.number().optional(),
});

export const jobApplicationCreateSchema = z.object({
  userId: z.number(),
  coverLetter: z.string().optional(),
});

export const aiToolRequestCreateSchema = z.object({
  userId: z.number(),
  toolType: z.string(),
  inputData: z.string(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type DoctorProfile = typeof doctorProfiles.$inferSelect;
export type InsertDoctorProfile = z.infer<typeof insertDoctorProfileSchema>;

export type Hospital = typeof hospitals.$inferSelect;
export type InsertHospital = z.infer<typeof insertHospitalSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type Masterclass = typeof masterclasses.$inferSelect;
export type InsertMasterclass = z.infer<typeof insertMasterclassSchema>;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;

export type AiToolRequest = typeof aiToolRequests.$inferSelect;
export type InsertAiToolRequest = z.infer<typeof insertAiToolRequestSchema>;

export type ResearchServiceRequest = typeof researchServiceRequests.$inferSelect;
export type InsertResearchServiceRequest = z.infer<typeof insertResearchServiceRequestSchema>;

export type MasterclassBooking = typeof masterclassBookings.$inferSelect;
export type InsertMasterclassBooking = z.infer<typeof insertMasterclassBookingSchema>;

export type BigtosMessage = typeof bigtosMessages.$inferSelect;
export type InsertBigtosMessage = z.infer<typeof insertBigtosMessageSchema>;

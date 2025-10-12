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
export const quizStatusEnum = pgEnum("quiz_status", ["draft", "active", "completed", "archived"]);
export const quizDifficultyEnum = pgEnum("quiz_difficulty", ["beginner", "intermediate", "advanced"]);
export const quizTypeEnum = pgEnum("quiz_type", ["free", "paid", "live", "practice"]);
export const quizSessionStatusEnum = pgEnum("quiz_session_status", ["waiting", "running", "finished"]);
export const contentTypeEnum = pgEnum("content_type", ["video", "pdf", "text", "quiz"]);
export const paymentStatusEnum = pgEnum("payment_status", ["free", "paid", "refunded"]);
export const entityTypeEnum = pgEnum("entity_type", ["course", "quiz", "masterclass"]);

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
  paymentStatus: paymentStatusEnum("payment_status").default("free"),
  paymentId: varchar("payment_id", { length: 100 }),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});

// Course Modules table - lessons/chapters within courses
export const courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  contentType: contentTypeEnum("content_type").notNull(),
  contentUrl: text("content_url"),
  orderNo: integer("order_no").notNull(),
  duration: integer("duration"), // in minutes
  isPreview: boolean("is_preview").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Course Progress table - tracks module completion per enrollment
export const courseProgress = pgTable("course_progress", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").references(() => enrollments.id).notNull(),
  moduleId: integer("module_id").references(() => courseModules.id).notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
});

// Course Certificates table
export const courseCertificates = pgTable("course_certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  certificateNumber: varchar("certificate_number", { length: 100 }).notNull().unique(),
  certificateUrl: text("certificate_url"),
  issuedAt: timestamp("issued_at").defaultNow(),
  sentWhatsapp: boolean("sent_whatsapp").default(false),
}, (table) => ({
  // Unique constraint to prevent duplicate certificates for same user and course
  uniqueUserCourse: sql`UNIQUE (user_id, course_id)`,
}));

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

// Quizzes table - Enhanced for real-time quiz system
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }), // Specialty
  difficulty: quizDifficultyEnum("difficulty").default("beginner"),
  type: quizTypeEnum("type").default("free"),
  totalQuestions: integer("total_questions").default(0),
  questionTime: integer("question_time").default(30), // seconds per question
  duration: integer("duration"), // Total seconds (calculated or custom)
  passingScore: integer("passing_score").default(60), // percentage
  entryFee: integer("entry_fee").default(0), // in paise/cents
  rewardInfo: text("reward_info"), // Prize details
  certificateType: varchar("certificate_type", { length: 100 }),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  status: quizStatusEnum("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quiz questions table - Enhanced with JSONB options and images
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  questionText: text("question_text").notNull(),
  image: text("image"), // Optional question image
  options: text("options").notNull(), // JSONB stored as text: {"A":"...","B":"...","C":"...","D":"..."}
  correctOption: varchar("correct_option", { length: 1 }).notNull(), // A, B, C, or D
  marks: integer("marks").default(1),
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

// Quiz sessions table - For real-time quiz sessions
export const quizSessions = pgTable("quiz_sessions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  currentQuestion: integer("current_question").default(0), // Question index
  startedAt: timestamp("started_at"),
  status: quizSessionStatusEnum("status").default("waiting"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz responses table - Individual question responses
export const quizResponses = pgTable("quiz_responses", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  questionId: integer("question_id").references(() => quizQuestions.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  selectedOption: varchar("selected_option", { length: 1 }), // A, B, C, or D
  isCorrect: boolean("is_correct").default(false),
  responseTime: integer("response_time"), // seconds taken to answer
  score: integer("score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz leaderboard table - Final rankings
export const quizLeaderboard = pgTable("quiz_leaderboard", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  totalScore: integer("total_score").default(0),
  avgTime: integer("avg_time"), // Average response time in seconds
  rank: integer("rank"),
  certificateUrl: text("certificate_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Entity Templates - Certificate templates for courses, quizzes, masterclasses
export const entityTemplates = pgTable("entity_templates", {
  id: serial("id").primaryKey(),
  entityType: entityTypeEnum("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  backgroundImage: text("background_image").notNull(),
  font: varchar("font", { length: 100 }).default("Arial"),
  textColor: varchar("text_color", { length: 20 }).default("#000000"),
  textPositions: text("text_positions").notNull(), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniqueEntityTemplate: sql`UNIQUE (entity_type, entity_id)`,
}));

// Certificates table - All certificates (quiz, course, etc.)
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  entityType: entityTypeEnum("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  rank: varchar("rank", { length: 50 }),
  score: varchar("score", { length: 50 }),
  backgroundImage: text("background_image"),
  outputUrl: text("output_url"),
  sentStatus: boolean("sent_status").default(false),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
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
  sessions: many(quizSessions),
  responses: many(quizResponses),
  leaderboard: many(quizLeaderboard),
  certificates: many(certificates),
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

export const quizSessionsRelations = relations(quizSessions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizSessions.quizId],
    references: [quizzes.id],
  }),
}));

export const quizResponsesRelations = relations(quizResponses, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizResponses.quizId],
    references: [quizzes.id],
  }),
  question: one(quizQuestions, {
    fields: [quizResponses.questionId],
    references: [quizQuestions.id],
  }),
  user: one(users, {
    fields: [quizResponses.userId],
    references: [users.id],
  }),
}));

export const quizLeaderboardRelations = relations(quizLeaderboard, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizLeaderboard.quizId],
    references: [quizzes.id],
  }),
  user: one(users, {
    fields: [quizLeaderboard.userId],
    references: [users.id],
  }),
}));

export const entityTemplatesRelations = relations(entityTemplates, ({ one }) => ({
  course: one(courses, {
    fields: [entityTemplates.entityId],
    references: [courses.id],
  }),
  quiz: one(quizzes, {
    fields: [entityTemplates.entityId],
    references: [quizzes.id],
  }),
  masterclass: one(masterclasses, {
    fields: [entityTemplates.entityId],
    references: [masterclasses.id],
  }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
  user: one(users, {
    fields: [certificates.userId],
    references: [users.id],
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

export const adminUpdateUserSchema = z.object({
  role: z.enum(['admin', 'doctor', 'student', 'service_provider']).optional(),
  email: z.string().email().optional().or(z.literal('')),
  isVerified: z.boolean().optional(),
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

export const insertCourseModuleSchema = createInsertSchema(courseModules).omit({
  id: true,
  createdAt: true,
});

export const insertCourseProgressSchema = createInsertSchema(courseProgress).omit({
  id: true,
});

export const insertCourseCertificateSchema = createInsertSchema(courseCertificates).omit({
  id: true,
  issuedAt: true,
});

export const insertMasterclassSchema = createInsertSchema(masterclasses).omit({
  id: true,
  createdAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  attemptedAt: true,
});

export const insertQuizSessionSchema = createInsertSchema(quizSessions).omit({
  id: true,
  createdAt: true,
});

export const insertQuizResponseSchema = createInsertSchema(quizResponses).omit({
  id: true,
  createdAt: true,
});

export const insertQuizLeaderboardSchema = createInsertSchema(quizLeaderboard).omit({
  id: true,
  createdAt: true,
});

export const insertEntityTemplateSchema = createInsertSchema(entityTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  createdAt: true,
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

// WhatsApp notification schemas
export const courseEnrollmentNotificationSchema = z.object({
  userId: z.number(),
  phone: z.string().min(10),
  courseName: z.string().min(1),
});

export const quizCertificateNotificationSchema = z.object({
  userId: z.number(),
  phone: z.string().min(10),
  quizName: z.string().min(1),
  score: z.number().min(0).max(100),
});

export const masterclassBookingNotificationSchema = z.object({
  userId: z.number(),
  phone: z.string().min(10),
  masterclassName: z.string().min(1),
  scheduledAt: z.string().min(1),
});

export const researchServiceNotificationSchema = z.object({
  userId: z.number(),
  phone: z.string().min(10),
  serviceName: z.string().min(1),
  status: z.string().min(1),
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

export type CourseModule = typeof courseModules.$inferSelect;
export type InsertCourseModule = z.infer<typeof insertCourseModuleSchema>;

export type CourseProgress = typeof courseProgress.$inferSelect;
export type InsertCourseProgress = z.infer<typeof insertCourseProgressSchema>;

export type CourseCertificate = typeof courseCertificates.$inferSelect;
export type InsertCourseCertificate = z.infer<typeof insertCourseCertificateSchema>;

export type Masterclass = typeof masterclasses.$inferSelect;
export type InsertMasterclass = z.infer<typeof insertMasterclassSchema>;

export type EntityTemplate = typeof entityTemplates.$inferSelect;
export type InsertEntityTemplate = z.infer<typeof insertEntityTemplateSchema>;

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

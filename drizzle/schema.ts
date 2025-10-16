import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, varchar, text, datetime, mysqlEnum, unique, date, index, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const aiToolRequests = mysqlTable("ai_tool_requests", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	toolType: varchar("tool_type", { length: 100 }).notNull(),
	inputData: text("input_data").notNull(),
	outputData: text("output_data").default(sql`NULL`),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const bigtosMessages = mysqlTable("bigtos_messages", {
	id: int().autoincrement().notNull(),
	mobile: varchar({ length: 20 }).notNull(),
	message: text().notNull(),
	imageUrl: text("image_url").default(sql`NULL`),
	type: varchar({ length: 20 }).notNull(),
	apiResponse: text("api_response").default(sql`NULL`),
	status: varchar({ length: 20 }).notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const certificates = mysqlTable("certificates", {
	id: int().autoincrement().notNull(),
	entityType: mysqlEnum("entity_type", ['course','quiz','masterclass']).notNull(),
	entityId: int("entity_id").notNull(),
	userId: int("user_id").notNull(),
	name: varchar({ length: 150 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	rank: varchar({ length: 50 }).default(sql`NULL`),
	score: varchar({ length: 50 }).default(sql`NULL`),
	backgroundImage: text("background_image").default(sql`NULL`),
	outputUrl: text("output_url").default(sql`NULL`),
	sentStatus: tinyint("sent_status").default(0),
	sentAt: datetime("sent_at", { mode: 'string'}).default(sql`NULL`),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const courses = mysqlTable("courses", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().default(sql`NULL`),
	instructor: varchar({ length: 255 }).default(sql`NULL`),
	duration: int().default(sql`NULL`),
	price: int().default(0),
	thumbnailImage: text("thumbnail_image").default(sql`NULL`),
	enrollmentCount: int("enrollment_count").default(0),
	isActive: tinyint("is_active").default(1),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const courseCertificates = mysqlTable("course_certificates", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	courseId: int("course_id").notNull(),
	certificateUrl: text("certificate_url").default(sql`NULL`),
	issuedAt: datetime("issued_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	sentWhatsapp: tinyint("sent_whatsapp").default(0),
	certificateNumber: varchar("certificate_number", { length: 100 }).notNull(),
},
(table) => [
	unique("certificate_number").on(table.certificateNumber),
]);

export const courseModules = mysqlTable("course_modules", {
	id: int().autoincrement().notNull(),
	courseId: int("course_id").notNull(),
	title: varchar({ length: 255 }).notNull(),
	contentType: mysqlEnum("content_type", ['video','pdf','text','quiz']).notNull(),
	contentUrl: text("content_url").default(sql`NULL`),
	orderNo: int("order_no").notNull(),
	duration: int().default(sql`NULL`),
	isPreview: tinyint("is_preview").default(0),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const courseProgress = mysqlTable("course_progress", {
	id: int().autoincrement().notNull(),
	enrollmentId: int("enrollment_id").notNull(),
	moduleId: int("module_id").notNull(),
	completed: tinyint().default(0),
	completedAt: datetime("completed_at", { mode: 'string'}).default(sql`NULL`),
	score: int().default(sql`NULL`),
});

export const doctorProfiles = mysqlTable("doctor_profiles", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	email: varchar({ length: 255 }).default(sql`NULL`),
	firstName: varchar("first_name", { length: 100 }).default(sql`NULL`),
	middleName: varchar("middle_name", { length: 100 }).default(sql`NULL`),
	lastName: varchar("last_name", { length: 100 }).default(sql`NULL`),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dob: date({ mode: 'string' }).default(sql`NULL`),
	gender: mysqlEnum(['male','female','other']).default(sql`NULL`),
	marriatialstatus: mysqlEnum(['single','married','divorced','widowed']).default(sql`NULL`),
	professionaldegree: varchar({ length: 255 }).default(sql`NULL`),
	profilePic: text("profile_pic").default(sql`NULL`),
	thumbl: text().default(sql`NULL`),
	thumbs: text().default(sql`NULL`),
	thumbimage: text().default(sql`NULL`),
	userMobile: varchar("user_mobile", { length: 20 }).default(sql`NULL`),
	alternateno: varchar({ length: 20 }).default(sql`NULL`),
	userWebsite: varchar("user_website", { length: 255 }).default(sql`NULL`),
	userFacebook: varchar("user_facebook", { length: 255 }).default(sql`NULL`),
	userTwitter: varchar("user_twitter", { length: 255 }).default(sql`NULL`),
	userInstagram: varchar("user_instagram", { length: 255 }).default(sql`NULL`),
	contactOthers: text("contact_others").default(sql`NULL`),
	ugAdmissionYear: varchar("ug_admission_year", { length: 10 }).default(sql`NULL`),
	ugLocation: varchar("ug_location", { length: 255 }).default(sql`NULL`),
	ugCollege: varchar("ug_college", { length: 255 }).default(sql`NULL`),
	pgAdmissionYear: varchar("pg_admission_year", { length: 10 }).default(sql`NULL`),
	pgLocation: varchar("pg_location", { length: 255 }).default(sql`NULL`),
	pgCollege: varchar("pg_college", { length: 255 }).default(sql`NULL`),
	pgType: varchar("pg_type", { length: 100 }).default(sql`NULL`),
	pgBranch: varchar("pg_branch", { length: 100 }).default(sql`NULL`),
	ssAdmissionYear: varchar("ss_admission_year", { length: 10 }).default(sql`NULL`),
	ssLocation: varchar("ss_location", { length: 255 }).default(sql`NULL`),
	ssCollege: varchar("ss_college", { length: 255 }).default(sql`NULL`),
	ssType: varchar("ss_type", { length: 100 }).default(sql`NULL`),
	ssBranch: varchar("ss_branch", { length: 100 }).default(sql`NULL`),
	additionalqualificationCourse: varchar("additionalqualification_course", { length: 255 }).default(sql`NULL`),
	additionalqualificationAdmissionYear: varchar("additionalqualification_admission_year", { length: 10 }).default(sql`NULL`),
	additionalqualificationLocation: varchar("additionalqualification_location", { length: 255 }).default(sql`NULL`),
	additionalqualificationCollege: varchar("additionalqualification_college", { length: 255 }).default(sql`NULL`),
	additionalqualificationDetails: text("additionalqualification_details").default(sql`NULL`),
	jobSector: varchar("job_sector", { length: 100 }).default(sql`NULL`),
	jobCountry: varchar("job_country", { length: 100 }).default(sql`NULL`),
	jobState: varchar("job_state", { length: 100 }).default(sql`NULL`),
	jobCity: varchar("job_city", { length: 100 }).default(sql`NULL`),
	jobCentralSub: varchar("job_central_sub", { length: 100 }).default(sql`NULL`),
	centralOthers: varchar("central_others", { length: 255 }).default(sql`NULL`),
	jobStateSub: varchar("job_state_sub", { length: 100 }).default(sql`NULL`),
	stateOthers: varchar("state_others", { length: 255 }).default(sql`NULL`),
	jobPrivateHospital: varchar("job_private_hospital", { length: 255 }).default(sql`NULL`),
	jobAddedPrivateHospital: varchar("job_added_private_hospital", { length: 255 }).default(sql`NULL`),
	jobMedicalcollege: varchar("job_medicalcollege", { length: 255 }).default(sql`NULL`),
	jobRajDistrict: varchar("job_raj_district", { length: 100 }).default(sql`NULL`),
	jobRajBlock: varchar("job_raj_block", { length: 100 }).default(sql`NULL`),
	jobRajPlace: varchar("job_raj_place", { length: 100 }).default(sql`NULL`),
	jaipurarea: varchar({ length: 100 }).default(sql`NULL`),
	isprofilecomplete: tinyint().default(0),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	approvalStatus: mysqlEnum("approval_status", ['pending','approved','rejected']).default('pending'),
});

export const enrollments = mysqlTable("enrollments", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	courseId: int("course_id").notNull(),
	progress: int().default(0),
	completedAt: datetime("completed_at", { mode: 'string'}).default(sql`NULL`),
	certificateIssued: tinyint("certificate_issued").default(0),
	enrolledAt: datetime("enrolled_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	paymentStatus: mysqlEnum("payment_status", ['free','pending','paid','failed']).default('free'),
	paymentId: varchar("payment_id", { length: 100 }).default(sql`NULL`),
});

export const entityTemplates = mysqlTable("entity_templates", {
	id: int().autoincrement().notNull(),
	entityType: mysqlEnum("entity_type", ['course','quiz','masterclass']).notNull(),
	entityId: int("entity_id").notNull(),
	backgroundImage: text("background_image").notNull(),
	font: varchar({ length: 100 }).default('Arial'),
	textColor: varchar("text_color", { length: 20 }).default('#000000'),
	textPositions: text("text_positions").notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const hospitals = mysqlTable("hospitals", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	address: text().default(sql`NULL`),
	city: varchar({ length: 100 }).default(sql`NULL`),
	state: varchar({ length: 100 }).default(sql`NULL`),
	country: varchar({ length: 100 }).default('India'),
	phone: varchar({ length: 20 }).default(sql`NULL`),
	email: varchar({ length: 255 }).default(sql`NULL`),
	website: varchar({ length: 255 }).default(sql`NULL`),
	specialties: text().default(sql`NULL`),
	description: text().default(sql`NULL`),
	image: text().default(sql`NULL`),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	district: varchar({ length: 100 }).default(sql`NULL`),
	contactNumbers: text("contact_numbers").default(sql`NULL`),
});

export const jobs = mysqlTable("jobs", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	hospitalId: int("hospital_id").default(sql`NULL`),
	hospitalName: varchar("hospital_name", { length: 255 }).default(sql`NULL`),
	specialty: varchar({ length: 255 }).default(sql`NULL`),
	location: varchar({ length: 255 }).default(sql`NULL`),
	state: varchar({ length: 100 }).default(sql`NULL`),
	city: varchar({ length: 100 }).default(sql`NULL`),
	experienceRequired: varchar("experience_required", { length: 100 }).default(sql`NULL`),
	salaryRange: varchar("salary_range", { length: 100 }).default(sql`NULL`),
	jobType: varchar("job_type", { length: 50 }).default(sql`NULL`),
	description: text().default(sql`NULL`),
	requirements: text().default(sql`NULL`),
	postedBy: int("posted_by").default(sql`NULL`),
	isActive: tinyint("is_active").default(1),
	postedAt: datetime("posted_at", { mode: 'string'}).default('current_timestamp()'),
});

export const jobApplications = mysqlTable("job_applications", {
	id: int().autoincrement().notNull(),
	jobId: int("job_id").notNull(),
	userId: int("user_id").notNull(),
	coverLetter: text("cover_letter").default(sql`NULL`),
	status: varchar({ length: 50 }).default('pending'),
	appliedAt: datetime("applied_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const masterclasses = mysqlTable("masterclasses", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().default(sql`NULL`),
	instructor: varchar({ length: 255 }).default(sql`NULL`),
	eventDate: datetime("event_date", { mode: 'string'}).notNull(),
	duration: int().default(sql`NULL`),
	maxParticipants: int("max_participants").default(sql`NULL`),
	currentParticipants: int("current_participants").default(0),
	price: int().default(0),
	location: varchar({ length: 255 }).default(sql`NULL`),
	thumbnailImage: text("thumbnail_image").default(sql`NULL`),
	isActive: tinyint("is_active").default(1),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const masterclassBookings = mysqlTable("masterclass_bookings", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	masterclassId: int("masterclass_id").notNull(),
	bookedAt: datetime("booked_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const medicalVoices = mysqlTable("medical_voices", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	shortDescription: text("short_description").default(sql`NULL`),
	description: text().default(sql`NULL`),
	category: varchar({ length: 100 }).default(sql`NULL`),
	bannerImage: text("banner_image").default(sql`NULL`),
	relatedDocuments: text("related_documents").default(sql`NULL`),
	relatedImages: text("related_images").default(sql`NULL`),
	concernedAuthority: varchar("concerned_authority", { length: 255 }).default(sql`NULL`),
	targetDepartment: varchar("target_department", { length: 255 }).default(sql`NULL`),
	mediaContacts: text("media_contacts").default(sql`NULL`),
	visibility: mysqlEnum(['public','private']).default('public'),
	status: mysqlEnum(['active','inactive','archived']).default('active'),
	supportersCount: int("supporters_count").default(0),
	hasGathering: tinyint("has_gathering").default(0),
	gatheringDate: datetime("gathering_date", { mode: 'string'}).default(sql`NULL`),
	gatheringLocation: varchar("gathering_location", { length: 255 }).default(sql`NULL`),
	gatheringAddress: text("gathering_address").default(sql`NULL`),
	gatheringCity: varchar("gathering_city", { length: 100 }).default(sql`NULL`),
	gatheringState: varchar("gathering_state", { length: 100 }).default(sql`NULL`),
	gatheringPin: varchar("gathering_pin", { length: 20 }).default(sql`NULL`),
	gatheringMapLink: text("gathering_map_link").default(sql`NULL`),
	gatheringNotes: text("gathering_notes").default(sql`NULL`),
	creatorId: int("creator_id").default(sql`NULL`),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
},
(table) => [
	unique("slug").on(table.slug),
]);

export const medicalVoiceContacts = mysqlTable("medical_voice_contacts", {
	id: int().autoincrement().notNull(),
	voiceId: int("voice_id").notNull(),
	name: varchar({ length: 150 }).default(sql`NULL`),
	designation: varchar({ length: 100 }).default(sql`NULL`),
	phone: varchar({ length: 20 }).default(sql`NULL`),
	email: varchar({ length: 150 }).default(sql`NULL`),
	isPrimary: tinyint("is_primary").default(0),
	visible: tinyint().default(1),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const medicalVoiceGatheringJoins = mysqlTable("medical_voice_gathering_joins", {
	id: int().autoincrement().notNull(),
	voiceId: int("voice_id").notNull(),
	userId: int("user_id").notNull(),
	status: mysqlEnum(['interested','confirmed','declined']).default('interested'),
	remarks: text().default(sql`NULL`),
	joinedAt: datetime("joined_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const medicalVoiceGatherings = mysqlTable("medical_voice_gatherings", {
	id: int().autoincrement().notNull(),
	voiceId: int("voice_id").notNull(),
	date: datetime("date", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	location: varchar({ length: 255 }).default(sql`NULL`),
	contactPerson: varchar("contact_person", { length: 150 }).default(sql`NULL`),
	phone: varchar({ length: 20 }).default(sql`NULL`),
});

export const medicalVoiceSupporters = mysqlTable("medical_voice_supporters", {
	id: int().autoincrement().notNull(),
	voiceId: int("voice_id").notNull(),
	userId: int("user_id").notNull(),
	motivationNote: text("motivation_note").default(sql`NULL`),
	joinedAt: datetime("joined_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const medicalVoiceUpdates = mysqlTable("medical_voice_updates", {
	id: int().autoincrement().notNull(),
	voiceId: int("voice_id").notNull(),
	updateTitle: varchar("update_title", { length: 255 }).default(sql`NULL`),
	updateBody: text("update_body").default(sql`NULL`),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	notifySupporters: tinyint("notify_supporters").default(1),
});

export const moduleTests = mysqlTable("module_tests", {
	id: int().autoincrement().notNull(),
	moduleId: int("module_id").notNull(),
	title: varchar({ length: 255 }).notNull(),
	totalQuestions: int("total_questions").default(0),
	passingScore: int("passing_score").default(60),
	duration: int().default(sql`NULL`),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
},
(table) => [
	unique("module_id").on(table.moduleId),
]);

export const npaAutomation = mysqlTable("npa_automation", {
	id: int().autoincrement().notNull(),
	optInId: int("opt_in_id").notNull(),
	userId: int("user_id").notNull(),
	month: varchar({ length: 50 }).notNull(),
	year: int().notNull(),
	generatedPdfUrl: text("generated_pdf_url").default(sql`NULL`),
	status: mysqlEnum(['pending','generated','sent','failed']).default('pending'),
	sentDate: datetime("sent_date", { mode: 'string'}).default(sql`NULL`),
	lastError: text("last_error").default(sql`NULL`),
	templateUsed: int("template_used").default(sql`NULL`),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const npaOptIns = mysqlTable("npa_opt_ins", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	doctorProfileId: int("doctor_profile_id").notNull(),
	isActive: tinyint("is_active").default(1),
	preferredDay: int("preferred_day").default(1),
	templateId: int("template_id").default(sql`NULL`),
	deliveryEmail: varchar("delivery_email", { length: 255 }).default(sql`NULL`),
	deliveryWhatsapp: varchar("delivery_whatsapp", { length: 20 }).default(sql`NULL`),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
},
(table) => [
	unique("user_id").on(table.userId),
]);

export const npaTemplates = mysqlTable("npa_templates", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().default(sql`NULL`),
	htmlTemplate: text("html_template").notNull(),
	placeholders: text().default('').notNull(),
	isActive: tinyint("is_active").default(1),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const otps = mysqlTable("otps", {
	id: int().autoincrement().notNull(),
	phone: varchar({ length: 30 }).default(sql`NULL`),
	otp: varchar({ length: 10 }).default(sql`NULL`),
	expiresAt: datetime("expires_at", { mode: 'string'}).default(sql`NULL`),
	attempts: int("attempts").default(0),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const quizzes = mysqlTable("quizzes", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().default(sql`NULL`),
	passingScore: int("passing_score").default(60),
	status: mysqlEnum(['draft','active','archived']).default('draft'),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	category: varchar({ length: 100 }).default(sql`NULL`),
	difficulty: mysqlEnum(['beginner','intermediate','advanced']).default('beginner'),
	type: mysqlEnum(['free','practice','live']).default('free'),
	totalQuestions: int("total_questions").default(0),
	questionTime: int("question_time").default(30),
	duration: int().default(sql`NULL`),
	entryFee: int("entry_fee").default(0),
	rewardInfo: text("reward_info").default(sql`NULL`),
	certificateType: varchar("certificate_type", { length: 100 }).default(sql`NULL`),
	startTime: datetime("start_time", { mode: 'string'}).default(sql`NULL`),
	endTime: datetime("end_time", { mode: 'string'}).default(sql`NULL`),
	updatedAt: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const quizAttempts = mysqlTable("quiz_attempts", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	quizId: int("quiz_id").notNull(),
	score: int().notNull(),
	totalQuestions: int("total_questions").notNull(),
	timeTaken: int("time_taken").default(sql`NULL`),
	passed: tinyint().default(0),
	certificateIssued: tinyint("certificate_issued").default(0),
	attemptedAt: datetime("attempted_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const quizLeaderboard = mysqlTable("quiz_leaderboard", {
	id: int().autoincrement().notNull(),
	quizId: int("quiz_id").notNull(),
	userId: int("user_id").notNull(),
	totalScore: int("total_score").default(0),
	avgTime: int("avg_time"),
	rank: int(),
	certificateUrl: text("certificate_url").default(sql`NULL`),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const quizQuestions = mysqlTable("quiz_questions", {
	id: int().autoincrement().notNull(),
	quizId: int("quiz_id").notNull(),
	questionText: text("question_text").notNull(),
	correctOption: varchar("correct_option", { length: 1 }).notNull(),
	orderIndex: int("order_index").default(0),
	image: text().default(sql`NULL`),
	marks: int().default(1),
	options: text().notNull(),
});

export const quizResponses = mysqlTable("quiz_responses", {
	id: int().autoincrement().notNull(),
	quizId: int("quiz_id").notNull(),
	questionId: int("question_id").notNull(),
	userId: int("user_id").notNull(),
	selectedOption: varchar("selected_option", { length: 1 }).default(sql`NULL`),
	isCorrect: tinyint("is_correct").default(0),
	responseTime: int("response_time"),
	score: int().default(0),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const quizSessions = mysqlTable("quiz_sessions", {
	id: int().autoincrement().notNull(),
	quizId: int("quiz_id").notNull(),
	currentQuestion: int("current_question").default(0),
	startedAt: datetime("started_at", { mode: 'string'}).default(sql`NULL`),
	status: mysqlEnum(['waiting','running','completed']).default('waiting'),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const researchRequests = mysqlTable("research_requests", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	title: varchar({ length: 255 }).notNull(),
	details: text().notNull(),
	status: mysqlEnum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const researchServiceRequests = mysqlTable("research_service_requests", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	serviceType: varchar("service_type", { length: 100 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	status: mysqlEnum(['pending','in_progress','completed','cancelled']).default('pending'),
	assignedTo: int("assigned_to"),
	estimatedCost: int("estimated_cost"),
	completedAt: datetime("completed_at", { mode: 'string'}).default(sql`NULL`),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const settings = mysqlTable("settings", {
	id: int().autoincrement().notNull(),
	key: varchar({ length: 100 }).notNull(),
	value: text().notNull(),
	category: varchar({ length: 50 }).notNull(),
	description: text().default(sql`NULL`),
	updatedAt: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
},
(table) => [
	unique("key").on(table.key),
]);

export const testQuestions = mysqlTable("test_questions", {
	id: int().autoincrement().notNull(),
	testId: int("test_id").notNull(),
	questionNo: int("question_no").notNull(),
	description: text().notNull(),
	optionA: text("option_a").notNull(),
	optionB: text("option_b").notNull(),
	optionC: text("option_c").notNull(),
	optionD: text("option_d").notNull(),
	correctAnswer: varchar("correct_answer", { length: 1 }).notNull(),
	marks: int().default(1),
});

export const testResponses = mysqlTable("test_responses", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	testId: int("test_id").notNull(),
	questionId: int("question_id").notNull(),
	selectedOption: varchar("selected_option", { length: 1 }).notNull(),
	isCorrect: tinyint("is_correct").notNull(),
	score: int().default(0),
	answeredAt: datetime("answered_at", { mode: 'string'}).default('current_timestamp()'),
});

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	phone: varchar({ length: 20 }).notNull(),
	email: varchar({ length: 255 }).default(sql`NULL`),
	role: mysqlEnum(['doctor','student','admin']).default('doctor').notNull(),
	otpCode: varchar("otp_code", { length: 10 }).default(sql`NULL`),
	otpExpiry: datetime("otp_expiry", { mode: 'string'}).default(sql`NULL`),
	isVerified: tinyint("is_verified").default(0),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
},
(table) => [
	unique("phone").on(table.phone),
	unique("email").on(table.email),
]);

export const userSessions = mysqlTable("user_sessions", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	refreshToken: varchar("refresh_token", { length: 512 }).notNull(),
	device: varchar({ length: 255 }).default(sql`NULL`),
	ip: varchar({ length: 100 }).default(sql`NULL`),
	isActive: tinyint("is_active").default(1).notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: datetime("expires_at", { mode: 'string'}).notNull(),
},
(table) => [
	index("ix_sessions_user").on(table.userId),
]);

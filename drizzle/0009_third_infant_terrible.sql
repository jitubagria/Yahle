CREATE TABLE `module_tests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`module_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`total_questions` int DEFAULT 0,
	`passing_score` int DEFAULT 60,
	`duration` int DEFAULT 'NULL',
	`created_at` datetime DEFAULT 'current_timestamp()',
	CONSTRAINT `module_id` UNIQUE(`module_id`)
);
--> statement-breakpoint
CREATE TABLE `research_service_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`service_type` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`status` enum('pending','in_progress','completed','cancelled') DEFAULT '''pending''',
	`assigned_to` int DEFAULT 'NULL',
	`estimated_cost` int DEFAULT 'NULL',
	`completed_at` datetime DEFAULT 'NULL',
	`created_at` datetime DEFAULT 'current_timestamp()',
	`updated_at` datetime DEFAULT 'current_timestamp()'
);
--> statement-breakpoint
CREATE TABLE `test_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`test_id` int NOT NULL,
	`question_no` int NOT NULL,
	`description` text NOT NULL,
	`option_a` text NOT NULL,
	`option_b` text NOT NULL,
	`option_c` text NOT NULL,
	`option_d` text NOT NULL,
	`correct_answer` varchar(1) NOT NULL,
	`marks` int DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE `test_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`test_id` int NOT NULL,
	`question_id` int NOT NULL,
	`selected_option` varchar(1) NOT NULL,
	`is_correct` boolean NOT NULL,
	`score` int DEFAULT 0,
	`answered_at` datetime DEFAULT 'current_timestamp()'
);
--> statement-breakpoint
DROP TABLE `ai_tools`;--> statement-breakpoint
DROP TABLE `contacts`;--> statement-breakpoint
DROP TABLE `medical_voice_gatherings`;--> statement-breakpoint
DROP TABLE `research_requests`;--> statement-breakpoint
ALTER TABLE `settings` DROP INDEX `settings_key_unique`;--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `users_email_unique`;--> statement-breakpoint
ALTER TABLE `ai_tool_requests` DROP FOREIGN KEY `ai_tool_requests_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `certificates` DROP FOREIGN KEY `certificates_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `course_certificates` DROP FOREIGN KEY `course_certificates_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `course_certificates` DROP FOREIGN KEY `course_certificates_course_id_courses_id_fk`;
--> statement-breakpoint
ALTER TABLE `course_modules` DROP FOREIGN KEY `course_modules_course_id_courses_id_fk`;
--> statement-breakpoint
ALTER TABLE `course_progress` DROP FOREIGN KEY `course_progress_enrollment_id_enrollments_id_fk`;
--> statement-breakpoint
ALTER TABLE `course_progress` DROP FOREIGN KEY `course_progress_module_id_course_modules_id_fk`;
--> statement-breakpoint
ALTER TABLE `course_progress` DROP FOREIGN KEY `course_progress_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `course_progress` DROP FOREIGN KEY `course_progress_course_id_courses_id_fk`;
--> statement-breakpoint
ALTER TABLE `courses` DROP FOREIGN KEY `courses_created_by_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `doctor_profiles` DROP FOREIGN KEY `doctor_profiles_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `enrollments` DROP FOREIGN KEY `enrollments_course_id_courses_id_fk`;
--> statement-breakpoint
ALTER TABLE `enrollments` DROP FOREIGN KEY `enrollments_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `job_applications` DROP FOREIGN KEY `job_applications_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `job_applications` DROP FOREIGN KEY `job_applications_job_id_jobs_id_fk`;
--> statement-breakpoint
ALTER TABLE `masterclass_bookings` DROP FOREIGN KEY `masterclass_bookings_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `masterclass_bookings` DROP FOREIGN KEY `masterclass_bookings_masterclass_id_masterclasses_id_fk`;
--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` DROP FOREIGN KEY `medical_voice_contacts_voice_id_medical_voices_id_fk`;
--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` DROP FOREIGN KEY `medical_voice_gathering_joins_voice_id_medical_voices_id_fk`;
--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` DROP FOREIGN KEY `medical_voice_gathering_joins_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `medical_voice_supporters` DROP FOREIGN KEY `medical_voice_supporters_voice_id_medical_voices_id_fk`;
--> statement-breakpoint
ALTER TABLE `medical_voice_supporters` DROP FOREIGN KEY `medical_voice_supporters_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `medical_voice_updates` DROP FOREIGN KEY `medical_voice_updates_voice_id_medical_voices_id_fk`;
--> statement-breakpoint
ALTER TABLE `medical_voices` DROP FOREIGN KEY `medical_voices_created_by_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `npa_automation` DROP FOREIGN KEY `npa_automation_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `npa_opt_ins` DROP FOREIGN KEY `npa_opt_ins_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `npa_opt_ins` DROP FOREIGN KEY `npa_opt_ins_template_id_npa_templates_id_fk`;
--> statement-breakpoint
ALTER TABLE `npa_opt_ins` DROP FOREIGN KEY `npa_opt_ins_doctor_profile_id_doctor_profiles_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_attempts` DROP FOREIGN KEY `quiz_attempts_quiz_id_quizzes_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_attempts` DROP FOREIGN KEY `quiz_attempts_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` DROP FOREIGN KEY `quiz_leaderboard_quiz_id_quizzes_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` DROP FOREIGN KEY `quiz_leaderboard_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_questions` DROP FOREIGN KEY `quiz_questions_quiz_id_quizzes_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_responses` DROP FOREIGN KEY `quiz_responses_quiz_id_quizzes_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_responses` DROP FOREIGN KEY `quiz_responses_question_id_quiz_questions_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_responses` DROP FOREIGN KEY `quiz_responses_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_sessions` DROP FOREIGN KEY `quiz_sessions_quiz_id_quizzes_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_sessions` DROP FOREIGN KEY `quiz_sessions_user_id_users_id_fk`;
--> statement-breakpoint
DROP INDEX `ux_quiz_leaderboard_quiz_user` ON `quiz_leaderboard`;--> statement-breakpoint
DROP INDEX `ux_quiz_responses_quiz_user` ON `quiz_responses`;--> statement-breakpoint
ALTER TABLE `ai_tool_requests` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `bigtos_messages` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `certificates` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `course_certificates` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `course_modules` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `course_progress` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `courses` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `doctor_profiles` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `enrollments` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `entity_templates` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `hospitals` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `job_applications` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `jobs` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `masterclass_bookings` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `masterclasses` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `medical_voice_supporters` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `medical_voice_updates` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `medical_voices` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `npa_automation` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `npa_templates` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `otps` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `quiz_attempts` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `quiz_questions` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `quiz_responses` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `quiz_sessions` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `quizzes` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `settings` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `user_sessions` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `users` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `ai_tool_requests` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `ai_tool_requests` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `ai_tool_requests` MODIFY COLUMN `tool_type` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `ai_tool_requests` MODIFY COLUMN `input_data` text NOT NULL;--> statement-breakpoint
ALTER TABLE `ai_tool_requests` MODIFY COLUMN `output_data` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `ai_tool_requests` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `bigtos_messages` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `bigtos_messages` MODIFY COLUMN `mobile` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `bigtos_messages` MODIFY COLUMN `message` text NOT NULL;--> statement-breakpoint
ALTER TABLE `bigtos_messages` MODIFY COLUMN `image_url` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `bigtos_messages` MODIFY COLUMN `type` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `bigtos_messages` MODIFY COLUMN `api_response` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `bigtos_messages` MODIFY COLUMN `status` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `bigtos_messages` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `certificates` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `certificates` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `certificates` MODIFY COLUMN `entity_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `certificates` MODIFY COLUMN `entity_type` enum('course','quiz','masterclass') NOT NULL;--> statement-breakpoint
ALTER TABLE `course_certificates` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `course_certificates` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `course_certificates` MODIFY COLUMN `course_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `course_certificates` MODIFY COLUMN `certificate_url` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `course_certificates` MODIFY COLUMN `certificate_number` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `course_certificates` MODIFY COLUMN `issued_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `course_modules` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `course_modules` MODIFY COLUMN `course_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `course_modules` MODIFY COLUMN `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `course_modules` MODIFY COLUMN `order_no` int NOT NULL;--> statement-breakpoint
ALTER TABLE `course_progress` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `course_progress` MODIFY COLUMN `enrollment_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `course_progress` MODIFY COLUMN `module_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `course_progress` MODIFY COLUMN `score` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `course_progress` MODIFY COLUMN `completed_at` datetime DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `description` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `price` int;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `price` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `duration` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `thumbnail_image` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `updated_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `email` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `first_name` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `middle_name` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `last_name` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `dob` date DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `gender` enum('male','female','other') DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `marriatialstatus` enum('single','married','divorced','widowed') DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `professionaldegree` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `profile_pic` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `user_mobile` varchar(20) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `alternateno` varchar(20) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `user_website` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `user_facebook` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `user_twitter` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `user_instagram` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `contact_others` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ug_admission_year` varchar(10) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ug_location` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ug_college` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `pg_admission_year` varchar(10) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `pg_location` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `pg_college` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `pg_type` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `pg_branch` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ss_admission_year` varchar(10) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ss_location` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ss_college` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ss_type` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ss_branch` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `additionalqualification_course` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `additionalqualification_admission_year` varchar(10) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `additionalqualification_location` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `additionalqualification_college` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `additionalqualification_details` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_sector` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_country` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_state` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_city` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_central_sub` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `central_others` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_state_sub` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `state_others` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_private_hospital` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_added_private_hospital` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_medicalcollege` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_raj_district` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_raj_block` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_raj_place` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `jaipurarea` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `approval_status` enum('pending','approved','rejected') DEFAULT '''pending''';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `updated_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `enrollments` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `enrollments` MODIFY COLUMN `course_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `enrollments` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `enrollments` MODIFY COLUMN `payment_status` enum('free','pending','paid','failed') DEFAULT '''free''';--> statement-breakpoint
ALTER TABLE `enrollments` MODIFY COLUMN `payment_id` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `enrollments` MODIFY COLUMN `enrolled_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `entity_templates` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `entity_templates` MODIFY COLUMN `entity_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `entity_templates` MODIFY COLUMN `entity_type` enum('course','quiz','masterclass') NOT NULL;--> statement-breakpoint
ALTER TABLE `entity_templates` MODIFY COLUMN `background_image` text NOT NULL;--> statement-breakpoint
ALTER TABLE `entity_templates` MODIFY COLUMN `text_positions` text NOT NULL;--> statement-breakpoint
ALTER TABLE `entity_templates` MODIFY COLUMN `text_color` varchar(20) DEFAULT '''#000000''';--> statement-breakpoint
ALTER TABLE `entity_templates` MODIFY COLUMN `font` varchar(100) DEFAULT '''Arial''';--> statement-breakpoint
ALTER TABLE `entity_templates` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `entity_templates` MODIFY COLUMN `updated_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `address` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `district` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `city` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `state` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `country` varchar(100) DEFAULT '''India''';--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `phone` varchar(20) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `contact_numbers` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `email` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `website` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `specialties` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `description` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `image` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `job_applications` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `job_applications` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `job_applications` MODIFY COLUMN `job_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `job_applications` MODIFY COLUMN `cover_letter` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `job_applications` MODIFY COLUMN `status` varchar(50) DEFAULT '''pending''';--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `hospital_name` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `location` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `specialty` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `experience_required` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `job_type` varchar(50) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `description` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `requirements` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `city` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `state` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `masterclass_bookings` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `masterclass_bookings` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `masterclass_bookings` MODIFY COLUMN `masterclass_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `description` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `instructor` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `event_date` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `duration` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `price` int;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `price` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `max_participants` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `thumbnail_image` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `voice_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `name` varchar(150) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `phone` varchar(20) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `email` varchar(150) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` MODIFY COLUMN `voice_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` MODIFY COLUMN `status` enum('interested','confirmed','declined') DEFAULT '''interested''';--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` MODIFY COLUMN `remarks` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `medical_voice_supporters` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_supporters` MODIFY COLUMN `voice_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_supporters` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_supporters` MODIFY COLUMN `joined_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `medical_voice_supporters` MODIFY COLUMN `motivation_note` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `medical_voice_updates` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_updates` MODIFY COLUMN `voice_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_updates` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `short_description` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `description` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `status` enum('active','inactive','archived') DEFAULT '''active''';--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `category` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `slug` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `visibility` enum('public','private') DEFAULT '''public''';--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `updated_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `month` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `status` enum('pending','generated','sent','failed') DEFAULT '''pending''';--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `opt_in_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `template_used` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `generated_pdf_url` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `sent_date` datetime DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `last_error` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `template_id` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `doctor_profile_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `preferred_day` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `is_active` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `delivery_email` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `delivery_whatsapp` varchar(20) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `npa_templates` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `npa_templates` MODIFY COLUMN `html_template` text NOT NULL;--> statement-breakpoint
ALTER TABLE `npa_templates` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `npa_templates` MODIFY COLUMN `updated_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `otps` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `otps` MODIFY COLUMN `phone` varchar(30) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `otps` MODIFY COLUMN `otp` varchar(10) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `otps` MODIFY COLUMN `expires_at` datetime DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `otps` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `quiz_attempts` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_attempts` MODIFY COLUMN `quiz_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_attempts` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_attempts` MODIFY COLUMN `score` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_attempts` MODIFY COLUMN `total_questions` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` MODIFY COLUMN `quiz_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` MODIFY COLUMN `rank` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `quiz_questions` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_questions` MODIFY COLUMN `quiz_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_questions` MODIFY COLUMN `question_text` text NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_questions` MODIFY COLUMN `correct_option` varchar(1) NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_questions` MODIFY COLUMN `options` text NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_questions` MODIFY COLUMN `order_index` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `quiz_responses` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_responses` MODIFY COLUMN `quiz_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_responses` MODIFY COLUMN `question_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_responses` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_responses` MODIFY COLUMN `selected_option` varchar(1) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `quiz_responses` MODIFY COLUMN `is_correct` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `quiz_responses` MODIFY COLUMN `response_time` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `quiz_responses` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `quiz_sessions` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_sessions` MODIFY COLUMN `quiz_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_sessions` MODIFY COLUMN `started_at` datetime DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `quiz_sessions` MODIFY COLUMN `status` enum('waiting','running','completed') DEFAULT '''waiting''';--> statement-breakpoint
ALTER TABLE `quiz_sessions` MODIFY COLUMN `current_question` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `description` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `duration` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `question_time` int DEFAULT 30;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `start_time` datetime DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `status` enum('draft','active','archived') DEFAULT '''draft''';--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `passing_score` int DEFAULT 60;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `updated_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `settings` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` MODIFY COLUMN `key` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` MODIFY COLUMN `value` text NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` MODIFY COLUMN `category` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` MODIFY COLUMN `updated_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `device` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `ip` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `phone` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('doctor','student','admin') NOT NULL DEFAULT '''doctor''';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `otp_code` varchar(10) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `otp_expiry` datetime DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `updated_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `certificates` ADD `name` varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE `certificates` ADD `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `certificates` ADD `rank` varchar(50) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `certificates` ADD `score` varchar(50) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `certificates` ADD `background_image` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `certificates` ADD `output_url` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `certificates` ADD `sent_status` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `certificates` ADD `sent_at` datetime DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `certificates` ADD `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `course_certificates` ADD `sent_whatsapp` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `course_modules` ADD `content_type` enum('video','pdf','text','quiz') NOT NULL;--> statement-breakpoint
ALTER TABLE `course_modules` ADD `content_url` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `course_modules` ADD `duration` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `course_modules` ADD `is_preview` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `course_modules` ADD `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `courses` ADD `instructor` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `courses` ADD `is_active` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `doctor_profiles` ADD `thumbl` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `doctor_profiles` ADD `thumbs` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `doctor_profiles` ADD `thumbimage` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `enrollments` ADD `completed_at` datetime DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `enrollments` ADD `certificate_issued` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `job_applications` ADD `applied_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `jobs` ADD `hospital_id` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `jobs` ADD `salary_range` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `jobs` ADD `posted_by` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `jobs` ADD `posted_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `masterclass_bookings` ADD `booked_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `masterclasses` ADD `location` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` ADD `designation` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` ADD `joined_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `medical_voice_updates` ADD `update_title` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voice_updates` ADD `update_body` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `medical_voice_updates` ADD `notify_supporters` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `banner_image` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `related_documents` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `related_images` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `concerned_authority` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `target_department` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `media_contacts` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `gathering_date` datetime DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `gathering_location` varchar(255) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `gathering_address` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `gathering_city` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `gathering_state` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `gathering_pin` varchar(20) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `gathering_map_link` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `gathering_notes` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `medical_voices` ADD `creator_id` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `npa_automation` ADD `year` int NOT NULL;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` ADD `updated_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `npa_templates` ADD `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `npa_templates` ADD `description` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `npa_templates` ADD `placeholders` text DEFAULT ('') NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_attempts` ADD `time_taken` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `quiz_attempts` ADD `passed` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `quiz_attempts` ADD `certificate_issued` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `quiz_attempts` ADD `attempted_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` ADD `avg_time` int DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` ADD `certificate_url` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `quiz_questions` ADD `image` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `quiz_sessions` ADD `created_at` datetime DEFAULT 'current_timestamp()';--> statement-breakpoint
ALTER TABLE `quizzes` ADD `category` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `quizzes` ADD `difficulty` enum('beginner','intermediate','advanced') DEFAULT '''beginner''';--> statement-breakpoint
ALTER TABLE `quizzes` ADD `type` enum('free','practice','live') DEFAULT '''free''';--> statement-breakpoint
ALTER TABLE `quizzes` ADD `entry_fee` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `quizzes` ADD `reward_info` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `quizzes` ADD `certificate_type` varchar(100) DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `quizzes` ADD `end_time` datetime DEFAULT 'NULL';--> statement-breakpoint
ALTER TABLE `settings` ADD `description` text DEFAULT ('NULL');--> statement-breakpoint
ALTER TABLE `course_certificates` ADD CONSTRAINT `certificate_number` UNIQUE(`certificate_number`);--> statement-breakpoint
ALTER TABLE `medical_voices` ADD CONSTRAINT `slug` UNIQUE(`slug`);--> statement-breakpoint
ALTER TABLE `npa_opt_ins` ADD CONSTRAINT `user_id` UNIQUE(`user_id`);--> statement-breakpoint
ALTER TABLE `settings` ADD CONSTRAINT `key` UNIQUE(`key`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `phone` UNIQUE(`phone`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `email` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `ai_tool_requests` DROP COLUMN `tool_name`;--> statement-breakpoint
ALTER TABLE `ai_tool_requests` DROP COLUMN `payload`;--> statement-breakpoint
ALTER TABLE `certificates` DROP COLUMN `file_url`;--> statement-breakpoint
ALTER TABLE `certificates` DROP COLUMN `certificate_url`;--> statement-breakpoint
ALTER TABLE `certificates` DROP COLUMN `issued_at`;--> statement-breakpoint
ALTER TABLE `course_certificates` DROP COLUMN `file_url`;--> statement-breakpoint
ALTER TABLE `course_modules` DROP COLUMN `content`;--> statement-breakpoint
ALTER TABLE `course_progress` DROP COLUMN `user_id`;--> statement-breakpoint
ALTER TABLE `course_progress` DROP COLUMN `course_id`;--> statement-breakpoint
ALTER TABLE `course_progress` DROP COLUMN `progress_percentage`;--> statement-breakpoint
ALTER TABLE `course_progress` DROP COLUMN `last_position`;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `slug`;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `visibility`;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `passing_score`;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `total_questions`;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `thumbnail`;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `image_url`;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `created_by`;--> statement-breakpoint
ALTER TABLE `doctor_profiles` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `enrollments` DROP COLUMN `completed`;--> statement-breakpoint
ALTER TABLE `enrollments` DROP COLUMN `amount_paid`;--> statement-breakpoint
ALTER TABLE `enrollments` DROP COLUMN `payment_method`;--> statement-breakpoint
ALTER TABLE `entity_templates` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `entity_templates` DROP COLUMN `html_template`;--> statement-breakpoint
ALTER TABLE `entity_templates` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `entity_templates` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `entity_templates` DROP COLUMN `category`;--> statement-breakpoint
ALTER TABLE `hospitals` DROP COLUMN `hospital_name`;--> statement-breakpoint
ALTER TABLE `hospitals` DROP COLUMN `beds`;--> statement-breakpoint
ALTER TABLE `job_applications` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `jobs` DROP COLUMN `salary`;--> statement-breakpoint
ALTER TABLE `jobs` DROP COLUMN `posted_date`;--> statement-breakpoint
ALTER TABLE `jobs` DROP COLUMN `application_count`;--> statement-breakpoint
ALTER TABLE `masterclass_bookings` DROP COLUMN `booking_date`;--> statement-breakpoint
ALTER TABLE `masterclass_bookings` DROP COLUMN `payment_status`;--> statement-breakpoint
ALTER TABLE `masterclass_bookings` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `masterclass_bookings` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `masterclasses` DROP COLUMN `scheduled_at`;--> statement-breakpoint
ALTER TABLE `masterclasses` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` DROP COLUMN `role`;--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` DROP COLUMN `role`;--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` DROP COLUMN `visible`;--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` DROP COLUMN `is_primary`;--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `medical_voice_supporters` DROP COLUMN `supported_at`;--> statement-breakpoint
ALTER TABLE `medical_voice_updates` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `medical_voice_updates` DROP COLUMN `content`;--> statement-breakpoint
ALTER TABLE `medical_voice_updates` DROP COLUMN `update_text`;--> statement-breakpoint
ALTER TABLE `medical_voices` DROP COLUMN `banner_url`;--> statement-breakpoint
ALTER TABLE `medical_voices` DROP COLUMN `department`;--> statement-breakpoint
ALTER TABLE `medical_voices` DROP COLUMN `created_by`;--> statement-breakpoint
ALTER TABLE `npa_automation` DROP COLUMN `generated_at`;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` DROP COLUMN `opt_in_id`;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` DROP COLUMN `preferred_time`;--> statement-breakpoint
ALTER TABLE `npa_templates` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `otps` DROP COLUMN `mobile`;--> statement-breakpoint
ALTER TABLE `quiz_attempts` DROP COLUMN `attempt_number`;--> statement-breakpoint
ALTER TABLE `quiz_attempts` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `quiz_questions` DROP COLUMN `question`;--> statement-breakpoint
ALTER TABLE `quiz_questions` DROP COLUMN `correct_answer`;--> statement-breakpoint
ALTER TABLE `quiz_questions` DROP COLUMN `image_url`;--> statement-breakpoint
ALTER TABLE `quiz_questions` DROP COLUMN `order_no`;--> statement-breakpoint
ALTER TABLE `quiz_questions` DROP COLUMN `response_time`;--> statement-breakpoint
ALTER TABLE `quiz_questions` DROP COLUMN `selected_option`;--> statement-breakpoint
ALTER TABLE `quiz_responses` DROP COLUMN `answer`;--> statement-breakpoint
ALTER TABLE `quiz_responses` DROP COLUMN `correct_option`;--> statement-breakpoint
ALTER TABLE `quiz_responses` DROP COLUMN `marks`;--> statement-breakpoint
ALTER TABLE `quiz_sessions` DROP COLUMN `user_id`;--> statement-breakpoint
ALTER TABLE `quiz_sessions` DROP COLUMN `session_id`;--> statement-breakpoint
ALTER TABLE `quiz_sessions` DROP COLUMN `ended_at`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `username`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `mobile`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `password`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `full_name`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `image_url`;
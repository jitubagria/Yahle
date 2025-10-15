CREATE TABLE `ai_tool_requests` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`tool_name` varchar(255),
	`tool_type` varchar(100),
	`payload` text,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `ai_tool_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_tools` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`slug` varchar(255),
	`description` text,
	`category` varchar(100),
	`is_premium` boolean DEFAULT false,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `ai_tools_id` PRIMARY KEY(`id`),
	CONSTRAINT `ai_tools_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `bigtos_messages` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`mobile` varchar(30),
	`message` text,
	`image_url` varchar(255),
	`type` varchar(50),
	`api_response` text,
	`status` varchar(50),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bigtos_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`entity_id` int,
	`entity_type` varchar(50),
	`file_url` varchar(255),
	`certificate_url` varchar(255),
	`issued_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`name` varchar(255),
	`mobile` varchar(20),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_certificates` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`course_id` int,
	`file_url` varchar(255),
	`certificate_url` varchar(512),
	`certificate_number` varchar(255),
	`issued_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `course_certificates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_modules` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`course_id` int,
	`title` varchar(255),
	`content` text,
	`order_no` int,
	CONSTRAINT `course_modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_progress` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`enrollment_id` int,
	`module_id` int,
	`user_id` int,
	`course_id` int,
	`completed` boolean DEFAULT false,
	`score` int DEFAULT 0,
	`progress_percentage` int DEFAULT 0,
	`last_position` varchar(255),
	`completed_at` datetime,
	CONSTRAINT `course_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`slug` varchar(255),
	`visibility` varchar(50) DEFAULT 'public',
	`description` text,
	`price` varchar(20) DEFAULT '0.00',
	`passing_score` int DEFAULT 0,
	`total_questions` int DEFAULT 0,
	`duration` int DEFAULT 0,
	`enrollment_count` int DEFAULT 0,
	`thumbnail_image` text,
	`thumbnail` varchar(255),
	`image_url` varchar(255),
	`created_by` int,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `doctor_profiles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`email` varchar(255),
	`first_name` varchar(100),
	`middle_name` varchar(100),
	`last_name` varchar(100),
	`dob` datetime,
	`gender` varchar(20),
	`marriatialstatus` varchar(20),
	`professionaldegree` varchar(255),
	`profile_pic` text,
	`user_mobile` varchar(20),
	`phone` varchar(255),
	`alternateno` varchar(20),
	`user_website` varchar(255),
	`user_facebook` varchar(255),
	`user_twitter` varchar(255),
	`user_instagram` varchar(255),
	`contact_others` text,
	`ug_admission_year` varchar(10),
	`ug_location` varchar(255),
	`ug_college` varchar(255),
	`pg_admission_year` varchar(10),
	`pg_location` varchar(255),
	`pg_college` varchar(255),
	`pg_type` varchar(100),
	`pg_branch` varchar(100),
	`ss_admission_year` varchar(10),
	`ss_location` varchar(255),
	`ss_college` varchar(255),
	`ss_type` varchar(100),
	`ss_branch` varchar(100),
	`additionalqualification_course` varchar(255),
	`additionalqualification_admission_year` varchar(10),
	`additionalqualification_location` varchar(255),
	`additionalqualification_college` varchar(255),
	`additionalqualification_details` text,
	`job_sector` varchar(100),
	`job_country` varchar(100),
	`job_state` varchar(100),
	`job_city` varchar(100),
	`job_central_sub` varchar(100),
	`central_others` varchar(255),
	`job_state_sub` varchar(100),
	`state_others` varchar(255),
	`job_private_hospital` varchar(255),
	`job_added_private_hospital` varchar(255),
	`job_medicalcollege` varchar(255),
	`job_raj_district` varchar(100),
	`job_raj_block` varchar(100),
	`job_raj_place` varchar(100),
	`jaipurarea` varchar(100),
	`isprofilecomplete` boolean DEFAULT false,
	`approval_status` varchar(50) DEFAULT 'pending',
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime,
	CONSTRAINT `doctor_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`course_id` int,
	`user_id` int,
	`progress` int DEFAULT 0,
	`completed` boolean DEFAULT false,
	`payment_status` varchar(50) DEFAULT 'free',
	`payment_id` varchar(100),
	`amount_paid` decimal(10,2) DEFAULT 0.00,
	`payment_method` varchar(100),
	`enrolled_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `entity_templates` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`html_template` text,
	`entity_id` int,
	`entity_type` varchar(50),
	`background_image` varchar(512),
	`text_positions` text,
	`text_color` varchar(50) DEFAULT '#000000',
	`font` varchar(255),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime,
	CONSTRAINT `entity_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hospitals` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`hospital_name` varchar(255),
	`address` text,
	`district` varchar(100),
	`city` varchar(255),
	`state` varchar(255),
	`country` varchar(100) DEFAULT 'India',
	`phone` varchar(20),
	`contact_numbers` text,
	`email` varchar(255),
	`website` varchar(255),
	`specialties` text,
	`description` text,
	`image` text,
	`beds` int DEFAULT 0,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `hospitals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_applications` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`job_id` int,
	`cover_letter` text,
	`status` varchar(50),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `job_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`hospital_name` varchar(255),
	`location` varchar(255),
	`specialty` varchar(100),
	`experience_required` varchar(100),
	`salary` varchar(100),
	`job_type` varchar(50),
	`description` text,
	`requirements` text,
	`city` varchar(255),
	`state` varchar(255),
	`posted_date` datetime DEFAULT CURRENT_TIMESTAMP,
	`is_active` boolean DEFAULT true,
	`application_count` int DEFAULT 0,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `masterclass_bookings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`masterclass_id` int,
	`booking_date` datetime,
	`payment_status` varchar(50),
	`status` varchar(50),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `masterclass_bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `masterclasses` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`description` text,
	`instructor` varchar(255),
	`event_date` datetime,
	`scheduled_at` datetime,
	`duration` int DEFAULT 0,
	`price` varchar(20) DEFAULT '0.00',
	`max_participants` int DEFAULT 0,
	`current_participants` int DEFAULT 0,
	`thumbnail_image` text,
	`is_active` boolean DEFAULT true,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime,
	CONSTRAINT `masterclasses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medical_voice_contacts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`voice_id` int,
	`name` varchar(150),
	`phone` varchar(30),
	`email` varchar(255),
	`role` varchar(100),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `medical_voice_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medical_voice_gathering_joins` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`voice_id` int,
	`user_id` int,
	`status` varchar(50) DEFAULT 'pending',
	`remarks` text,
	`role` varchar(100),
	`visible` boolean DEFAULT true,
	`is_primary` boolean DEFAULT false,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `medical_voice_gathering_joins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medical_voice_gatherings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`voice_id` int,
	`date` datetime,
	`location` varchar(255),
	`contact_person` varchar(150),
	`phone` varchar(20),
	CONSTRAINT `medical_voice_gatherings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medical_voice_supporters` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`voice_id` int,
	`user_id` int,
	`supported_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`motivation_note` text,
	CONSTRAINT `medical_voice_supporters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medical_voice_updates` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`voice_id` int,
	`title` varchar(255),
	`content` text,
	`update_text` text,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `medical_voice_updates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medical_voices` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`banner_url` varchar(255),
	`short_description` varchar(255),
	`description` text,
	`department` varchar(100),
	`has_gathering` boolean DEFAULT false,
	`status` varchar(50) DEFAULT 'published',
	`category` varchar(100) DEFAULT 'general',
	`supporters_count` int DEFAULT 0,
	`created_by` int,
	`slug` varchar(255),
	`visibility` varchar(50) DEFAULT 'public',
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime,
	CONSTRAINT `medical_voices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `npa_automation` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`month` varchar(20),
	`status` varchar(50) DEFAULT 'pending',
	`opt_in_id` varchar(255),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`generated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `npa_automation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `npa_opt_ins` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`template_id` int,
	`opt_in_id` varchar(255),
	`doctor_profile_id` int,
	`preferred_day` varchar(50),
	`preferred_time` varchar(50),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `npa_opt_ins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `npa_templates` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(150),
	`html_template` text,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`is_active` boolean DEFAULT true,
	`updated_at` datetime,
	CONSTRAINT `npa_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `otps` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`phone` varchar(30),
	`mobile` varchar(30),
	`otp` varchar(10),
	`expires_at` datetime,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `otps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`quiz_id` int,
	`user_id` int,
	`attempt_number` int,
	`score` int DEFAULT 0,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_leaderboard` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`quiz_id` int,
	`user_id` int,
	`total_score` int DEFAULT 0,
	`rank` int DEFAULT 0,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_leaderboard_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_questions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`quiz_id` int,
	`question` text,
	`question_text` text,
	`correct_option` varchar(10),
	`marks` int DEFAULT 1,
	`options` json,
	`correct_answer` varchar(10),
	`image_url` varchar(255),
	`order_no` int,
	CONSTRAINT `quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_responses` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`quiz_id` int,
	`question_id` int,
	`user_id` int,
	`answer` varchar(255),
	`correct_option` varchar(10),
	`is_correct` boolean,
	`marks` int DEFAULT 0,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_sessions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`quiz_id` int,
	`user_id` int,
	`session_id` varchar(100),
	`started_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`ended_at` datetime,
	`status` varchar(50),
	CONSTRAINT `quiz_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`description` text,
	`duration` int DEFAULT 10,
	`start_time` datetime,
	`is_active` boolean DEFAULT true,
	`passing_score` int DEFAULT 0,
	`total_questions` int DEFAULT 0,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `quizzes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `research_requests` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`title` varchar(255),
	`details` text,
	`status` varchar(50) DEFAULT 'pending',
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `research_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`key` varchar(100),
	`value` text,
	`category` varchar(100),
	`updated_at` datetime,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`refresh_token` varchar(512) NOT NULL,
	`device` varchar(255),
	`ip` varchar(100),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `user_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `idx_users_phone`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(150);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `updated_at` datetime;--> statement-breakpoint
ALTER TABLE `users` ADD `name` varchar(150);--> statement-breakpoint
ALTER TABLE `users` ADD `username` varchar(150);--> statement-breakpoint
ALTER TABLE `users` ADD `mobile` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `ai_tool_requests` ADD CONSTRAINT `ai_tool_requests_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_certificates` ADD CONSTRAINT `course_certificates_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_certificates` ADD CONSTRAINT `course_certificates_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_modules` ADD CONSTRAINT `course_modules_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_progress` ADD CONSTRAINT `course_progress_enrollment_id_enrollments_id_fk` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_progress` ADD CONSTRAINT `course_progress_module_id_course_modules_id_fk` FOREIGN KEY (`module_id`) REFERENCES `course_modules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_progress` ADD CONSTRAINT `course_progress_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_progress` ADD CONSTRAINT `course_progress_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `doctor_profiles` ADD CONSTRAINT `doctor_profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `job_applications` ADD CONSTRAINT `job_applications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `job_applications` ADD CONSTRAINT `job_applications_job_id_jobs_id_fk` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `masterclass_bookings` ADD CONSTRAINT `masterclass_bookings_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `masterclass_bookings` ADD CONSTRAINT `masterclass_bookings_masterclass_id_masterclasses_id_fk` FOREIGN KEY (`masterclass_id`) REFERENCES `masterclasses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` ADD CONSTRAINT `medical_voice_contacts_voice_id_medical_voices_id_fk` FOREIGN KEY (`voice_id`) REFERENCES `medical_voices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` ADD CONSTRAINT `medical_voice_gathering_joins_voice_id_medical_voices_id_fk` FOREIGN KEY (`voice_id`) REFERENCES `medical_voices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` ADD CONSTRAINT `medical_voice_gathering_joins_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_voice_gatherings` ADD CONSTRAINT `medical_voice_gatherings_voice_id_medical_voices_id_fk` FOREIGN KEY (`voice_id`) REFERENCES `medical_voices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_voice_supporters` ADD CONSTRAINT `medical_voice_supporters_voice_id_medical_voices_id_fk` FOREIGN KEY (`voice_id`) REFERENCES `medical_voices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_voice_supporters` ADD CONSTRAINT `medical_voice_supporters_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_voice_updates` ADD CONSTRAINT `medical_voice_updates_voice_id_medical_voices_id_fk` FOREIGN KEY (`voice_id`) REFERENCES `medical_voices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_voices` ADD CONSTRAINT `medical_voices_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `npa_automation` ADD CONSTRAINT `npa_automation_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` ADD CONSTRAINT `npa_opt_ins_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` ADD CONSTRAINT `npa_opt_ins_template_id_npa_templates_id_fk` FOREIGN KEY (`template_id`) REFERENCES `npa_templates`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` ADD CONSTRAINT `npa_opt_ins_doctor_profile_id_doctor_profiles_id_fk` FOREIGN KEY (`doctor_profile_id`) REFERENCES `doctor_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_attempts` ADD CONSTRAINT `quiz_attempts_quiz_id_quizzes_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_attempts` ADD CONSTRAINT `quiz_attempts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` ADD CONSTRAINT `quiz_leaderboard_quiz_id_quizzes_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` ADD CONSTRAINT `quiz_leaderboard_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_quiz_id_quizzes_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_responses` ADD CONSTRAINT `quiz_responses_quiz_id_quizzes_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_responses` ADD CONSTRAINT `quiz_responses_question_id_quiz_questions_id_fk` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_responses` ADD CONSTRAINT `quiz_responses_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_sessions` ADD CONSTRAINT `quiz_sessions_quiz_id_quizzes_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_sessions` ADD CONSTRAINT `quiz_sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `research_requests` ADD CONSTRAINT `research_requests_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `ix_sessions_user` ON `user_sessions` (`user_id`);
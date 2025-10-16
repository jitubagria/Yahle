CREATE TABLE `ai_tool_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int DEFAULT NULL,
	`tool_type` varchar(100) NOT NULL,
	`input_data` text NOT NULL,
	`output_data` text DEFAULT NULL,
	`status` varchar(50) DEFAULT 'queued',
	`started_at` datetime DEFAULT NULL,
	`finished_at` datetime DEFAULT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `ai_tools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text DEFAULT NULL,
	`is_active` tinyint DEFAULT 1,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `slug` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `api_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`request_id` varchar(64) NOT NULL,
	`route` varchar(255) NOT NULL,
	`method` varchar(10) NOT NULL,
	`status` int NOT NULL,
	`duration_ms` int DEFAULT 0,
	`user_id` int DEFAULT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `medical_voice_gatherings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`voice_id` int NOT NULL,
	`date` datetime DEFAULT CURRENT_TIMESTAMP,
	`location` varchar(255) DEFAULT NULL,
	`contact_person` varchar(150) DEFAULT NULL,
	`phone` varchar(20) DEFAULT NULL
);
--> statement-breakpoint
CREATE TABLE `research_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`details` text NOT NULL,
	`status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending',
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `scheduled_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`job_name` varchar(100) NOT NULL,
	`status` varchar(20) DEFAULT 'pending',
	`last_run` datetime DEFAULT NULL,
	`next_run` datetime DEFAULT NULL,
	`error` text DEFAULT NULL,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE `ai_tool_requests` MODIFY COLUMN `output_data` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `ai_tool_requests` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `bigtos_messages` MODIFY COLUMN `image_url` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `bigtos_messages` MODIFY COLUMN `api_response` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `bigtos_messages` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `certificates` MODIFY COLUMN `rank` varchar(50) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `certificates` MODIFY COLUMN `score` varchar(50) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `certificates` MODIFY COLUMN `background_image` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `certificates` MODIFY COLUMN `output_url` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `certificates` MODIFY COLUMN `sent_status` tinyint;--> statement-breakpoint
ALTER TABLE `certificates` MODIFY COLUMN `sent_status` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `certificates` MODIFY COLUMN `sent_at` datetime DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `certificates` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `course_certificates` MODIFY COLUMN `certificate_url` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `course_certificates` MODIFY COLUMN `issued_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `course_certificates` MODIFY COLUMN `sent_whatsapp` tinyint;--> statement-breakpoint
ALTER TABLE `course_certificates` MODIFY COLUMN `sent_whatsapp` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `course_modules` MODIFY COLUMN `content_url` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `course_modules` MODIFY COLUMN `duration` int DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `course_modules` MODIFY COLUMN `is_preview` tinyint;--> statement-breakpoint
ALTER TABLE `course_modules` MODIFY COLUMN `is_preview` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `course_modules` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `course_progress` MODIFY COLUMN `completed` tinyint;--> statement-breakpoint
ALTER TABLE `course_progress` MODIFY COLUMN `completed` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `course_progress` MODIFY COLUMN `completed_at` datetime DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `course_progress` MODIFY COLUMN `score` int DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `description` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `instructor` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `duration` int DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `thumbnail_image` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `is_active` tinyint DEFAULT 1;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `updated_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `email` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `first_name` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `middle_name` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `last_name` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `dob` date DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `gender` enum('male','female','other') DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `marriatialstatus` enum('single','married','divorced','widowed') DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `professionaldegree` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `profile_pic` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `thumbl` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `thumbs` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `thumbimage` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `user_mobile` varchar(20) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `alternateno` varchar(20) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `user_website` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `user_facebook` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `user_twitter` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `user_instagram` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `contact_others` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ug_admission_year` varchar(10) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ug_location` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ug_college` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `pg_admission_year` varchar(10) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `pg_location` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `pg_college` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `pg_type` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `pg_branch` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ss_admission_year` varchar(10) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ss_location` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ss_college` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ss_type` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `ss_branch` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `additionalqualification_course` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `additionalqualification_admission_year` varchar(10) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `additionalqualification_location` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `additionalqualification_college` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `additionalqualification_details` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_sector` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_country` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_state` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_city` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_central_sub` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `central_others` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_state_sub` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `state_others` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_private_hospital` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_added_private_hospital` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_medicalcollege` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_raj_district` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_raj_block` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `job_raj_place` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `jaipurarea` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `isprofilecomplete` tinyint;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `isprofilecomplete` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `updated_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `doctor_profiles` MODIFY COLUMN `approval_status` enum('pending','approved','rejected') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `enrollments` MODIFY COLUMN `completed_at` datetime DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `enrollments` MODIFY COLUMN `certificate_issued` tinyint;--> statement-breakpoint
ALTER TABLE `enrollments` MODIFY COLUMN `certificate_issued` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `enrollments` MODIFY COLUMN `enrolled_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `enrollments` MODIFY COLUMN `payment_status` enum('free','pending','paid','failed') DEFAULT 'free';--> statement-breakpoint
ALTER TABLE `enrollments` MODIFY COLUMN `payment_id` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `entity_templates` MODIFY COLUMN `font` varchar(100) DEFAULT 'Arial';--> statement-breakpoint
ALTER TABLE `entity_templates` MODIFY COLUMN `text_color` varchar(20) DEFAULT '#000000';--> statement-breakpoint
ALTER TABLE `entity_templates` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `entity_templates` MODIFY COLUMN `updated_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `address` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `city` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `state` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `country` varchar(100) DEFAULT 'India';--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `phone` varchar(20) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `email` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `website` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `specialties` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `description` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `image` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `district` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `hospitals` MODIFY COLUMN `contact_numbers` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `job_applications` MODIFY COLUMN `cover_letter` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `job_applications` MODIFY COLUMN `status` varchar(50) DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `job_applications` MODIFY COLUMN `applied_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `hospital_id` int DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `hospital_name` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `specialty` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `location` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `state` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `city` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `experience_required` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `salary_range` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `job_type` varchar(50) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `description` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `requirements` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `posted_by` int DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `is_active` tinyint DEFAULT 1;--> statement-breakpoint
ALTER TABLE `masterclass_bookings` MODIFY COLUMN `booked_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `description` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `instructor` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `duration` int DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `max_participants` int DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `location` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `thumbnail_image` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `is_active` tinyint DEFAULT 1;--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `name` varchar(150) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `designation` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `phone` varchar(20) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `email` varchar(150) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `is_primary` tinyint;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `is_primary` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `visible` tinyint DEFAULT 1;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` MODIFY COLUMN `status` enum('interested','confirmed','declined') DEFAULT 'interested';--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` MODIFY COLUMN `remarks` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_gathering_joins` MODIFY COLUMN `joined_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `medical_voice_supporters` MODIFY COLUMN `motivation_note` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_supporters` MODIFY COLUMN `joined_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `medical_voice_updates` MODIFY COLUMN `update_title` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_updates` MODIFY COLUMN `update_body` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voice_updates` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `medical_voice_updates` MODIFY COLUMN `notify_supporters` tinyint DEFAULT 1;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `short_description` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `description` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `category` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `banner_image` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `related_documents` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `related_images` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `concerned_authority` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `target_department` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `media_contacts` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `visibility` enum('public','private') DEFAULT 'public';--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `status` enum('active','inactive','archived') DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `has_gathering` tinyint;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `has_gathering` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `gathering_date` datetime DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `gathering_location` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `gathering_address` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `gathering_city` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `gathering_state` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `gathering_pin` varchar(20) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `gathering_map_link` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `gathering_notes` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `creator_id` int DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `medical_voices` MODIFY COLUMN `updated_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `module_tests` MODIFY COLUMN `duration` int DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `module_tests` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `generated_pdf_url` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `status` enum('pending','generated','sent','failed') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `sent_date` datetime DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `last_error` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `template_used` int DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `npa_automation` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `is_active` tinyint DEFAULT 1;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `template_id` int DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `delivery_email` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `delivery_whatsapp` varchar(20) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` MODIFY COLUMN `updated_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `npa_templates` MODIFY COLUMN `description` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `npa_templates` MODIFY COLUMN `is_active` tinyint DEFAULT 1;--> statement-breakpoint
ALTER TABLE `npa_templates` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `npa_templates` MODIFY COLUMN `updated_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `otps` MODIFY COLUMN `phone` varchar(30) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `otps` MODIFY COLUMN `otp` varchar(10) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `otps` MODIFY COLUMN `expires_at` datetime DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `otps` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `quiz_attempts` MODIFY COLUMN `time_taken` int DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `quiz_attempts` MODIFY COLUMN `passed` tinyint;--> statement-breakpoint
ALTER TABLE `quiz_attempts` MODIFY COLUMN `passed` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `quiz_attempts` MODIFY COLUMN `certificate_issued` tinyint;--> statement-breakpoint
ALTER TABLE `quiz_attempts` MODIFY COLUMN `certificate_issued` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `quiz_attempts` MODIFY COLUMN `attempted_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` MODIFY COLUMN `avg_time` int;--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` MODIFY COLUMN `rank` int;--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` MODIFY COLUMN `certificate_url` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `quiz_leaderboard` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `quiz_questions` MODIFY COLUMN `image` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `quiz_responses` MODIFY COLUMN `selected_option` varchar(1) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `quiz_responses` MODIFY COLUMN `is_correct` tinyint;--> statement-breakpoint
ALTER TABLE `quiz_responses` MODIFY COLUMN `is_correct` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `quiz_responses` MODIFY COLUMN `response_time` int;--> statement-breakpoint
ALTER TABLE `quiz_responses` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `quiz_sessions` MODIFY COLUMN `started_at` datetime DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `quiz_sessions` MODIFY COLUMN `status` enum('waiting','running','completed') DEFAULT 'waiting';--> statement-breakpoint
ALTER TABLE `quiz_sessions` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `description` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `status` enum('draft','active','archived') DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `category` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `difficulty` enum('beginner','intermediate','advanced') DEFAULT 'beginner';--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `type` enum('free','practice','live') DEFAULT 'free';--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `duration` int DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `reward_info` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `certificate_type` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `start_time` datetime DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `end_time` datetime DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `quizzes` MODIFY COLUMN `updated_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `research_service_requests` MODIFY COLUMN `status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `research_service_requests` MODIFY COLUMN `assigned_to` int;--> statement-breakpoint
ALTER TABLE `research_service_requests` MODIFY COLUMN `estimated_cost` int;--> statement-breakpoint
ALTER TABLE `research_service_requests` MODIFY COLUMN `completed_at` datetime DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `research_service_requests` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `research_service_requests` MODIFY COLUMN `updated_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `settings` MODIFY COLUMN `description` text DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `settings` MODIFY COLUMN `updated_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `test_responses` MODIFY COLUMN `is_correct` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `device` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `ip` varchar(100) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `is_active` tinyint NOT NULL DEFAULT 1;--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(255) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('doctor','student','admin') NOT NULL DEFAULT 'doctor';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `otp_code` varchar(10) DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `otp_expiry` datetime DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `is_verified` tinyint;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `is_verified` tinyint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `updated_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `otps` ADD `attempts` int DEFAULT 0;
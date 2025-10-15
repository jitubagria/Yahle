ALTER TABLE `courses` MODIFY COLUMN `price` decimal(10,2) DEFAULT 0.00;--> statement-breakpoint
ALTER TABLE `ai_tool_requests` ADD `input_data` json;--> statement-breakpoint
ALTER TABLE `ai_tool_requests` ADD `output_data` json;--> statement-breakpoint
ALTER TABLE `courses` ADD `updated_at` datetime;--> statement-breakpoint
ALTER TABLE `entity_templates` ADD `title` varchar(255);--> statement-breakpoint
ALTER TABLE `entity_templates` ADD `description` text;--> statement-breakpoint
ALTER TABLE `entity_templates` ADD `category` varchar(100);--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` ADD `visible` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `medical_voice_contacts` ADD `is_primary` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `npa_opt_ins` ADD `delivery_email` varchar(255);--> statement-breakpoint
ALTER TABLE `npa_opt_ins` ADD `delivery_whatsapp` varchar(50);--> statement-breakpoint
ALTER TABLE `quiz_attempts` ADD `total_questions` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `quiz_questions` ADD `selected_option` varchar(50);--> statement-breakpoint
ALTER TABLE `quiz_responses` ADD `selected_option` varchar(50);--> statement-breakpoint
ALTER TABLE `quizzes` ADD `updated_at` datetime;
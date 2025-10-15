ALTER TABLE `npa_opt_ins` ADD `is_active` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_questions` ADD `order_index` int;--> statement-breakpoint
ALTER TABLE `quiz_questions` ADD `response_time` int;--> statement-breakpoint
ALTER TABLE `quiz_responses` ADD `response_time` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `quiz_responses` ADD `score` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `quiz_sessions` ADD `current_question` int;--> statement-breakpoint
ALTER TABLE `quizzes` ADD `question_time` int DEFAULT 10;
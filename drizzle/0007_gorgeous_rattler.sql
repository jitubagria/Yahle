ALTER TABLE `npa_automation` ADD `template_used` int;--> statement-breakpoint
ALTER TABLE `npa_automation` ADD `generated_pdf_url` varchar(512);--> statement-breakpoint
ALTER TABLE `npa_automation` ADD `sent_date` datetime;--> statement-breakpoint
ALTER TABLE `npa_automation` ADD `last_error` text;--> statement-breakpoint
CREATE INDEX `ux_quiz_leaderboard_quiz_user` ON `quiz_leaderboard` (`quiz_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `ux_quiz_responses_quiz_user` ON `quiz_responses` (`quiz_id`,`user_id`);
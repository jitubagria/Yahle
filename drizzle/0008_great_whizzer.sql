ALTER TABLE `quizzes` ADD `status` varchar(20) DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE `quizzes` DROP COLUMN `is_active`;
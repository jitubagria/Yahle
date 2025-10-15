ALTER TABLE `users` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `full_name` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `otp_code` varchar(10);--> statement-breakpoint
ALTER TABLE `users` ADD `otp_expiry` datetime;--> statement-breakpoint
ALTER TABLE `users` ADD `is_verified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `image_url` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `role` varchar(50) DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` datetime DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `idx_users_phone` UNIQUE(`phone`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `name`;
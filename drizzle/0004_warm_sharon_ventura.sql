ALTER TABLE `doctor_profiles` MODIFY COLUMN `dob` varchar(50);--> statement-breakpoint
ALTER TABLE `masterclasses` MODIFY COLUMN `price` decimal(10,2) DEFAULT 0.00;
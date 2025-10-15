CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100),
	`email` varchar(255),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`description` text,
	`category` varchar(100),
	`difficulty` varchar(50),
	`type` varchar(50),
	`total_questions` int,
	`question_time` int,
	`duration` int,
	`passing_score` int,
	`entry_fee` int,
	`reward_info` text,
	`certificate_type` varchar(100),
	`start_time` datetime,
	`end_time` datetime,
	`status` varchar(50),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quizzes_id` PRIMARY KEY(`id`)
);

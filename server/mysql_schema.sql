-- ==============================================================================
-- SKYROVIX INTERNSHIP PLATFORM — PRODUCTION MYSQL DATABASE SCHEMA
-- Designed for Contabo VPS Hosting & Self-Hosted MySQL / MariaDB Server
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `skyrovix` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `skyrovix`;

-- 1. BATCHES TABLE
CREATE TABLE IF NOT EXISTS `batches` (
    `id` VARCHAR(64) PRIMARY KEY,
    `name` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `internship_fee` DECIMAL(10,2) DEFAULT 0.00,
    `registration_fee` DECIMAL(10,2) DEFAULT 200.00,
    `start_notice` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS `settings` (
    `key` VARCHAR(191) PRIMARY KEY,
    `value` TEXT NOT NULL,
    `description` VARCHAR(255),
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS `admins` (
    `id` VARCHAR(64) PRIMARY KEY,
    `username` VARCHAR(100) UNIQUE NOT NULL,
    `email` VARCHAR(191) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) DEFAULT 'SUPER_ADMIN',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. STUDENTS / USERS TABLE
CREATE TABLE IF NOT EXISTS `students` (
    `id` VARCHAR(64) PRIMARY KEY,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) UNIQUE NOT NULL,
    `mobile` VARCHAR(50) NOT NULL,
    `college` VARCHAR(255) NOT NULL,
    `degree` VARCHAR(100) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `year_of_study` VARCHAR(50) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `github_url` VARCHAR(255),
    `linkedin_url` VARCHAR(255),
    `skill_level` VARCHAR(50) NOT NULL,
    `password_hash` VARCHAR(255),
    `bio` TEXT,
    `is_active` TINYINT(1) DEFAULT 1,
    `avatar_url` TEXT,
    `student_id_formatted` VARCHAR(64),
    `application_status` VARCHAR(50) DEFAULT 'APPROVED',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_students_email` (`email`),
    INDEX `idx_students_formatted_id` (`student_id_formatted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS `registrations` (
    `id` VARCHAR(64) PRIMARY KEY,
    `student_id` VARCHAR(64) NOT NULL,
    `batch_id` VARCHAR(64) DEFAULT 'batch-1',
    `internship_id` VARCHAR(64),
    `domain` VARCHAR(191) DEFAULT 'Full Stack Development',
    `duration` VARCHAR(50) DEFAULT '1 Month',
    `start_date` VARCHAR(100),
    `end_date` VARCHAR(100),
    `mentor` VARCHAR(191) DEFAULT 'Technical Mentor Board',
    `internship_status` VARCHAR(50) DEFAULT 'ACTIVE',
    `final_project_status` VARCHAR(50) DEFAULT 'NOT_STARTED',
    `final_report_status` VARCHAR(50) DEFAULT 'NOT_STARTED',
    `registration_status` VARCHAR(50) DEFAULT 'APPLICATION_STARTED',
    `payment_status` VARCHAR(50) DEFAULT 'CREATED',
    `payment_order_id` VARCHAR(191),
    `whatsapp_joined` TINYINT(1) DEFAULT 0,
    `current_week` INT DEFAULT 1,
    `progress_pct` INT DEFAULT 0,
    `completed_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_reg_student` (`student_id`),
    INDEX `idx_reg_intern_id` (`internship_id`),
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS `payments` (
    `id` VARCHAR(64) PRIMARY KEY,
    `registration_id` VARCHAR(64) NOT NULL,
    `order_id` VARCHAR(191) UNIQUE NOT NULL,
    `payment_session_id` VARCHAR(255),
    `cashfree_payment_id` VARCHAR(255),
    `amount` DECIMAL(10,2) DEFAULT 200.00,
    `currency` VARCHAR(10) DEFAULT 'INR',
    `status` VARCHAR(50) DEFAULT 'CREATED',
    `payment_method` VARCHAR(100),
    `raw_response` LONGTEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_payments_order` (`order_id`),
    FOREIGN KEY (`registration_id`) REFERENCES `registrations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. PAYMENT EVENTS (WEBHOOK LOGS) TABLE
CREATE TABLE IF NOT EXISTS `payment_events` (
    `id` VARCHAR(64) PRIMARY KEY,
    `order_id` VARCHAR(191) NOT NULL,
    `event_type` VARCHAR(100) NOT NULL,
    `payload` LONGTEXT,
    `signature_verified` TINYINT(1) DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. NOTIFICATIONS / ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` VARCHAR(64) PRIMARY KEY,
    `batch_id` VARCHAR(64) DEFAULT 'batch-1',
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(50) DEFAULT 'announcement',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. USER IN-APP NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `user_notifications` (
    `id` VARCHAR(64) PRIMARY KEY,
    `user_id` VARCHAR(64),
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(50) DEFAULT 'info',
    `is_read` TINYINT(1) DEFAULT 0,
    `link` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_unotif_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. STUDENT TASKS TABLE
CREATE TABLE IF NOT EXISTS `student_tasks` (
    `id` VARCHAR(64) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `domain` VARCHAR(191) DEFAULT 'Full Stack Development',
    `difficulty` VARCHAR(50) DEFAULT 'Beginner',
    `due_date` VARCHAR(100) NOT NULL,
    `key_features` TEXT NOT NULL,
    `expected_outcome` TEXT NOT NULL,
    `order_num` INT DEFAULT 1,
    `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS `submissions` (
    `id` VARCHAR(64) PRIMARY KEY,
    `student_id` VARCHAR(64) NOT NULL,
    `project_id` VARCHAR(64) NOT NULL,
    `project_title` VARCHAR(255) NOT NULL,
    `github_repo_url` VARCHAR(255) NOT NULL,
    `live_deployment_url` VARCHAR(255) NOT NULL,
    `notes` TEXT,
    `status` VARCHAR(50) DEFAULT 'SUBMITTED',
    `feedback` TEXT,
    `grade` VARCHAR(20),
    `submitted_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `reviewed_at` DATETIME,
    INDEX `idx_sub_student` (`student_id`),
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. TRAINING MODULES TABLE (5 Modules)
CREATE TABLE IF NOT EXISTS `training_modules` (
    `id` VARCHAR(64) PRIMARY KEY,
    `module_num` INT NOT NULL UNIQUE,
    `title` VARCHAR(255) NOT NULL,
    `short_title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `objectives` TEXT NOT NULL,
    `instructions` TEXT NOT NULL,
    `exercises` TEXT NOT NULL,
    `resources` TEXT NOT NULL,
    `submission_fields` TEXT NOT NULL,
    `order_num` INT DEFAULT 1,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. TRAINING SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS `training_submissions` (
    `id` VARCHAR(64) PRIMARY KEY,
    `student_id` VARCHAR(64) NOT NULL,
    `module_id` VARCHAR(64) NOT NULL,
    `submission_url` VARCHAR(255),
    `github_url` VARCHAR(255),
    `live_demo_url` VARCHAR(255),
    `notes` TEXT,
    `submission_data` LONGTEXT,
    `status` VARCHAR(50) DEFAULT 'SUBMITTED',
    `admin_feedback` TEXT,
    `reviewed_by` VARCHAR(100),
    `reviewed_at` DATETIME,
    `submitted_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_student_module` (`student_id`, `module_id`),
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`module_id`) REFERENCES `training_modules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. LINKEDIN VERIFICATION SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS `linkedin_submissions` (
    `id` VARCHAR(64) PRIMARY KEY,
    `student_id` VARCHAR(64) NOT NULL,
    `offer_letter_id` VARCHAR(64),
    `post_url` VARCHAR(255) NOT NULL,
    `status` VARCHAR(50) DEFAULT 'PENDING_VERIFICATION',
    `admin_feedback` TEXT,
    `reviewed_by` VARCHAR(100),
    `reviewed_at` DATETIME,
    `submitted_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. 3-STAGE INTERN WORKFLOW TABLE
CREATE TABLE IF NOT EXISTS `intern_workflows` (
    `id` VARCHAR(64) PRIMARY KEY,
    `student_id` VARCHAR(64) UNIQUE NOT NULL,
    `batch_id` VARCHAR(64) DEFAULT 'batch-1',
    `current_stage` INT DEFAULT 1,
    `stage1_status` VARCHAR(50) DEFAULT 'PENDING',
    `stage2_status` VARCHAR(50) DEFAULT 'LOCKED',
    `stage3_status` VARCHAR(50) DEFAULT 'LOCKED',
    `is_manually_locked` TINYINT(1) DEFAULT 0,
    `manual_lock_reason` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. OFFER LETTERS TABLE
CREATE TABLE IF NOT EXISTS `offer_letters` (
    `id` VARCHAR(64) PRIMARY KEY,
    `offer_letter_id` VARCHAR(64),
    `student_id` VARCHAR(64) NOT NULL,
    `internship_id` VARCHAR(64),
    `student_name` VARCHAR(191) NOT NULL,
    `program` VARCHAR(255) NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `role` VARCHAR(100) DEFAULT 'Virtual Intern',
    `batch` VARCHAR(64) DEFAULT 'Batch 1',
    `duration` VARCHAR(50) DEFAULT '1 Month',
    `start_date` VARCHAR(100),
    `end_date` VARCHAR(100),
    `mode` VARCHAR(191) DEFAULT 'Remote / Virtual (Task-Based, Flexible Hours)',
    `mentor` VARCHAR(191) DEFAULT 'Technical Mentor Board',
    `issue_date` VARCHAR(100) NOT NULL,
    `status` VARCHAR(50) DEFAULT 'ACTIVE',
    `verification_code` VARCHAR(100) UNIQUE NOT NULL,
    `terms` TEXT,
    `pdf_url` TEXT,
    `email_status` VARCHAR(50) DEFAULT 'SENT',
    `email_sent_at` DATETIME,
    `downloaded_at` DATETIME,
    `viewed_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_ol_student` (`student_id`),
    INDEX `idx_ol_code` (`verification_code`),
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS `certificates` (
    `id` VARCHAR(64) PRIMARY KEY,
    `certificate_id` VARCHAR(64),
    `student_id` VARCHAR(64) NOT NULL,
    `internship_id` VARCHAR(64),
    `student_name` VARCHAR(191) NOT NULL,
    `program` VARCHAR(255) DEFAULT '3-Month Full Stack Development Internship',
    `domain` VARCHAR(191) DEFAULT 'Full Stack Development',
    `batch` VARCHAR(64) DEFAULT 'Batch 1',
    `duration` VARCHAR(50) DEFAULT '3 Months',
    `issue_date` VARCHAR(100) NOT NULL,
    `start_date` VARCHAR(100),
    `end_date` VARCHAR(100),
    `status` VARCHAR(50) DEFAULT 'ISSUED',
    `certificate_status` VARCHAR(50) DEFAULT 'VALID',
    `revoked` TINYINT(1) DEFAULT 0,
    `grade` VARCHAR(20) DEFAULT 'A+',
    `verification_url` VARCHAR(255),
    `pdf_url` TEXT,
    `qr_code_data` LONGTEXT,
    `email_status` VARCHAR(50) DEFAULT 'SENT',
    `email_sent_at` DATETIME,
    `downloaded_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_cert_student` (`student_id`),
    INDEX `idx_cert_id` (`certificate_id`),
    INDEX `idx_cert_status` (`certificate_status`),
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS `support_tickets` (
    `id` VARCHAR(64) PRIMARY KEY,
    `user_id` VARCHAR(64) NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `user_email` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `message` TEXT NOT NULL,
    `priority` VARCHAR(50) DEFAULT 'Medium',
    `status` VARCHAR(50) DEFAULT 'Open',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_tickets_user` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. SUPPORT REPLIES TABLE
CREATE TABLE IF NOT EXISTS `support_replies` (
    `id` VARCHAR(64) PRIMARY KEY,
    `ticket_id` VARCHAR(64) NOT NULL,
    `sender_id` VARCHAR(64) NOT NULL,
    `sender_name` VARCHAR(191) NOT NULL,
    `sender_role` VARCHAR(50) NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_replies_ticket` (`ticket_id`),
    FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` VARCHAR(64) PRIMARY KEY,
    `admin_id` VARCHAR(64) NOT NULL,
    `admin_name` VARCHAR(191) NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `target_type` VARCHAR(100) NOT NULL,
    `target_id` VARCHAR(191),
    `details` LONGTEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_audit_admin` (`admin_id`),
    INDEX `idx_audit_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. EMAIL LOGS TABLE
CREATE TABLE IF NOT EXISTS `email_logs` (
    `id` VARCHAR(64) PRIMARY KEY,
    `recipient_email` VARCHAR(191) NOT NULL,
    `recipient_name` VARCHAR(191),
    `subject` VARCHAR(255) NOT NULL,
    `email_type` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) DEFAULT 'SENT',
    `reference_id` VARCHAR(191),
    `error_message` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_email_recipient` (`recipient_email`),
    INDEX `idx_email_ref` (`reference_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DEFAULT SEEDS
-- ==============================================================================

INSERT IGNORE INTO `batches` (`id`, `name`, `title`, `internship_fee`, `registration_fee`, `start_notice`)
VALUES ('batch-1', 'Batch 1', '3-Month Full Stack Development Internship', 0.00, 200.00, 'Batch 1 starts within the next 10 days. Exact start date, schedule and further instructions will be shared through the official WhatsApp group.');

INSERT IGNORE INTO `settings` (`key`, `value`, `description`)
VALUES 
('BATCH_1_WHATSAPP_URL', 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP', 'Official WhatsApp Group invitation link for Batch 1 students'),
('BATCH_START_NOTICE', 'Batch 1 starts within the next 10 days.', 'Public announcement notice displayed across hero & banners'),
('REGISTRATION_FEE', '200', 'Registration fee amount in INR'),
('REGISTRATION_STATUS_ACTIVE', 'true', 'Whether new registrations are active');

INSERT IGNORE INTO `admins` (`id`, `username`, `email`, `password_hash`, `role`)
VALUES ('admin-default', 'skyrovix_admin', 'admin@skyrovix.com', '$2b$10$fC00m65m094eFz3Bw0Uo4OSr0eXpQG31ZgVv8Z30qPj781V1B1S8.', 'SUPER_ADMIN');

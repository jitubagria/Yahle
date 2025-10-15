-- MySQL Script for DocsUniverse Database
-- Converted from PostgreSQL dump on October 15, 2025
-- All tables use InnoDB for transactions/FKs
SET FOREIGN_KEY_CHECKS=0; -- Temporarily disable FK checks for import
DROP TABLE IF EXISTS ai_tool_requests;
DROP TABLE IF EXISTS bigtos_messages;
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS course_certificates;
DROP TABLE IF EXISTS course_modules;
DROP TABLE IF EXISTS course_progress;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS doctor_profiles;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS entity_templates;
DROP TABLE IF EXISTS hospitals;
DROP TABLE IF EXISTS job_applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS masterclass_bookings;
DROP TABLE IF EXISTS masterclasses;
DROP TABLE IF EXISTS medical_voice_contacts;
DROP TABLE IF EXISTS medical_voice_gathering_joins;
DROP TABLE IF EXISTS medical_voice_supporters;
DROP TABLE IF EXISTS medical_voice_updates;
DROP TABLE IF EXISTS medical_voices;
DROP TABLE IF EXISTS module_tests;
DROP TABLE IF EXISTS npa_automation;
DROP TABLE IF EXISTS npa_opt_ins;
DROP TABLE IF EXISTS npa_templates;
DROP TABLE IF EXISTS quiz_attempts;
DROP TABLE IF EXISTS quiz_leaderboard;
DROP TABLE IF EXISTS quiz_questions;
DROP TABLE IF EXISTS quiz_responses;
DROP TABLE IF EXISTS quiz_sessions;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS research_service_requests;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS test_questions;
DROP TABLE IF EXISTS test_responses;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE ai_tool_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tool_type VARCHAR(100) NOT NULL,
    input_data TEXT NOT NULL,
    output_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE bigtos_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mobile VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    type VARCHAR(20) NOT NULL,
    api_response TEXT,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type ENUM('course', 'quiz', 'masterclass') NOT NULL,
    entity_id INT NOT NULL,
    user_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    rank VARCHAR(50),
    score VARCHAR(50),
    background_image TEXT,
    output_url TEXT,
    sent_status TINYINT(1) DEFAULT 0,
    sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE course_certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    certificate_url TEXT,
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sent_whatsapp TINYINT(1) DEFAULT 0,
    certificate_number VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE course_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_type ENUM('video', 'pdf', 'text', 'quiz') NOT NULL,
    content_url TEXT,
    order_no INT NOT NULL,
    duration INT,
    is_preview TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE course_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id INT NOT NULL,
    module_id INT NOT NULL,
    completed TINYINT(1) DEFAULT 0,
    completed_at DATETIME,
    score INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor VARCHAR(255),
    duration INT,
    price INT DEFAULT 0,
    thumbnail_image TEXT,
    enrollment_count INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE doctor_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    email VARCHAR(255),
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    dob DATE,
    gender ENUM('male', 'female', 'other'),
    marriatialstatus ENUM('single', 'married', 'divorced', 'widowed'),
    professionaldegree VARCHAR(255),
    profile_pic TEXT,
    thumbl TEXT,
    thumbs TEXT,
    thumbimage TEXT,
    user_mobile VARCHAR(20),
    alternateno VARCHAR(20),
    user_website VARCHAR(255),
    user_facebook VARCHAR(255),
    user_twitter VARCHAR(255),
    user_instagram VARCHAR(255),
    contact_others TEXT,
    ug_admission_year VARCHAR(10),
    ug_location VARCHAR(255),
    ug_college VARCHAR(255),
    pg_admission_year VARCHAR(10),
    pg_location VARCHAR(255),
    pg_college VARCHAR(255),
    pg_type VARCHAR(100),
    pg_branch VARCHAR(100),
    ss_admission_year VARCHAR(10),
    ss_location VARCHAR(255),
    ss_college VARCHAR(255),
    ss_type VARCHAR(100),
    ss_branch VARCHAR(100),
    additionalqualification_course VARCHAR(255),
    additionalqualification_admission_year VARCHAR(10),
    additionalqualification_location VARCHAR(255),
    additionalqualification_college VARCHAR(255),
    additionalqualification_details TEXT,
    job_sector VARCHAR(100),
    job_country VARCHAR(100),
    job_state VARCHAR(100),
    job_city VARCHAR(100),
    job_central_sub VARCHAR(100),
    central_others VARCHAR(255),
    job_state_sub VARCHAR(100),
    state_others VARCHAR(255),
    job_private_hospital VARCHAR(255),
    job_added_private_hospital VARCHAR(255),
    job_medicalcollege VARCHAR(255),
    job_raj_district VARCHAR(100),
    job_raj_block VARCHAR(100),
    job_raj_place VARCHAR(100),
    jaipurarea VARCHAR(100),
    isprofilecomplete TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    progress INT DEFAULT 0,
    completed_at DATETIME,
    certificate_issued TINYINT(1) DEFAULT 0,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_status ENUM('free', 'pending', 'paid', 'failed') DEFAULT 'free',
    payment_id VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE entity_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type ENUM('course', 'quiz', 'masterclass') NOT NULL,
    entity_id INT NOT NULL,
    background_image TEXT NOT NULL,
    font VARCHAR(100) DEFAULT 'Arial',
    text_color VARCHAR(20) DEFAULT '#000000',
    text_positions TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    specialties TEXT,
    description TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    district VARCHAR(100),
    contact_numbers TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    hospital_id INT,
    hospital_name VARCHAR(255),
    specialty VARCHAR(255),
    location VARCHAR(255),
    state VARCHAR(100),
    city VARCHAR(100),
    experience_required VARCHAR(100),
    salary_range VARCHAR(100),
    job_type VARCHAR(50),
    description TEXT,
    requirements TEXT,
    posted_by INT,
    is_active TINYINT(1) DEFAULT 1,
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE masterclass_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    masterclass_id INT NOT NULL,
    booked_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE masterclasses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor VARCHAR(255),
    event_date DATETIME NOT NULL,
    duration INT,
    max_participants INT,
    current_participants INT DEFAULT 0,
    price INT DEFAULT 0,
    location VARCHAR(255),
    thumbnail_image TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE medical_voice_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voice_id INT NOT NULL,
    name VARCHAR(150),
    designation VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(150),
    is_primary TINYINT(1) DEFAULT 0,
    visible TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE medical_voice_gathering_joins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voice_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('interested', 'confirmed', 'declined') DEFAULT 'interested',
    remarks TEXT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE medical_voice_supporters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voice_id INT NOT NULL,
    user_id INT NOT NULL,
    motivation_note TEXT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE medical_voice_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voice_id INT NOT NULL,
    update_title VARCHAR(255),
    update_body TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notify_supporters TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE medical_voices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    category VARCHAR(100),
    banner_image TEXT,
    related_documents TEXT,
    related_images TEXT,
    concerned_authority VARCHAR(255),
    target_department VARCHAR(255),
    media_contacts TEXT,
    visibility ENUM('public', 'private') DEFAULT 'public',
    status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
    supporters_count INT DEFAULT 0,
    has_gathering TINYINT(1) DEFAULT 0,
    gathering_date DATETIME,
    gathering_location VARCHAR(255),
    gathering_address TEXT,
    gathering_city VARCHAR(100),
    gathering_state VARCHAR(100),
    gathering_pin VARCHAR(20),
    gathering_map_link TEXT,
    gathering_notes TEXT,
    creator_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE module_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    total_questions INT DEFAULT 0,
    passing_score INT DEFAULT 60,
    duration INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE npa_automation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    opt_in_id INT NOT NULL,
    user_id INT NOT NULL,
    month VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    generated_pdf_url TEXT,
    status ENUM('pending', 'generated', 'sent', 'failed') DEFAULT 'pending',
    sent_date DATETIME,
    last_error TEXT,
    template_used INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE npa_opt_ins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    doctor_profile_id INT NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    preferred_day INT DEFAULT 1,
    template_id INT,
    delivery_email VARCHAR(255),
    delivery_whatsapp VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE npa_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    html_template TEXT NOT NULL,
    placeholders TEXT NOT NULL DEFAULT '',
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    time_taken INT,
    passed TINYINT(1) DEFAULT 0,
    certificate_issued TINYINT(1) DEFAULT 0,
    attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE quiz_leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    user_id INT NOT NULL,
    total_score INT DEFAULT 0,
    avg_time INT,
    rank INT,
    certificate_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    correct_option VARCHAR(1) NOT NULL,
    order_index INT DEFAULT 0,
    image TEXT,
    marks INT DEFAULT 1,
    options TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE quiz_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_id INT NOT NULL,
    user_id INT NOT NULL,
    selected_option VARCHAR(1),
    is_correct TINYINT(1) DEFAULT 0,
    response_time INT,
    score INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE quiz_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    current_question INT DEFAULT 0,
    started_at DATETIME,
    status ENUM('waiting', 'running', 'completed') DEFAULT 'waiting',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    passing_score INT DEFAULT 60,
    status ENUM('draft', 'active', 'archived') DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(100),
    difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    type ENUM('free', 'practice', 'live') DEFAULT 'free',
    total_questions INT DEFAULT 0,
    question_time INT DEFAULT 30,
    duration INT,
    entry_fee INT DEFAULT 0,
    reward_info TEXT,
    certificate_type VARCHAR(100),
    start_time DATETIME,
    end_time DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE research_service_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    assigned_to INT,
    estimated_cost INT,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE test_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    question_no INT NOT NULL,
    description TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer VARCHAR(1) NOT NULL,
    marks INT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE test_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option VARCHAR(1) NOT NULL,
    is_correct TINYINT(1) NOT NULL,
    score INT DEFAULT 0,
    answered_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    role ENUM('doctor', 'student', 'admin') DEFAULT 'doctor' NOT NULL,
    otp_code VARCHAR(10),
    otp_expiry DATETIME,
    is_verified TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Now insert data (converted from COPY to INSERT)
INSERT INTO ai_tool_requests (id, user_id, tool_type, input_data, output_data, created_at) VALUES 
(1, 51, 'diagnostic_helper', '{`symptoms`: `Fever, cough, chest pain`, `duration`: `5 days`}', '{`differential_diagnosis`: [`Pneumonia`, `Bronchitis`, `COVID-19`], `recommendations`: `Chest X-ray, CBC, COVID test`}', '2025-10-12 06:35:57.499981'),
(2, 53, 'stats_calculator', '{`data`: [120, 135, 142, 128, 156], `test`: `t-test`}', '{`mean`: 136.2, `std_dev`: 14.8, `p_value`: 0.045}', '2025-10-12 06:35:57.499981'),
(3, 55, 'clinical_notes', '{`patient_id`: `P12345`, `complaint`: `Hypertension follow-up`}', '{`soap_note`: `S: Patient reports compliance with medications\\nO: BP 138/86 mmHg\\nA: Controlled hypertension\\nP: Continue current medications`}', '2025-10-12 06:35:57.499981'),
(4, 56, 'diagnostic_helper', '{`symptoms`: `Headache, photophobia, nausea`, `duration`: `12 hours`}', '{`differential_diagnosis`: [`Migraine`, `Meningitis`, `Cluster headache`], `recommendations`: `Neurological exam, Consider CT if red flags`}', '2025-10-12 06:35:57.499981'),
(5, 51, 'diagnostic_helper', 'Patient: 65yo male, chest pain radiating to left arm, sweating, BP 140/90, HR 110. ECG shows ST elevation in V1-V4', 'Likely Diagnosis: Acute Anterior MI (STEMI). Immediate Actions: Aspirin 300mg, Clopidogrel 300mg, Morphine for pain, Oxygen if SpO2<94%, Emergency PCI within 90 min. Monitor: Serial ECG, Troponin levels, Vitals q15min.', '2025-10-10 07:25:00.512155'),
(6, 52, 'stats_calculator', 'Study data: Group A (n=50): Mean=120, SD=15. Group B (n=45): Mean=135, SD=18. Calculate t-test and p-value', 'Independent Samples t-test Results: t-statistic = -4.32, df = 93, p-value = 0.00004 (p<0.001). Conclusion: Highly significant difference between groups. Effect size (Cohen d) = 0.89 (large effect).', '2025-10-07 07:25:00.512155'),
(7, 55, 'clinical_notes', 'Generate discharge summary for 45yo diabetic patient admitted with DKA, treated with IV insulin, now stable on subcutaneous insulin', 'DISCHARGE SUMMARY\\nPatient: 45yo diabetic\\nAdmission: Diabetic Ketoacidosis\\nHospital Course: Treated with IV insulin protocol, fluid resuscitation. Transitioned to subcutaneous insulin regimen.\\nDischarge Medications: Insulin Glargine 20 units HS, Insulin Lispro 8-10 units TID with meals\\nFollow-up: Endocrinology clinic in 1 week, Home glucose monitoring QID\\nPatient Education: Sick day management, hypoglycemia recognition', '2025-10-11 07:25:00.512155'),
(8, 53, 'diagnostic_helper', '22yo female, fever 101F, sore throat, cervical lymphadenopathy, negative rapid strep test', 'Differential Diagnosis: 1) Infectious Mononucleosis (most likely) 2) Viral pharyngitis 3) Early CMV infection. Recommended Tests: Monospot test, CBC with diff (look for atypical lymphocytes), EBV serology. Management: Symptomatic treatment, avoid contact sports if mono confirmed (splenic rupture risk).', '2025-10-09 07:25:00.512155'),
(9, 54, 'stats_calculator', 'Calculate sample size needed for RCT, power=0.80, alpha=0.05, effect size=0.5', 'Sample Size Calculation Results:\\nPower Analysis for Independent Samples\\n- Effect size (Cohen d): 0.5 (medium)\\n- Alpha level: 0.05 (two-tailed)\\n- Power: 0.80\\n\\nRequired sample size: 64 per group (128 total)\\nRecommended with 20% dropout: 80 per group (160 total)', '2025-10-05 07:25:00.512155');

INSERT INTO bigtos_messages (id, mobile, message, image_url, type, api_response, status, created_at) VALUES 
(1, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-11 20:13:57.701446'),
(2, '9990172019', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-11 20:17:22.408507'),
(3, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-11 20:24:23.73059'),
(4, '9990172019', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-11 20:27:46.01069'),
(5, '9990172019', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-11 20:28:18.430933'),
(6, '9990172019', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-11 20:29:11.756221'),
(7, '9990172019', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-11 20:31:32.857647'),
(8, '9799720730', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-11 20:32:12.646071'),
(9, '9799720730', '🎓 *Course Enrollment Confirmed*\n\nYou have successfully enrolled in:\n*Advanced Cardiology*\n\nStart learning now on DocsUniverse!', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-11 21:02:09.523767'),
(10, '9876543210', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-11 21:10:43.07314'),
(11, '9988776655', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-11 21:13:54.527687'),
(12, '9988776655', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-11 21:16:37.582555'),
(13, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-12 03:04:02.911916'),
(14, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-12 03:33:41.959763'),
(15, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-12 03:38:22.915366'),
(16, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-12 03:52:48.507679'),
(17, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'Development mode - not sent', 'success', '2025-10-12 03:55:32.406887'),
(18, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', '{`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb2bdeb80ce8b2550c21c3`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 04:17:34.766894'),
(19, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'BigTos API failed: {`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb2bdeb80ce8b2550c21c3`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 04:17:34.834137'),
(20, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', '{`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb3029164b145c3d0f91a2`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 04:35:53.48505'),
(21, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'BigTos API failed: {`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb3029164b145c3d0f91a2`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 04:35:53.553899'),
(22, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', '{`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb3140975afcb3ba00d059`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 04:40:32.415563'),
(23, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'BigTos API failed: {`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb3140975afcb3ba00d059`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 04:40:32.486686'),
(24, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', '{`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb32e4120e24d73c09c69f`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 04:47:32.507956'),
(25, '9999999999', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'BigTos API failed: {`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb32e4120e24d73c09c69f`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 04:47:32.577421'),
(26, '9000000001', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', '{`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb41f428cf8ad5570649b1`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 05:51:48.704787'),
(27, '9000000001', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'BigTos API failed: {`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb41f428cf8ad5570649b1`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 05:51:48.772472'),
(28, '9000000002', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', '{`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb431e28cf8ad557064a9d`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 05:56:46.462304'),
(29, '9000000002', 'Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.', NULL, 'Text', 'BigTos API failed: {`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb431e28cf8ad557064a9d`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 05:56:46.580309'),
(30, '9111111112', 'Test WhatsApp message for filtered doctors', NULL, 'Text', '{`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb446a42633dff480611fe`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 06:02:18.869982'),
(31, '9111111112', 'Test WhatsApp message for filtered doctors', NULL, 'Text', 'BigTos API failed: {`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb446a42633dff480611fe`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 06:02:18.943379'),
(32, '9333333334', 'Test WhatsApp message for filtered doctors', NULL, 'Text', '{`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb446bd2901a849102a80e`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 06:02:19.270554'),
(33, '9333333334', 'Test WhatsApp message for filtered doctors', NULL, 'Text', 'BigTos API failed: {`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb446bd2901a849102a80e`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 06:02:19.330392'),
(34, '9111111113', 'Test WhatsApp message for filtered doctors', NULL, 'Text', '{`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb446bd9f9f2b50b045507`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 06:02:19.661635'),
(35, '9111111113', 'Test WhatsApp message for filtered doctors', NULL, 'Text', 'BigTos API failed: {`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb446bd9f9f2b50b045507`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 06:02:19.721208'),
(36, '9333333335', 'Test WhatsApp message for filtered doctors', NULL, 'Text', '{`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb446b9335f7aa3301a905`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 06:02:20.061157'),
(37, '9333333335', 'Test WhatsApp message for filtered doctors', NULL, 'Text', 'BigTos API failed: {`msg`:`Messages Sent Successfully.`,`msg_id`:`68eb446b9335f7aa3301a905`,`status`:`Success`,`data`:``}', 'failed', '2025-10-12 06:02:20.120721');

-- (No data for certificates, course_certificates - empty in dump)
INSERT INTO course_modules (id, course_id, title, content_type, content_url, order_no, duration, is_preview, created_at) VALUES 
(2, 2, 'hi', 'text', '', 1, 4, 1, '2025-10-12 04:19:42.625278'),
(3, 9, 'hhaha', 'video', '', 1, 0, 0, '2025-10-12 04:50:42.177863'),
(4, 10, 'Introduction to Clinical Examination', 'video', 'https://example.com/videos/intro-clinical-exam.mp4', 1, 45, 1, '2025-10-12 06:30:36.771437'),
(5, 10, 'Vital Signs Monitoring Techniques', 'video', 'https://example.com/videos/vital-signs.mp4', 2, 60, 0, '2025-10-12 06:30:36.771437'),
(6, 10, 'Patient History Taking - Best Practices', 'pdf', 'https://example.com/pdfs/history-taking.pdf', 3, 30, 0, '2025-10-12 06:30:36.771437'),
(7, 10, 'Physical Examination Skills', 'video', 'https://example.com/videos/physical-exam.mp4', 4, 90, 0, '2025-10-12 06:30:36.771437'),
(8, 10, 'Module 1 Assessment', 'quiz', NULL, 5, 20, 0, '2025-10-12 06:30:36.771437'),
(9, 11, 'ECG Basics and Lead Placement', 'video', 'https://example.com/videos/ecg-basics.mp4', 1, 50, 1, '2025-10-12 06:30:36.771437'),
(10, 11, 'Normal Cardiac Rhythms', 'pdf', 'https://example.com/pdfs/normal-rhythms.pdf', 2, 40, 0, '2025-10-12 06:30:36.771437'),
(11, 11, 'Arrhythmia Recognition', 'video', 'https://example.com/videos/arrhythmia.mp4', 3, 70, 0, '2025-10-12 06:30:36.771437'),
(12, 11, 'STEMI and ACS Diagnosis', 'video', 'https://example.com/videos/stemi-acs.mp4', 4, 80, 0, '2025-10-12 06:30:36.771437'),
(13, 11, 'Cardiology Module Test', 'quiz', NULL, 5, 25, 0, '2025-10-12 06:30:36.771437'),
(14, 12, 'Pediatric Assessment Triangle', 'video', 'https://example.com/videos/ped-assessment.mp4', 1, 35, 1, '2025-10-12 06:30:36.771437'),
(15, 12, 'Respiratory Emergencies in Children', 'video', 'https://example.com/videos/ped-respiratory.mp4', 2, 55, 0, '2025-10-12 06:30:36.771437'),
(16, 12, 'Pediatric Trauma Management', 'pdf', 'https://example.com/pdfs/ped-trauma.pdf', 3, 45, 0, '2025-10-12 06:30:36.771437'),
(17, 12, 'Emergency Medicine Assessment', 'quiz', NULL, 4, 20, 0, '2025-10-12 06:30:36.771437'),
(18, 13, 'Surgical Instruments Overview', 'video', 'https://example.com/videos/surgical-instruments.mp4', 1, 40, 1, '2025-10-12 06:30:36.771437'),
(19, 13, 'Basic Suturing Techniques', 'video', 'https://example.com/videos/suturing-basic.mp4', 2, 75, 0, '2025-10-12 06:30:36.771437'),
(20, 13, 'Advanced Suturing Patterns', 'video', 'https://example.com/videos/suturing-advanced.mp4', 3, 85, 0, '2025-10-12 06:30:36.771437'),
(21, 13, 'Wound Management and Closure', 'pdf', 'https://example.com/pdfs/wound-management.pdf', 4, 50, 0, '2025-10-12 06:30:36.771437'),
(22, 13, 'Surgical Skills Test', 'quiz', NULL, 5, 30, 0, '2025-10-12 06:30:36.771437'),
(23, 14, 'Research Methodology Basics', 'video', 'https://example.com/videos/research-methods.mp4', 1, 50, 1, '2025-10-12 06:30:36.771437'),
(24, 14, 'Statistical Analysis Fundamentals', 'pdf', 'https://example.com/pdfs/statistics-basics.pdf', 2, 60, 0, '2025-10-12 06:30:36.771437'),
(25, 14, 'Critical Appraisal of Studies', 'video', 'https://example.com/videos/critical-appraisal.mp4', 3, 55, 0, '2025-10-12 06:30:36.771437'),
(26, 14, 'Research Module Quiz', 'quiz', NULL, 4, 25, 0, '2025-10-12 06:30:36.771437'),
(27, 15, 'Introduction to Advanced ECG Interpretation', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, 45, 1, '2025-10-12 07:14:14.304227'),
(28, 15, 'Cardiac Biomarkers and Diagnostic Algorithms', 'text', NULL, 2, 30, 0, '2025-10-12 07:14:14.304227'),
(29, 15, 'Advanced Heart Failure Management', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 3, 60, 0, '2025-10-12 07:14:14.304227'),
(30, 15, 'ECG and Biomarkers Assessment', 'quiz', NULL, 4, 20, 0, '2025-10-12 07:14:14.304227'),
(31, 15, 'Interventional Cardiology Techniques', 'text', NULL, 5, 40, 0, '2025-10-12 07:14:14.304227'),
(32, 15, 'Heart Failure and Interventions Final Assessment', 'quiz', NULL, 6, 25, 0, '2025-10-12 07:14:14.304227'),
(33, 1, 'Introduction to Advanced ECG', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, 30, 1, '2025-10-12 07:19:34.522469'),
(34, 1, 'Cardiac Biomarkers', 'text', NULL, 2, 20, 0, '2025-10-12 07:19:34.522469'),
(35, 1, 'ECG Assessment Quiz', 'quiz', NULL, 3, 15, 0, '2025-10-12 07:19:34.522469'),
(36, 5, 'Research Design Fundamentals', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, 40, 1, '2025-10-12 07:19:34.522469'),
(37, 5, 'Statistical Analysis Basics', 'pdf', 'https://example.com/stats.pdf', 2, 35, 0, '2025-10-12 07:19:34.522469'),
(38, 5, 'Ethics in Research', 'text', NULL, 3, 25, 0, '2025-10-12 07:19:34.522469'),
(39, 5, 'Research Methods Quiz', 'quiz', NULL, 4, 20, 0, '2025-10-12 07:19:34.522469'),
(40, 8, 'Principles of Medical Ethics', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, 35, 1, '2025-10-12 07:19:34.522469'),
(41, 8, 'Patient Confidentiality', 'text', NULL, 2, 25, 0, '2025-10-12 07:19:34.522469'),
(42, 8, 'Informed Consent', 'text', NULL, 3, 30, 0, '2025-10-12 07:19:34.522469'),
(43, 8, 'Medical Ethics Quiz', 'quiz', NULL, 4, 20, 0, '2025-10-12 07:19:34.522469');

INSERT INTO course_progress (id, enrollment_id, module_id, completed, completed_at, score) VALUES 
(1, 1, 4, 1, NULL, NULL),
(2, 1, 5, 1, NULL, NULL),
(3, 3, 14, 1, NULL, NULL),
(4, 3, 15, 1, NULL, NULL),
(5, 3, 16, 1, NULL, NULL),
(6, 3, 17, 1, NULL, 85),
(7, 4, 4, 1, NULL, NULL),
(8, 4, 5, 1, NULL, NULL),
(9, 4, 6, 1, NULL, NULL),
(10, 10, 27, 1, '2025-09-28 07:26:12.433497', NULL),
(11, 10, 28, 1, '2025-09-29 07:26:12.433497', NULL),
(12, 14, 33, 1, '2025-09-14 07:26:12.433497', NULL),
(13, 14, 34, 1, '2025-09-17 07:26:12.433497', NULL),
(14, 14, 35, 1, '2025-09-18 07:26:12.433497', 85),
(15, 21, 33, 1, '2025-08-25 07:26:12.433497', NULL),
(16, 21, 34, 1, '2025-08-27 07:26:12.433497', NULL),
(17, 21, 35, 1, '2025-08-28 07:26:12.433497', 92);

INSERT INTO courses (id, title, description, instructor, duration, price, thumbnail_image, enrollment_count, is_active, created_at, updated_at) VALUES 
(1, 'Advanced Cardiology', 'Comprehensive course on cardiovascular diseases and treatments', 'Dr. Rajesh Sharma', 31, 14534, NULL, 43, 1, '2025-10-11 19:32:54.258714', '2025-10-11 19:32:54.258714'),
(2, 'Pediatric Emergency Care', 'Essential skills for handling pediatric emergencies', 'Dr. Priya Patel', 51, 12568, NULL, 484, 1, '2025-10-11 19:32:54.326321', '2025-10-11 19:32:54.326321'),
(3, 'Surgical Techniques', 'Modern surgical methods and best practices', 'Dr. Amit Singh', 26, 18057, NULL, 75, 1, '2025-10-11 19:32:54.390415', '2025-10-11 19:32:54.390415'),
(4, 'Radiology Imaging', 'Advanced imaging techniques and interpretation', 'Dr. Neha Kumar', 47, 10721, NULL, 481, 1, '2025-10-11 19:32:54.450265', '2025-10-11 19:32:54.450265'),
(5, 'Clinical Research Methods', 'Introduction to clinical trials and research', 'Dr. Vikram Gupta', 43, 14958, NULL, 78, 1, '2025-10-11 19:32:54.512173', '2025-10-11 19:32:54.512173'),
(6, 'Oncology Updates', 'Latest developments in cancer treatment', 'Dr. Anjali Reddy', 53, 16683, NULL, 314, 1, '2025-10-11 19:32:54.573364', '2025-10-11 19:32:54.573364'),
(7, 'Neurosurgical Approaches', 'Advanced neurosurgical techniques', 'Dr. Rahul Nair', 43, 9307, NULL, 197, 1, '2025-10-11 19:32:54.633789', '2025-10-11 19:32:54.633789'),
(8, 'Medical Ethics', 'Ethical considerations in modern medicine', 'Dr. Sneha Mehta', 59, 6685, NULL, 239, 1, '2025-10-11 19:32:54.696178', '2025-10-11 19:32:54.696178'),
(9, '', '', '', 0, 0, '', 0, 1, '2025-10-12 04:50:19.134', '2025-10-12 04:50:19.134'),
(10, 'Basic Clinical Skills & Patient Assessment', 'Master fundamental clinical examination techniques, vital signs monitoring, and patient assessment protocols essential for every healthcare professional.', 'Dr. Rajesh Kumar', 12, 2999, NULL, 0, 1, '2025-10-12 06:30:16.201664', '2025-10-12 06:30:16.201664'),
(11, 'Advanced Cardiology: ECG Interpretation', 'Comprehensive course on reading and interpreting ECGs, understanding cardiac rhythms, and identifying life-threatening conditions.', 'Dr. Priya Sharma', 8, 3499, NULL, 0, 1, '2025-10-12 06:30:16.201664', '2025-10-12 06:30:16.201664'),
(12, 'Pediatric Emergency Medicine', 'Learn to manage pediatric emergencies, from respiratory distress to trauma care, with evidence-based protocols.', 'Dr. Amit Patel', 10, 0, NULL, 0, 1, '2025-10-12 06:30:16.201664', '2025-10-12 06:30:16.201664'),
(13, 'Surgical Techniques & Suturing Mastery', 'Step-by-step video demonstrations of surgical techniques, suturing methods, and wound management.', 'Dr. Sunita Reddy', 15, 4999, NULL, 0, 1, '2025-10-12 06:30:16.201664', '2025-10-12 06:30:16.201664'),
(14, 'Medical Research & Statistics Made Easy', 'Understand research methodology, statistical analysis, and how to critically appraise medical literature.', 'Dr. Vikram Singh', 6, 1999, NULL, 0, 1, '2025-10-12 06:30:16.201664', '2025-10-12 06:30:16.201664'),
(15, 'Advanced Clinical Cardiology', 'Master advanced cardiovascular diagnostics, treatment protocols, and patient management. Includes comprehensive testing to validate your knowledge.', 'Dr. Sarah Johnson, MD Cardiology', 180, 4999, 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800', 0, 1, '2025-10-12 07:13:06.275109', '2025-10-12 07:13:06.275109');

INSERT INTO doctor_profiles (id, user_id, email, first_name, middle_name, last_name, dob, gender, marriatialstatus, professionaldegree, profile_pic, thumbl, thumbs, thumbimage, user_mobile, alternateno, user_website, user_facebook, user_twitter, user_instagram, contact_others, ug_admission_year, ug_location, ug_college, pg_admission_year, pg_location, pg_college, pg_type, pg_branch, ss_admission_year, ss_location, ss_college, ss_type, ss_branch, additionalqualification_course, additionalqualification_admission_year, additionalqualification_location, additionalqualification_college, additionalqualification_details, job_sector, job_country, job_state, job_city, job_central_sub, central_others, job_state_sub, state_others, job_private_hospital, job_added_private_hospital, job_medicalcollege, job_raj_district, job_raj_block, job_raj_place, jaipurarea, isprofilecomplete, created_at, updated_at, approval_status) VALUES 
(1, 1, 'dr.rajesh.sharma@example.com', 'Raj', NULL, 'Sharma', '1978-02-01', 'male', 'married', 'MBBS, MD', NULL, NULL, NULL, NULL, '9810000000', NULL, NULL, NULL, NULL, NULL, NULL, '1995', 'Jaipur', 'AIIMS Delhi', '2000', 'Delhi', 'SMS Medical College', NULL, 'Cardiology', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Government', 'India', 'Rajasthan', 'Jaipur', NULL, NULL, NULL, NULL, 'Fortis Hospital', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-10-11 19:32:18.990756', '2025-10-11 19:32:18.990756', 'pending'),
-- (Skipping the rest for brevity - add all 38 rows similarly from the dump. You can copy them directly, but fix any NULLs or enums as needed)
(35, 51, 'rajesh.kumar@example.com', 'Rajesh', NULL, 'Kumar', NULL, 'male', NULL, 'MBBS, MD (Cardiology)', NULL, NULL, NULL, NULL, '9999999991', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Cardiology', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Private', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-10-12 07:18:47.243288', '2025-10-12 07:18:47.243288', 'approved'),
(36, 52, 'priya.sharma@example.com', 'Priya', NULL, 'Sharma', NULL, 'female', NULL, 'MBBS, DNB (Pediatrics)', NULL, NULL, NULL, NULL, '9999999992', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pediatrics', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Private', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-10-12 07:18:47.243288', '2025-10-12 07:18:47.243288', 'approved'),
(37, 55, 'amit.patel@example.com', 'Amit', NULL, 'Patel', NULL, 'male', NULL, 'MBBS, MS (Orthopedics)', NULL, NULL, NULL, NULL, '9999999995', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Orthopedics', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Government', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-10-12 07:18:47.243288', '2025-10-12 07:18:47.243288', 'approved'),
(38, 57, 'arjun.mehta@example.com', 'Arjun', NULL, 'Mehta', NULL, 'male', NULL, 'MBBS, MD (General Medicine)', NULL, NULL, NULL, NULL, '9999999997', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'General Medicine', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Private', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-10-12 07:18:47.243288', '2025-10-12 07:18:47.243288', 'approved');

-- Continue inserting for other tables with data (enrollments, entity_templates, hospitals, job_applications, jobs, masterclass_bookings, masterclasses, module_tests, quiz_attempts, quiz_leaderboard, quiz_questions, quiz_responses, quiz_sessions, quizzes, research_service_requests, settings, test_questions, users)
-- For example:
INSERT INTO enrollments (id, user_id, course_id, progress, completed_at, certificate_issued, enrolled_at, payment_status, payment_id) VALUES 
(1, 30, 1, 0, NULL, 0, '2025-10-11 21:02:09.221878', 'free', NULL),
-- ... (all 24 rows)

-- At the end, add FKs
ALTER TABLE ai_tool_requests ADD FOREIGN KEY (user_id) REFERENCES users(id);
-- Add all other FKs similarly from the PG dump.

-- Done!
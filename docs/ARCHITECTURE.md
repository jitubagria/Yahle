# DocsUniverse / Yahle Portal Architecture Map

## 1. Core Backend

### Authentication & User Management
- **Purpose**: Handles user registration, login, and profile management for medical professionals
- **Key Tables**: 
  - `users` - Core user accounts
  - `doctor_profiles` - Extended doctor profile information
  - `contacts` - User contacts and relationships
- **Auth Flow**: JWT-based authentication with OTP verification via BigTos WhatsApp API
- **Main Routes**:
  ```
  POST /api/auth/register
  POST /api/auth/login
  POST /api/auth/verify-otp
  GET /api/profile
  PATCH /api/profile
  ```

### Database Structure
- MySQL database using Drizzle ORM
- Foreign key constraints and relationships properly defined
- Tables organized by feature modules

### External Services Integration
- **BigTos WhatsApp API**: Used for:
  - OTP delivery
  - Course enrollment notifications
  - Quiz completion certificates
  - Masterclass booking confirmations
  - Medical voice updates
- **Object Storage**: Google Cloud Storage for file handling

## 2. Feature Modules

### Medical Voices Platform
- **Purpose**: Platform for doctors to raise medical issues and gather support
- **Tables**:
  - `medical_voices` - Main voice/issue entries
  - `medical_voice_supporters` - Supporters/signatories
  - `medical_voice_updates` - Status updates
  - `medical_voice_contacts` - Contact information
  - `medical_voice_gatherings` - Physical meetings
- **Key Routes**:
  ```
  GET /api/medical-voices
  POST /api/medical-voices
  POST /api/medical-voices/:id/support
  POST /api/medical-voices/:id/updates
  ```
- **Relations**: medical_voices ← medical_voice_supporters ← users

### Courses & Learning
- **Purpose**: Medical education and training platform
- **Tables**:
  - `courses` - Course information
  - `course_modules` - Course content structure
  - `enrollments` - User course enrollments
  - `course_progress` - Module completion tracking
  - `course_certificates` - Completion certificates
- **Key Routes**:
  ```
  GET /api/courses
  POST /api/courses/:id/enroll
  GET /api/courses/:id/progress
  POST /api/courses/:id/modules/:moduleId/complete
  ```

### Quiz System
- **Tables**:
  - `quizzes` - Quiz definitions
  - `quiz_questions` - Question bank
  - `quiz_sessions` - Active quiz attempts
  - `quiz_responses` - User answers
  - `quiz_leaderboard` - Performance tracking
- **Features**:
  - Timed quiz sessions
  - Automatic grading
  - Certificate generation
  - Leaderboards

### Medical Jobs Platform
- **Tables**:
  - `jobs` - Job listings
  - `job_applications` - Applications
  - `hospitals` - Hospital/institution directory
- **Relations**: 
  - jobs ← job_applications ← users
  - hospitals ← jobs

### Masterclasses
- **Purpose**: Live professional development sessions
- **Tables**:
  - `masterclasses` - Session details
  - `masterclass_bookings` - Registrations
- **Features**:
  - WhatsApp notifications
  - Attendance tracking

### NPA Automation
- **Purpose**: Automates NPA certificate generation
- **Tables**:
  - `npa_templates` - Certificate templates
  - `npa_opt_ins` - User preferences
  - `npa_automation` - Automation logs

### AI Tools Integration
- **Purpose**: AI-powered assistance for medical professionals
- **Tables**:
  - `ai_tool_requests` - Usage tracking
  - `entity_templates` - Response templates
- **Features**:
  - Research assistance
  - Document analysis
  - Medical case processing

## 3. Database Relationships

### Core User Relations
```
users
  ↓
  ├── doctor_profiles (1:1)
  ├── enrollments (1:N)
  ├── job_applications (1:N)
  ├── medical_voice_supporters (1:N)
  ├── masterclass_bookings (1:N)
  └── npa_opt_ins (1:1)
```

### Course Relations
```
courses
  ↓
  ├── course_modules (1:N)
  ├── enrollments (1:N)
  ├── course_progress (1:N)
  └── course_certificates (1:N)
```

### Medical Voices Relations
```
medical_voices
  ↓
  ├── medical_voice_supporters (1:N)
  ├── medical_voice_updates (1:N)
  ├── medical_voice_contacts (1:N)
  └── medical_voice_gatherings (1:N)
```

## 4. Frontend Pages

### Authentication & Profile
- `/login` - Login/registration page
- `/profile` - User profile management
- `/profile/edit` - Profile editing
- `/dashboard` - User dashboard

### Medical Voices
- `/medical-voices` - Voice listing
- `/medical-voices/new` - Create voice
- `/medical-voices/:id` - Voice details
- `/medical-voices/:id/updates` - Voice updates

### Learning Platform
- `/courses` - Course catalog
- `/courses/:id` - Course details
- `/courses/:id/modules/:moduleId` - Module content
- `/quizzes` - Quiz listing
- `/quizzes/:id` - Quiz taking interface

### Jobs & Careers
- `/jobs` - Job listings
- `/jobs/post` - Post new job
- `/jobs/:id` - Job details
- `/hospitals` - Hospital directory

### Professional Development
- `/masterclasses` - Upcoming sessions
- `/masterclasses/:id` - Session details
- `/certificates` - User certificates

## 5. Next Steps

### Security & Performance
1. Implement rate limiting for API endpoints
2. Add request validation middleware
3. Set up error monitoring (Sentry)
4. Optimize database queries with proper indexing

### Feature Completion
1. Complete mobile-responsive UI
2. Implement real-time notifications
3. Add bulk operations for medical voices
4. Enhance quiz system with practice mode

### Administrative Tools
1. Build admin dashboard for content management
2. Add analytics for user engagement
3. Implement moderation tools for medical voices
4. Create reporting system for abuse

### Integration & Scaling
1. Set up caching layer (Redis)
2. Implement WebSocket for real-time features
3. Add backup and recovery procedures
4. Set up CI/CD pipelines

### Documentation & Testing
1. Complete API documentation
2. Add integration tests
3. Set up automated testing
4. Create user guides and help center

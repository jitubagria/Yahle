# Courses Module

**Purpose:**
Medical education and training platform for doctors and professionals.

**Key Tables:**
- courses
- course_modules
- enrollments
- course_progress
- course_certificates

**Key Routes:**
- GET /api/courses
- POST /api/courses/:id/enroll
- GET /api/courses/:id/progress
- POST /api/courses/:id/modules/:moduleId/complete

**Dependencies:**
- Drizzle ORM
- JWT

**Next Tasks:**
- Add course reviews and ratings
- Add certificate download endpoint
- Add admin course management

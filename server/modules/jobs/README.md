# Jobs Module

**Purpose:**
Medical job board for posting and applying to jobs in the healthcare sector.

**Key Tables:**
- jobs
- job_applications
- hospitals

**Key Routes:**
- GET /api/jobs
- POST /api/jobs
- POST /api/jobs/:id/apply
- GET /api/hospitals

**Dependencies:**
- Drizzle ORM
- JWT

**Next Tasks:**
- Add job approval workflow
- Add job application status tracking
- Add admin job management

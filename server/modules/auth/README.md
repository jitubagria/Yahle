# Auth Module

**Purpose:**
Handles user authentication, registration, login, OTP verification, and JWT token management.

**Key Tables:**
- users
- doctor_profiles
- contacts

**Key Routes:**
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/send-otp
- POST /api/auth/verify-otp
- GET /api/profile
- PATCH /api/profile

**Dependencies:**
- JWT
- BigTos WhatsApp API
- Drizzle ORM

**Next Tasks:**
- Add password reset endpoints
- Add admin user management
- Improve error handling and validation

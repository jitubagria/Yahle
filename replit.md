# DocsUniverse - Medical Professional Platform

## Overview

DocsUniverse is a comprehensive web platform designed for medical professionals and students in India. It serves as a central hub offering doctor directories, educational courses, quizzes, job listings, AI-powered tools, research services, and masterclass bookings. The platform facilitates professional networking, continuous learning, and career advancement for the medical community.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query (React Query)** for server state management, caching, and data fetching

**UI Component System**
- **Shadcn/UI** component library based on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Material Design principles** adapted for healthcare UX
- Custom color palette optimized for medical professionals (primary blue: trust/professionalism)
- Typography using Inter font family for readability and JetBrains Mono for data display

**State & Form Management**
- React Hook Form with Zod validation for type-safe form handling
- Session storage for simple authentication state persistence
- No complex global state management - relies on React Query for server state

**Key Features**
- OTP-based phone authentication flow
- Doctor profile management with image cropping (react-easy-crop)
- Search and filtering across multiple entities (doctors, jobs, courses)
- Responsive design with mobile-first approach

### Backend Architecture

**Runtime & Framework**
- **Node.js** with **Express.js** for the REST API server
- **TypeScript** throughout for type safety across frontend and backend
- ESM modules for modern JavaScript patterns

**API Design**
- RESTful endpoints organized by domain (`/api/auth`, `/api/doctors`, `/api/courses`, etc.)
- Middleware for request logging and error handling
- Simple OTP verification without external SMS service (development mode returns OTP in response)

**Authentication & Authorization**
- **Phone-based OTP authentication** via WhatsApp (BigTos API)
- **Development Mode**: Fixed OTP `123456` for testing (no API key required)
- **Production Mode**: Random 6-digit OTP sent via WhatsApp
- **Session Management**: express-session with HttpOnly secure cookies
- **Session Storage**: In-memory store for development (MemoryStore), upgradeable to Redis/PostgreSQL for production
- **User Roles**: admin, doctor, student, service_provider
- **Protected Routes**: requireAuth middleware validates server-side sessions
- **Security**: No client-side ID spoofing, session-based user verification

**Database Layer**
- **Drizzle ORM** for type-safe database operations
- **Neon Serverless Postgres** as the database provider with WebSocket support
- Schema-first approach with relations defined in code
- Migration system using drizzle-kit

**Data Models**
- **Users** with role-based access and OTP verification
- **Doctor Profiles** (50+ fields: general, contact, academic, professional data)
- **Courses** with enrollment tracking
- **Quizzes** with timed attempts, scoring, and certificate notifications
- **Jobs** with application tracking
- **Masterclasses** with booking system
- **Research Service Requests** with status tracking
- **AI Tool Requests** for medical AI features
- **Hospital Directory**
- **BigTos Messages Log** - tracks all WhatsApp notifications sent

### Storage Architecture

**Object Storage**
- **Google Cloud Storage** integration via Replit Object Storage sidecar
- ACL-based permission system for file access control (owner, public/private visibility, group rules)
- Support for profile pictures with multiple sizes (profile_pic, thumbl, thumbs, thumbimage)
- Image upload with client-side cropping before storage

**File Upload Flow**
- Client crops image to multiple sizes
- Uploads to GCS via object storage service
- Stores URLs in database profile fields

### External Dependencies

**Third-Party Services**
- **Neon Database** - Serverless Postgres hosting with WebSocket support
- **Google Cloud Storage** - Object storage via Replit sidecar authentication
- **Replit Object Storage** - Sidecar service for GCS credential management
- **BigTos WhatsApp API** - WhatsApp Business API for OTP delivery and notifications
  - OTP delivery for login authentication
  - Course enrollment confirmations
  - Quiz completion certificates
  - Masterclass booking confirmations
  - Research service status updates

**Key NPM Packages**
- `@neondatabase/serverless` - Neon Postgres client with WebSocket support
- `@google-cloud/storage` - GCS SDK for file storage
- `drizzle-orm` & `drizzle-kit` - Type-safe ORM and migration tools
- `@tanstack/react-query` - Data fetching and caching
- `@radix-ui/*` - Headless UI component primitives
- `react-hook-form` & `@hookform/resolvers` - Form handling with Zod validation
- `wouter` - Lightweight routing
- `ws` - WebSocket library for Neon connection
- `express-session` - Server-side session management
- `memorystore` - In-memory session store for development

**Development Tools**
- `tsx` - TypeScript execution for development
- `esbuild` - Fast bundler for production builds
- `tailwindcss` & `autoprefixer` - Styling utilities

**Design System**
- Custom Tailwind configuration with medical-focused color palette
- HSL color system for light/dark mode support
- Shadcn component variants (New York style)
- Custom border radius and shadow tokens for Material Design feel

## Development Setup

### Environment Variables

**Required for Production:**
- `BIGTOS_API_KEY` - WhatsApp API key from BigTos dashboard
- `SESSION_SECRET` - Secret key for session encryption
- `DATABASE_URL` - PostgreSQL connection string (auto-configured on Replit)

**Development Mode:**
- Fixed OTP: `123456` (no BIGTOS_API_KEY needed)
- WhatsApp messages logged to console and database (not sent)
- Session secret defaults to 'dev-secret-change-in-production'

### Testing Login Flow

1. Navigate to `/login`
2. Enter any 10-digit phone number (e.g., `9999999999`)
3. Click "Send OTP"
4. Enter OTP: `123456`
5. Click "Verify OTP"
6. Authenticated! Session established with secure HttpOnly cookie

### WhatsApp Notifications

The platform sends WhatsApp notifications for:
- **OTP Delivery** - Login verification codes
- **Course Enrollments** - Confirmation when user enrolls
- **Quiz Completion** - Certificate and score notification
- **Masterclass Bookings** - Booking confirmation with schedule
- **Research Updates** - Status changes on research requests

All notifications are logged in `bigtos_messages` table with delivery status.

## Recent Changes (Latest)

### Dashboard System & CRM Foundation (Completed - October 11, 2025)
- ✅ **User Dashboard** (`/dashboard`) with personalized overview widgets:
  - Profile completeness tracker
  - Enrolled courses summary with progress
  - Quiz performance and leaderboard rank
  - Active research service requests
  - Certificates earned counter
  - Quick navigation to all user sections
- ✅ **Admin Dashboard** (`/admin`) - Comprehensive CRM foundation:
  - Real-time analytics overview (users, courses, enrollments, revenue)
  - Navigation to 12 management modules (all routes functional with stub pages)
  - Module grid with color-coded icons and descriptions
- ✅ **Role-Based Access Control (RBAC)**:
  - `requireAdmin` middleware for server-side admin verification (returns 403 for non-admins)
  - All `/api/admin/*` endpoints protected with admin role check
  - Client-side role validation with redirect for unauthorized access
  - Session-based authentication using HttpOnly cookies
- ✅ **Admin Module Structure** (stub pages ready for implementation):
  1. Doctors Directory Management
  2. Hospitals Directory Management
  3. Courses & Learning Management
  4. Quizzes Management
  5. Masterclasses Management
  6. Jobs Board Management
  7. AI Tools Management
  8. Research & Services Management
  9. Users & CRM Panel
  10. Manual Messaging Panel
  11. Payments & Reports
  12. Settings
- ✅ SPA-friendly navigation using wouter Link components throughout

### WhatsApp Integration & Authentication (Completed)
- ✅ BigTos WhatsApp API integration with development mode
- ✅ Server-side session authentication with express-session
- ✅ HttpOnly secure cookies (XSS prevention)
- ✅ Protected notification endpoints with requireAuth middleware
- ✅ Fixed OTP input field issues (type="text", autocomplete="off")
- ✅ Form isolation with React keys to prevent state bleeding
- ✅ Comprehensive message logging and error handling
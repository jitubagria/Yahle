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
- Phone-based OTP authentication stored in user records
- Session-based auth using session storage on client
- User roles: admin, doctor, student, service_provider
- Authentication helper functions (`getAuthenticatedUserId`) for protected routes

**Database Layer**
- **Drizzle ORM** for type-safe database operations
- **Neon Serverless Postgres** as the database provider with WebSocket support
- Schema-first approach with relations defined in code
- Migration system using drizzle-kit

**Data Models**
- Users with role-based access
- Comprehensive doctor profiles (50+ fields covering general, contact, academic, professional data)
- Courses, quizzes, jobs, masterclasses, research service requests
- Application/booking/attempt tracking tables
- Hospital directory

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

**Key NPM Packages**
- `@neondatabase/serverless` - Neon Postgres client with WebSocket support
- `@google-cloud/storage` - GCS SDK for file storage
- `drizzle-orm` & `drizzle-kit` - Type-safe ORM and migration tools
- `@tanstack/react-query` - Data fetching and caching
- `@radix-ui/*` - Headless UI component primitives
- `react-hook-form` & `@hookform/resolvers` - Form handling with Zod validation
- `wouter` - Lightweight routing
- `ws` - WebSocket library for Neon connection

**Development Tools**
- `tsx` - TypeScript execution for development
- `esbuild` - Fast bundler for production builds
- `tailwindcss` & `autoprefixer` - Styling utilities

**Design System**
- Custom Tailwind configuration with medical-focused color palette
- HSL color system for light/dark mode support
- Shadcn component variants (New York style)
- Custom border radius and shadow tokens for Material Design feel
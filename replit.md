# DocsUniverse - Medical Professional Platform

## Overview

DocsUniverse is a comprehensive web platform for medical professionals and students in India. It aims to be a central hub for professional networking, continuous learning, and career advancement. Key capabilities include doctor directories, educational courses, quizzes, job listings, AI-powered tools, research services, and masterclass bookings. The platform's business vision is to empower the medical community through integrated digital services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend is built with **React 18** and **TypeScript**, utilizing **Vite** for development and bundling. **Wouter** handles client-side routing, and **TanStack Query (React Query)** manages server state, caching, and data fetching. The UI is constructed with **Shadcn/UI** components, styled using **Tailwind CSS** with a custom design system based on Material Design principles, an optimized color palette (primary blue), and Inter/JetBrains Mono fonts. Form handling uses **React Hook Form** with **Zod** validation. Key features include OTP-based phone authentication, doctor profile management with image cropping, search and filtering, and a responsive, mobile-first design.

### Backend

The backend uses **Node.js** with **Express.js** and **TypeScript** for a REST API server, following ESM modules. API endpoints are RESTful and organized by domain. Authentication is phone-based OTP via WhatsApp (BigTos API), with session management using `express-session` and HttpOnly cookies. User roles (admin, doctor, student, service_provider) provide role-based access control. The database layer uses **Drizzle ORM** with **Neon Serverless Postgres**, implementing a schema-first approach and `drizzle-kit` for migrations. Data models cover users, doctor profiles, courses, quizzes, jobs, masterclasses, research service requests, AI tool requests, hospital directories, and WhatsApp message logs.

### Storage

**Google Cloud Storage** is integrated via the Replit Object Storage sidecar for object storage. It uses an ACL-based permission system and supports various image sizes for profile pictures. The file upload flow involves client-side image cropping before uploading to GCS, with URLs stored in the database.

### Core Features & Design Decisions

- **Authentication**: Phone-based OTP (WhatsApp) with session management and secure HttpOnly cookies.
- **User Management**: Role-based access control (RBAC) with distinct roles and protected routes.
- **Course & Module Management**: Full CRUD operations for courses and modules, including content type indicators, ordering, and preview options.
- **Quiz System**: Real-time quiz system with WebSocket support for live participation, leaderboards, and countdown timers. Production-ready API for quiz CRUD, join/submit, and ranking.
- **Certificate & Notification System**: Dynamic certificate generation using Jimp with customizable templates, automatic WhatsApp delivery, and triggers for course completion, quiz completion, and masterclass bookings.
- **Admin Dashboards**: Comprehensive admin panels for managing doctors, hospitals, courses, quizzes, jobs, AI tools, research services, users, messaging, payments, settings, and certificates. All 12 admin management pages implemented with full CRUD interfaces, protected by `requireAdmin` middleware.
- **Job Posting System**: Authenticated users can post job openings with full form validation using React Hook Form + Zod. Features include job type selection, location details, salary range, experience requirements, and detailed descriptions. Authentication-gated with proper client-side validation.
- **Dashboard System**: Personalized user dashboards with progress tracking, enrolled courses, quiz performance, research requests, and earned certificates.
- **WhatsApp Integration**: Extensive use of BigTos API for OTP delivery, course enrollments, quiz completion certificates, masterclass bookings, and research service updates, with comprehensive logging.
- **UI/UX**: Custom design system built on Material Design principles, optimized for healthcare professionals, with clear typography and a focus on readability and professionalism.

## External Dependencies

-   **Neon Database**: Serverless PostgreSQL database hosting.
-   **Google Cloud Storage**: Object storage for files and images.
-   **Replit Object Storage**: Sidecar service for Google Cloud Storage credential management.
-   **BigTos WhatsApp API**: Used for OTP delivery, course enrollment confirmations, quiz completion certificates, masterclass booking confirmations, and research service status updates via WhatsApp Business API.
-   **NPM Packages**:
    -   `@neondatabase/serverless`: Neon Postgres client.
    -   `@google-cloud/storage`: GCS SDK.
    -   `drizzle-orm`, `drizzle-kit`: Type-safe ORM and migration tools.
    -   `@tanstack/react-query`: Data fetching and caching.
    -   `@radix-ui/*`: Headless UI component primitives.
    -   `react-hook-form`, `@hookform/resolvers`: Form handling with Zod validation.
    -   `wouter`: Lightweight routing.
    -   `ws`: WebSocket library.
    -   `express-session`, `memorystore`: Server-side session management.
    -   `jimp`: Image manipulation for certificate generation.
-   **Development Tools**: `tsx`, `esbuild`, `tailwindcss`, `autoprefixer`.
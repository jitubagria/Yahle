# DocsUniverse / Yahle — Project Flow

This document is a structured visual map of the Yahle backend (DocsUniverse flavor). It describes the repository layout, module responsibilities, the runtime request/data flow, scheduled jobs, testing and CI, and recommended next steps. Place this under `/docs/Project_Flow.md` as a living architecture appendix.

## Project at a glance

- Stack: Node.js + TypeScript + Express + Drizzle ORM (MySQL)
- Test: Jest + ts-jest + Supertest
- Logger: pino (server/lib/logger.ts) + small compatibility shim (server/utils/logger.ts)
- Auth: JWT-based (server/middleware/auth.ts, server/utils/jwt.ts)
- External integrations: Bigtos (WhatsApp OTP), object storage/service modules, mail/notification services

---

## Root folder (top-level view)

- / (repo root)
  - `server/` — backend app code (Express app factory, routes, modules, middleware, services)
  - `client/` — front-end (Vite/React) with a small client-side logger wrapper at `client/src/lib/logger.ts`
  - `drizzle/` — Drizzle schema (`drizzle/schema.ts`) and DB-related config
  - `test/` — Jest test suites and `jest.setup.ts`
  - `docs/` — architecture and docs (this file)
  - `package.json`, `tsconfig.json`, `jest.config.cjs`, CI workflow in `.github/workflows/`

## server/ (detailed)

- `server/app.ts` — app factory (createApp) used by tests and the real server
- `server/index.ts` — server entry (HTTP listener)
- `server/routes.ts` — main route registration (lazy mounts to avoid cycles)
- `server/routes_clean.ts` / `server/routes_clean_router.ts` — test-friendly, minimal mounting used by tests
- `server/lib/` — utilities like `logger.ts`, `env.ts`, `bigtosService.ts`
- `server/utils/` — compatibility shim for logger (`utils/logger.ts`), JWT helpers when necessary
- `server/middleware/` — small middleware primitives (auth, validate, pagination, respond, refreshJwt)
- `server/modules/` — feature modules (each typically exports an Express Router)
  - `auth/`, `courses/`, `jobs/`, `quizzes/`, `research/`, `npa-automation/`, `courseModules/`, `enrollments/`, `jobApplications/`, etc.
- `server/core/` — shared helpers (dbHelpers, small core utilities)
- `server/services/` — higher-level business logic and 3rd-party integrations (certificates, storage, bigtos)
- `server/types/` — runtime/shared TypeScript types (if present)

---

## Modules overview (what's implemented now)

- Auth (`server/modules/auth`) — mobile-friendly JWT authentication, OTP flows via Bigtos (WhatsApp), token generation for tests.
- Courses (`server/modules/courses`) — course listing and details (GET endpoints), CRUD moved from older controllers.
- Jobs (`server/modules/jobs`) — create/list job posts; POST returns created ID used by tests.
- Quizzes (`server/modules/quizzes`) — quiz lifecycle, questions, attempts
- Research (`server/modules/research`) — submit and manage research requests
- NPA Automation (`server/modules/npa-automation`) — scheduled PDF generation, delivery via email/WhatsApp
- Phase 5 additions:
  - Course Modules (`server/modules/courseModules`) — modules/lessons for a course
  - Enrollments (`server/modules/enrollments`) — course enrollment records and progress tracking
  - Job Applications (`server/modules/jobApplications`) — apply to job postings

Each module typically provides an Express Router exported as `default` and is mounted lazily from `server/routes.ts`.

---

## Routes (logical mapping)

Top-level endpoints (mounted under `/api`):

- `/health` — simple health check (always present)
- `/api/auth` — authentication and OTP endpoints (login, refresh, verify)
- `/api/quizzes` — quiz endpoints (list, details, start, submit)
- `/api/research` — research request endpoints
- `/api/npa-automation` — NPA PDF generation endpoints
- `/api/course-modules` — course modules (protected by `verifyToken`)
- `/api/enrollments` — enrollments (protected by `verifyToken`)
- `/api/job-applications` — job applications (protected by `verifyToken`)
- `/api/courses` — courses listing/detail (lightweight stubs or module)
- `/api/jobs` — jobs listing and creation

Note: Routes are mounted using lazy `require()` calls inside `server/routes.ts` to avoid circular imports with the logger or other shared modules. Each mount is wrapped in try/catch and logs success/fail via `logger.debug`/`logger.error`.

---

## Request -> Route -> DB flow (visual)

- Incoming HTTP Request
  - Express receives request in `server/app.ts`
  - Global middleware chain runs (parsing middleware, small body-fix middleware in `server/routes.ts`)
  - Route resolved by Express (e.g. `POST /api/enrollments`)
    - Optional middlewares run (e.g. `verifyToken` from `server/middleware/auth.ts`, `validate`)
    - Module router handler invoked (`server/modules/enrollments/routes.ts`)
      - Handler does lightweight validation, constructs the payload
      - Calls controller/service or `server/core/dbHelpers.ts` helpers (e.g. `insertAndFetch`, `updateAndReturn`)
        - DB helpers use Drizzle query functions and the schema in `drizzle/schema.ts`
        - Drizzle composes SQL; results returned as JS objects
      - Handler transforms DB result into API response shape
      - Handler uses `logger` (lazy-resolved) for structured logs and `res.status(...).json(...)` for response
  - Response serialized to JSON and sent to the client

Example flow (concise):

Request -> middleware (auth, parse) -> /api/course-modules router -> handler -> `dbHelpers.insertAndFetch()` -> Drizzle -> MySQL -> returned row -> handler maps to DTO -> Response JSON

---

## Drizzle schema (high level)

Located at: `drizzle/schema.ts` — canonical model of DB tables. Key tables and relationships:

- `users` (id, phone, email, role, isVerified)
- `courses` (id, title, description, instructor, price, enrollment_count)
- `course_modules` (id, course_id, title, content_type, order_no, duration)
- `enrollments` (id, user_id, course_id, progress, payment_status)
- `course_certificates` / `certificates` (certificate records, mapping to courses/quizzes/masterclasses)
- `jobs` (id, title, hospital_id, posted_by, isActive)
- `job_applications` (id, job_id, user_id, cover_letter, status)
- `quizzes`, `quiz_questions`, `quiz_attempts`, `quiz_responses`, `quiz_leaderboard`
- `npa_automation`, `npa_opt_ins`, `npa_templates` (for scheduled NPA PDF generation)
- `bigtos_messages`, `otps` (for OTP and WhatsApp messaging)

Relationships (guideline):
- users 1↔* enrollments (userId)
- courses 1↔* course_modules (courseId)
- courses 1↔* enrollments (courseId)
- jobs 1↔* job_applications (jobId)
- quizzes 1↔* quiz_questions and 1↔* quiz_attempts

Drizzle tables include unique indexes (e.g. `users.phone`) and enums for constrained columns.

---

## Middleware & Logger

- Logger:
  - `server/lib/logger.ts` — main structured pino logger for production and app use
  - `server/utils/logger.ts` — a compatibility shim that exposes `logger` for both CommonJS `require()` and ES `import` consumers; used during migration and to prevent runtime shape errors
  - Pattern: modules use lazy `require('./lib/logger').default` or normalize the require result to get a `.info/.warn/.error` API

- Middleware (common used):
  - `verifyToken` (`server/middleware/auth.ts`) — checks Authorization header for `Bearer <token>` and verifies JWT
  - `validate` — request validation helper (schema-based)
  - `pagination` — parse page/limit query params
  - `respond` — consistent response formatting helper
  - `refreshJwt` — refresh token support

---

## Scheduled jobs (NPA Scheduler & background tasks)

- Files: `server/npaScheduler.ts`, `server/npaService.ts`, `server/modules/npa-automation/` + `drizzle` tables
- Purpose: generate monthly NPA PDFs from templates, store artifacts, and send them via WhatsApp/email. The scheduler runs periodically (cron-like) and enqueues jobs which use `server/services/*` to build PDFs and persist status in `npa_automation` table.
- Monitoring: jobs update DB rows with status and lastError — check `npa_automation` rows for operational status.

---

## Testing and CI

- Tests:
  - `test/` contains unit/integration tests using Jest and Supertest.
  - `test/jest.setup.ts` configures the test environment (silencing some logger output and test helpers).
  - `test/modules/*` contain integration tests for newly added Phase 5 modules (courseModules, enrollments, jobApplications).
  - Pattern: `createApp()` from `server/app.ts` is used to mount routers (or `routes_clean` during tests) and drive API requests.

- CI:
  - GitHub Actions workflow at `.github/workflows/test.yml` runs `npx tsc --noEmit` and `npm test` (ts-jest), and clears jest cache where necessary.
  - Key checks in CI: TypeScript compile, Jest test matrix. Workflow reports pass/fail.

Notes from recent runs:
- `npx tsc --noEmit` is clean (no TS errors after the Phase 5 changes).
- Jest runs had intermittent failures tied to logger export shape mismatches and duplicate-insert behavior; fixes included a compatibility logger shim and some test tolerance for duplicate responses.

---

## External integrations

- Bigtos (WhatsApp / OTP): `server/lib/bigtosService.ts` and `bigtos_messages` table. Used for OTP flows and sending messages/images.
- Object storage / certificate generation: services for generating certificate PDFs and storing URLs (`server/services/certificates.ts`, `entity_templates`, `course_certificates` tables)
- JWT: standard `jsonwebtoken` used for signing and verification; `server/utils/jwt.ts` contains helpers.

---

## Pending cleanup / optimization (short list)

1. Final grep for `console.` occurrences and remove any stray console usage (except intentional test output).
2. Complete `server/routes_clean.ts` mounts to ensure test router mirrors production router and avoid 404s in CI tests.
3. Tighten duplicate-check logic (server-side constraints or application checks) so tests can assert deterministic status codes (400 vs 201).
4. Add DB migration scripts (if not present) and document local dev DB boot steps.
5. Add Dockerfile + Docker Compose for local dev and CI reproducibility.
6. Add structured log aggregation config (e.g., pino to JSON → Logstash/Cloud) and include request IDs in logs.
7. Harden JWT token rotation and refresh flows (tests use a test-secret fallback today).
8. Expand CI to include linting, type-checking on changed files, and build artifact publishing.

---

## Recommended next actions (prioritized)

1. Run the full test suite in CI or locally and fix any remaining flaky tests. Command to run locally:

```powershell
npx jest --clearCache
npx tsc --noEmit
npm test -- --runInBand --detectOpenHandles
```

2. Run a repo-wide grep for `console.` and fix or document intentional usages:

```powershell
grep -Rn "console\." . || Select-String -Path "**/*" -Pattern "console\."
```

3. Finalize `server/routes_clean.ts` so tests use the same mount paths as production (prevent 404 surprises in CI).
4. Add DB migration / seed tooling (use `drizzle-kit` or a migration process) and document the dev DB setup in `/docs/DEVELOPER_SETUP.md`.
5. Add simple Docker & Compose config for local dev and CI test environments.
6. Harden logger exports: remove temporary compatibility shims once all modules consistently use `server/lib/logger.ts` import shape.
7. Consider adding a minimal Post-deploy health endpoint and Prometheus-friendly metrics for scheduled job success/failure counts.

---

## Appendix: Quick diagram (text form)

- Client (web / mobile)
  -> HTTP(S) request
    -> `server/app.ts` (Express)
      -> Global middleware (parse, cors, request id)
      -> `server/routes.ts` (lazy mounts)
        -> `server/middleware/*` (verifyToken, validate, pagination)
        -> `server/modules/<feature>/routes.ts` (feature router)
          -> controller/service logic (server/services or inline)
            -> `server/core/dbHelpers.ts` (insertAndFetch, updateAndReturn, raw queries)
              -> Drizzle ORM (`drizzle/schema.ts`) -> MySQL DB
            <- DB result
          <- controller transforms result -> consistent response
        <- router responds with JSON
    <- HTTP response to client


---

End of Project Flow document — keep this file updated as routing, schema, or jobs change.

## Appendix B - Visual Architecture Map

Below is a compact visual map (markdown-friendly) summarizing folders, module dependencies, route flow, DB relationships, scheduler, and test/CI notes.

- 🧩 Root
  - 🧩 client/
  - 🧩 server/
    - 🧱 app.ts
    - 🌐 routes.ts (lazy mounts)
    - 🌐 routes_clean.ts (test mounts)
    - 🧩 lib/ (logger, bigtos)
    - 🧩 utils/ (compat shim, jwt helpers)
    - 🧱 middleware/ (auth, validate)
    - 🧩 modules/ (auth, courses, jobs, quizzes, research, npa-automation, courseModules, enrollments, jobApplications)
    - 🧩 core/ (dbHelpers)
    - ⏰ npaScheduler.ts
  - 🗄️ drizzle/ (schema.ts)

- Module dependency flow
  - client -> 🌐 route -> 🧱 middleware -> 🧩 module handler -> 🧩 core/dbHelpers -> 🗄️ Drizzle -> MySQL

- DB relationships (selected)
  - users 1 -> * enrollments
  - courses 1 -> * course_modules
  - jobs 1 -> * job_applications

- Scheduler & background
  - ⏰ npaScheduler -> npaService -> generate PDFs -> update npa_automation table

- Tests & CI
  - test/ (Jest + Supertest) uses routes_clean for predictable test mounts
  - .github/workflows/test.yml runs tsc + jest

---

Appendix B created. Keep this section in sync with `server/routes.ts` and `drizzle/schema.ts` as features evolve.

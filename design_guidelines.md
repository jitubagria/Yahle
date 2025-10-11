# DocsUniverse Design Guidelines

## Design Approach

**Selected Framework**: Material Design System with Healthcare Adaptations
- **Rationale**: Medical platform requiring professional credibility, efficient information display, and clear hierarchy for complex data structures
- **Key Principles**: Trust through clarity, information density with breathing room, role-based interface optimization, accessibility for medical professionals

## Core Design Elements

### A. Color Palette

**Primary Colors (Medical Professional Theme)**:
- Primary Blue: `210 100% 45%` - Trust, professionalism, medical associations
- Primary Dark: `210 100% 35%` - Headers, navigation, emphasis
- Primary Light: `210 100% 95%` - Backgrounds, subtle highlights

**Semantic Colors**:
- Success Green: `142 70% 45%` - Completed profiles, verified badges, positive actions
- Warning Amber: `38 92% 50%` - Pending items, incomplete profiles
- Error Red: `0 84% 60%` - Alerts, required fields
- Info Cyan: `200 95% 45%` - Tips, educational content markers

**Dark Mode** (maintain consistency):
- Background: `210 20% 12%`
- Surface: `210 15% 18%`
- Primary remains: `210 100% 55%` (adjusted for dark bg)

**Neutral Grays**:
- Text Primary: `210 10% 15%`
- Text Secondary: `210 8% 45%`
- Border Light: `210 15% 85%`
- Surface White: `0 0% 100%`

### B. Typography

**Font Families**:
- Primary: 'Inter' (Google Fonts) - Clean, professional, excellent readability for medical text
- Headings: 'Inter' 600/700 weights
- Data/Numbers: 'JetBrains Mono' for tabular data, statistics, medical IDs

**Type Scale**:
- Hero/H1: text-5xl (48px) font-bold
- H2 (Section): text-3xl (30px) font-semibold
- H3 (Cards): text-xl (20px) font-semibold
- Body: text-base (16px) font-normal
- Small/Meta: text-sm (14px) font-normal
- Captions: text-xs (12px) font-medium

### C. Layout System

**Spacing Primitives**: Use Tailwind units of `2, 4, 6, 8, 12, 16, 20`
- Micro spacing (form elements, badges): p-2, gap-2
- Standard spacing (cards, sections): p-6, p-8, gap-6
- Large spacing (page sections): p-12, p-16, py-20
- Extra large (hero sections): py-24

**Grid System**:
- Container: max-w-7xl mx-auto px-4
- Profile sections: 2-column (md:grid-cols-2)
- Directory listings: 3-column cards (lg:grid-cols-3)
- Data tables: Full-width responsive

### D. Component Library

**Navigation**:
- Sticky top navigation with role indicator badge
- Sidebar navigation for admin dashboard (collapsible on mobile)
- Breadcrumbs for deep navigation (Profile > Edit > Academic)
- Bottom tab bar for mobile role-switching

**Doctor Profile Components**:
- Profile header with large cropped image (200x200), name, professional degree, verification badge
- Tabbed sections: General, Contact, Academic, Job Details (Material Design tabs)
- Info cards with icon + label + value layout for each field group
- Edit mode with inline forms, field-by-field validation indicators
- Image cropper: Modal overlay with drag-to-position, pinch-zoom, aspect ratio lock (1:1), live preview of all three sizes

**Directory & Search**:
- Advanced filter panel (collapsible sidebar): specialty chips, location autocomplete, experience sliders
- Result cards: Avatar (120x120 thumb), name, specialty, location, experience years, quick-view CTA
- Map integration placeholder for hospital locations
- Pagination with page numbers and results count

**Courses & Quizzes**:
- Course cards: Featured image (16:9), title, instructor, duration, enrollment count, price tag
- Quiz interface: Progress bar (top), timer (corner), question card (centered), multi-choice buttons (A/B/C/D style)
- Leaderboard: Ranked list with position medals (1/2/3), avatar, name, score, time
- Certificate preview: Formal border, institutional header, recipient name (large), achievement details

**Jobs Board**:
- Job listing cards: Hospital logo placeholder, position title, location, salary range, posting date
- Advanced search: Multi-select filters (sector, state, experience), keyword search
- Application tracking: Status stepper (Applied > Reviewed > Shortlisted > Interview)

**AI Tools Suite**:
- Tool card grid with icon, name, description, "role-required" badge if restricted
- Tool interface: Left panel (inputs/form), right panel (AI results/output), loading states
- Clinical Note Generator: Template selector, form fields, generated note in medical format

**Admin Dashboard**:
- Metrics cards: Large number, trend indicator (↑↓), sparkline graph
- Data tables: Sortable columns, row actions dropdown, bulk select checkboxes
- User management: Avatar + details row, role badge, quick actions (verify, suspend)

**Forms & Inputs**:
- Material Design outlined inputs with floating labels
- Field grouping with subtle background cards
- Multi-step forms with progress indicator
- Inline validation (green check / red X with message)
- Phone input with country code selector
- Date picker for DOB, admission years

**Buttons & Actions**:
- Primary: Solid blue fill, white text, slight shadow
- Secondary: Outlined blue, blue text
- Text-only: Blue text, no border (for tertiary actions)
- FAB (Floating Action Button): Bottom-right corner for quick "Add Doctor/Course" actions
- Icon buttons: Circular, subtle hover background

**Modals & Overlays**:
- Image cropper: Full-screen dark overlay, white cropper card, tools at bottom
- Confirmation dialogs: Centered card, clear action buttons
- OTP verification: PIN-style input boxes (6-digit), auto-focus next

### E. Images

**Hero Sections**:
- Homepage: Large hero with medical professionals collaborating (diverse team), overlay gradient (210 100% 45% to transparent), centered headline "Empowering Medical Professionals", search bar overlay
- Doctor Directory: Subtle medical background (stethoscope, subtle blue tones), search-first interface

**Profile Images**:
- Doctor profiles: Professional headshot (square crop, 200x200 display)
- Thumbnails: 120x120 for cards, 48x48 for lists, 32x32 for chat/comments

**Content Images**:
- Course thumbnails: 16:9 ratio, medical education imagery
- Hospital images: Building exteriors, facility photos
- Placeholder illustrations: Medical icons for empty states (stethoscope, clipboard, microscope)

**Icon Strategy**:
- Heroicons (CDN) for all UI icons
- Custom medical icons via Font Awesome Medical subset
- Profile/specialty icons: Circular colored backgrounds with white icon

### F. Animations

**Minimal & Purposeful Only**:
- Page transitions: Simple fade (200ms)
- Card hover: Slight lift (translate-y-1) + shadow increase
- Form validation: Shake animation for errors (400ms)
- Loading states: Skeleton screens (pulse animation) for data loading
- NO complex scroll animations, NO unnecessary motion

## Role-Based Interface Adaptations

**Doctor View**: 
- Dashboard shows "Complete Your Profile" progress ring if incomplete
- Quick access to courses, quizzes, job applications
- Highlighted AI tools available to their role

**Student View**:
- Focus on educational content (courses, quizzes)
- Limited directory access (view-only)
- Gamified quiz leaderboards prominent

**Admin View**:
- Full control panel with metrics and data tables
- Bulk actions for user/content management
- Verification workflows for doctor profiles

**Service Provider View**:
- Request management interface
- Order tracking dashboard
- Communication tools for client interaction

## Accessibility & Responsive Behavior

- WCAG AA compliant color contrasts (4.5:1 minimum)
- Keyboard navigation with visible focus states (ring-2 ring-primary)
- Mobile-first responsive: Stack to single column < 768px
- Touch targets minimum 44x44px
- Screen reader labels on icon-only buttons
- Form labels always visible (no placeholder-only inputs)
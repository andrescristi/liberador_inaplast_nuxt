# INAPLAST Order Control - 4-Phase Agent Workflow

## PHASE 1: UX & PLANNING 🎯

### Agent 1: ux-researcher
**Task**: Create wireframes for 10 mobile screens with role-based access patterns

**Input**: Read `/process.md` sections 19-157 (screen specifications)

**Actions**:
1. Create wireframes for each screen in `/docs/01-ux-research/wireframes/`:
   - `01-login.png` - Authentication with role selection
   - `02-dashboard.png` - Filtered metrics by role  
   - `03-history.png` - Permission-based inspection lists
   - `04-inspection-report.png` - Access-controlled detail view
   - `05-form-step1.png` through `08-form-step4.png` - Multi-step form
   - `09-user-management.png` - Admin-only user list
   - `10-user-form.png` - Admin-only user creation/editing

2. Document role-specific UI patterns in `/docs/01-ux-research/interaction-patterns.md`:
   - Inspector: Limited data view, personal metrics only
   - Supervisor: Global view, approval actions enabled
   - Administrator: Full access, user management features

3. Create permission matrix in `/docs/01-ux-research/role-permissions.md`

**Output**: Save complete wireframe set and update `/.agent-artifacts/handoff-notes.md` with UX decisions

---

### Agent 2: sprint-prioritizer  
**Task**: Break down wireframes into implementable components with role controls

**Input**: Read outputs from `/docs/01-ux-research/` and `/process.md` sections 180-198

**Actions**:
1. Create detailed component breakdown in `/docs/02-planning/component-breakdown.md`:
   - Authentication components (LoginScreen, RoleGuard)
   - Dashboard components (MetricsCards with role filtering)
   - History components (SearchHeader, FilteredList)
   - Inspection components (ReportView, DefectIndicators)
   - Form components (MultiStepForm, ProgressIndicator)
   - Admin components (UserManagement, UserForm)
   - Shared components (BottomNavigation, StatusBadge, PermissionCheck)

2. Define implementation order in `/docs/02-planning/build-order.md`:
   - Phase priority: Auth → Shared → Dashboard → Forms → Admin
   - Dependencies between components
   - Testing strategy per component

3. Create role architecture in `/docs/02-planning/role-architecture.md`:
   - Permission system design
   - Data filtering strategies
   - Route protection patterns

**Output**: Complete component specifications and update `/.agent-artifacts/next-phase-requirements.md`

---

## PHASE 2: UI DESIGN 🎨

### Agent 3: ui-designer
**Task**: Design shadcn/ui components matching INAPLAST mobile mockup

**Input**: Read `/docs/01-ux-research/` and `/docs/02-planning/`, plus `/process.md` sections 200-274

**Actions**:
1. Create component specifications in `/docs/03-ui-design/component-specs.md`:
   - LoginScreen: Card layout with INAPLAST branding
   - DashboardHome: Grid system with role-filtered metrics
   - HistoryList: Command/ScrollArea with adaptive filters
   - InspectionReport: Card/Badge system with access controls
   - MultiStepForm: Card/Stepper with progress indicators
   - UserManagement: DataTable (Admin-only)
   - BottomNavigation: Tabs with role-adaptive icons (5-6 items)

2. Define INAPLAST color system in `/docs/03-ui-design/color-system.md`:
   - Primary: Blue (#4A90E2) for navigation
   - Success: Green (#4CAF50) for approvals
   - Error: Red (#F44336) for rejections
   - Role colors: Inspector (light blue), Supervisor (orange), Admin (purple)

3. Document responsive breakpoints and mobile-first approach

**Output**: Complete UI specifications and save to `/docs/03-ui-design/component-specs.md`

---

### Agent 4: whimsy-injector
**Task**: Add mobile-friendly animations and micro-interactions

**Input**: Read `/docs/03-ui-design/component-specs.md` and `/process.md` sections 275-285

**Actions**:
1. Design animations in `/docs/03-ui-design/animations.md`:
   - Screen transitions: Slide animations between form steps
   - Loading states: Skeleton screens for data fetching
   - Status changes: Color transitions for badge updates
   - Mobile gestures: Swipe navigation support
   - Feedback: Subtle vibrations for important actions

2. Define interaction states:
   - Loading, error, success states for all components
   - Progressive disclosure for role-based features
   - Touch-friendly target sizes (44px minimum)

**Output**: Complete animation specifications and update handoff notes

---

## PHASE 3: FRONTEND DEVELOPMENT 💻

### Agent 5: rapid-prototyper
**Task**: Initialize Nuxt.js project with required dependencies

**Input**: Read all `/docs/` outputs and `/process.md` sections 289-298

**Actions**:
1. Initialize Nuxt.js 3 with TypeScript in `/order-release-manager/app/`
2. Configure shadcn/ui with mobile-optimized theme
3. Install required packages:
   - `@nuxtjs/supabase` for authentication
   - `@vueuse/nuxt` for composables
   - `framer-motion` for animations
   - `@vee-validate/nuxt` for forms
   - `pinia` for state management

4. Setup project structure matching specifications
5. Create basic route structure for 10 screens

**Output**: Initialized project with dependencies and basic structure

---

### Agent 6: frontend-developer
**Task**: Implement all components with role-based access control

**Input**: Read all previous outputs and `/process.md` sections 299-354

**Actions**:
1. Create pages structure:
   - `pages/index.vue` - LoginScreen
   - `pages/dashboard.vue` - Role-filtered dashboard
   - `pages/history.vue` - Permission-based history
   - `pages/inspection/[id].vue` - Access-controlled reports
   - `pages/inspection/new/step-[number].vue` - Multi-step form
   - `pages/admin/users/` - Admin-only user management

2. Implement components with role controls:
   - Authentication middleware for route protection  
   - Permission composables for UI control
   - Role-aware data filtering in all components
   - Mobile-responsive layouts for all screens

3. Create stores for state management:
   - `stores/auth.ts` - User authentication and roles
   - `stores/orders.ts` - Role-filtered order data
   - `stores/users.ts` - User management (Admin only)

4. Implement bottom navigation with role-adaptive icons

**Output**: Complete frontend application with role-based access

---

## PHASE 4: BACKEND DEVELOPMENT 🔧

### Agent 7: backend-architect
**Task**: Implement API routes with Supabase integration and role-based security

**Input**: Read all outputs and `/process.md` sections 356-435

**Actions**:
1. Setup Supabase configuration:
   - User authentication with role assignment
   - Database schema for orders, inspections, users
   - Row Level Security policies for role-based access

2. Create API routes in `/server/api/`:
   - `auth/` - Login, logout, user session management
   - `dashboard/` - Role-filtered metrics and activity
   - `inspections/` - CRUD with permission checks
   - `users/` - Admin-only user management endpoints

3. Implement middleware:
   - Authentication verification
   - Role-based authorization
   - Request validation and sanitization

4. Create database structure with role permissions:
   - Users table with role column
   - Inspections table with inspector assignment
   - Orders table with access controls
   - Audit logging for admin actions

**Output**: Complete backend API with role-based security

---

### Agent 8: project-shipper
**Task**: Final validation, testing, and deployment preparation

**Input**: Read all outputs and `/process.md` sections 437-477

**Actions**:
1. Comprehensive testing:
   - Role-based access validation for all 10 screens
   - Multi-step form functionality with role checks
   - API endpoint security testing
   - Mobile responsiveness verification

2. Create test user accounts:
   - Inspector: Limited access test case
   - Supervisor: Approval workflow testing
   - Administrator: Full system access validation

3. Performance optimization:
   - Mobile device performance testing
   - API response time optimization
   - Image and asset optimization

4. Deploy to production:
   - Supabase database setup
   - Environment configuration
   - SSL certificate setup
   - Domain configuration

**Output**: Live application meeting all success criteria

---

## SUCCESS CRITERIA CHECKLIST ✅

- [ ] Inspector sees only personal inspections and metrics
- [ ] Supervisor views all data with approval/rejection capabilities
- [ ] Administrator has complete access plus user management
- [ ] All 10 screens replicate INAPLAST mockup design
- [ ] Multi-step forms work with role validation
- [ ] Bottom navigation adapts per user role (5-6 icons)
- [ ] Mobile-responsive on tablets and phones
- [ ] API endpoints secured with proper role checks
- [ ] Authentication system robust and secure
- [ ] Performance optimized for mobile devices

**Each agent must update `/.agent-artifacts/handoff-notes.md` with their decisions and requirements for the next phase.**
# Liberador Inaplast - Product Release Quality Control System

A modern web application for managing product release quality control workflows built with Nuxt.js, TailwindCSS, and Supabase.

## Features

### 🔐 Authentication & User Management
- **Secure Login System** - Email/password authentication via Supabase Auth
- **Password Reset** - Forgot password functionality with email verification
- **User Profiles** - Complete profile management with role-based access
- **Protected Routes** - All application routes require authentication
- **User Session Management** - Automatic login/logout handling
- **Conditional Navigation** - Navigation only displays when user is authenticated
- **Role-Based Access Control** - Three user roles: Admin, Supervisor, Inspector
- **User Administration** - Complete admin panel for user management (Admin only)
- **Activity Audit Trail** - Comprehensive logging of all user management actions

### 🏭 Product Release Management
- **Dashboard** - Overview of inspections, approvals, and rejections with Spanish localization
- **Nueva Liberación** - 4-step quality control workflow:
  - Step 1: Initial data (label image upload, box quantity)
  - Step 2: Product details (client, batch, order info, personnel, sampling levels)
  - Step 3: Quality tests (dimensions, resistance, appearance)
  - Step 4: Results summary and approval/rejection
- **Release Tracking** - View and manage release status and quality test results
- **Historial** - Complete release history with filtering and search capabilities
- **Order Management** - Full orders interface with SSR-compatible state management
- **Status Management** - Simplified order states: "Aceptado" (Accepted) and "Rechazado" (Rejected)

### 👥 Administrative Features
- **User Management Dashboard** - Complete CRUD operations for user accounts with real email display
- **User Creation & Editing** - Full user lifecycle management with secure server-side validation
- **Role Assignment** - Assign and modify user roles (Admin, Supervisor, Inspector)
- **Email Management** - Edit user emails with real-time validation and Supabase Auth integration
- **Password Reset System** - Admin-initiated password reset with secure email notifications
- **User Statistics** - Real-time metrics including user counts by role and activity
- **Inspector Activity Tracking** - Monitor inspector performance with 7-day activity reports
- **User Search & Filtering** - Advanced search and role-based filtering
- **Account Security** - Comprehensive password reset functionality and account management
- **Audit Logging** - Complete activity trail of all administrative actions
- **Permission Error Handling** - Graceful handling of access denied scenarios with clear user messaging
- **Security Protection** - Admin routes protected with intelligent error detection and user-friendly feedback
- **API-First Architecture** - Statistics and user data served through secure API endpoints with service role authentication
- **RLS Bypass** - Admin operations use service role to bypass Row Level Security issues while maintaining security
- **Clean Auth Experience** - Navbar correctly hidden during authentication flows and logout transitions
- **Profile Management Migration** - User profile functionality moved to auth section with updated navigation routes

## Tech Stack

- **Frontend**: Nuxt.js 4, Vue.js 3, TailwindCSS
- **UI Components**: Custom component system with Headless UI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: Pinia
- **Icons**: @nuxt/icon with Boxicons
- **Testing**: Vitest (unit tests), Playwright (E2E tests), Vue Testing Library
- **Package Manager**: pnpm
- **Deployment**: Ready for Vercel/Netlify deployment

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/andrescristi/liberador_inaplast_nuxt.git
   cd liberador_inaplast_nuxt
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   ```bash
   # Initialize Supabase (if using local development)
   npx supabase start
   
   # Or apply migrations to your Supabase project
   npx supabase db push
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

### Creating Users

#### Method 1: Admin Panel (Recommended)
Once you have an admin user, you can create new users through the admin interface:
1. Log in as an admin user
2. Navigate to "Administración" in the navigation menu
3. Click "Crear Usuario" 
4. Fill in user details and assign a role
5. The new user will receive an email confirmation automatically

#### Method 2: Supabase Dashboard (Initial Setup)
For creating your first admin user, use the Supabase dashboard:
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" 
4. Enter email and password (e.g., `admin@example.com` / `123456`)
5. In the Database > Profiles table, update the user's role to 'Admin'

**Test Credentials**: Create an admin user with `admin@example.com` and password `123456` for testing.

## Project Structure

```
app/
├── components/
│   ├── admin/                 # Admin panel components
│   │   ├── UserCreateModal.vue # User creation modal form
│   │   └── UserEditModal.vue   # User editing modal form
│   ├── core/                  # Core app components (navigation)
│   └── ui/                    # Custom UI components (TailwindCSS-based)
│       ├── BaseAlert.vue      # Alert/notification component
│       ├── BaseBadge.vue      # Status badges
│       ├── BaseButton.vue     # Button component with variants
│       ├── BaseCard.vue       # Card component
│       ├── BaseDropdown.vue   # Dropdown menu
│       ├── BaseInput.vue      # Form input component
│       ├── BaseModal.vue      # Modal dialog
│       ├── BaseTable.vue      # Data table component
│       ├── ToastContainer.vue # Toast notification container
│       └── ToastNotification.vue # Individual toast notifications
├── composables/
│   ├── useAuth.ts             # Authentication composable with role metadata
│   ├── useDebounce.ts         # Debouncing utility for search/input handling
│   ├── useAdminUserAPI.ts     # Admin user API operations via secure endpoints
│   ├── useAdminUserManager.ts # Admin user management with state handling
│   └── useToast.ts            # Toast notification management
├── layouts/
│   └── default.vue            # Main layout with navigation
├── middleware/
│   ├── auth.ts                # Route protection middleware
│   └── require-admin-role.ts  # Admin-only route protection
├── pages/
│   ├── admin/
│   │   └── users.vue          # User administration dashboard
│   ├── auth/
│   │   ├── confirm.vue        # Email confirmation handler
│   │   ├── login.vue          # Login page with password reset
│   │   ├── profile.vue        # User profile management (relocated to auth)
│   │   └── reset-password.vue # Password reset page
│   ├── orders/
│   │   ├── [id].vue           # Individual release details
│   │   ├── index.vue          # Release history and management
│   │   └── new.vue            # 4-step quality control workflow
│   └── index.vue              # Dashboard with metrics
├── types/                     # TypeScript type definitions
├── utils/
│   └── formatters.ts          # Shared formatting utilities (currency, dates)
└── assets/
    ├── css/
    │   ├── main.css                    # Global styles, utilities, z-index scale, and CSS imports
    │   ├── ui-components.css           # Button ripple effects, input animations, loading states
    │   ├── navigation.css              # Hamburger animations, mobile nav transitions
    │   ├── notifications.css           # Toast transitions and positioning
    │   ├── effects.css                 # Confetti celebrations and magical particles
    │   ├── dashboard.css               # Dashboard-specific styles and animations
    │   ├── profile.css                # Profile page micro-interactions
    │   └── mobile-optimizations.css    # Mobile-first responsive optimizations
    └── images/                # Application images

server/
├── api/
│   ├── admin/
│   │   └── users/             # User management API endpoints
│   │       ├── index.get.ts   # List users with pagination
│   │       ├── index.post.ts  # Create new user
│   │       ├── create-user-simple.post.ts # Simplified user creation endpoint
│   │       ├── list.get.ts    # Enhanced user listing with filters
│   │       ├── [id].put.ts    # Update user details
│   │       ├── [id].delete.ts # Delete user account
│   │       └── stats.get.ts   # User statistics and activity
│   ├── test-admin-creation.post.ts    # Testing endpoints for admin functionality
│   ├── test-create-user.post.ts       # User creation testing
│   ├── test-direct-supabase.post.ts   # Direct Supabase integration testing
│   └── test-service-role.get.ts       # Service role testing
└── utils/                     # Server utilities and helper functions

supabase/
└── migrations/
    └── 20250811000001_add_user_activity_logs.sql # Audit trail system
```

## Development

### Available Scripts

```bash
pnpm dev             # Start development server
pnpm build           # Build for production
pnpm generate        # Generate static site
pnpm preview         # Preview production build
pnpm lint            # Run ESLint to check code quality
pnpm lint:fix        # Automatically fix ESLint issues
pnpm test            # Run unit tests with Vitest
pnpm test:ui         # Run tests with UI interface
pnpm test:coverage   # Run tests with coverage report
pnpm test:e2e        # Run end-to-end tests with Playwright
pnpm test:e2e:ui     # Run E2E tests with Playwright UI
```

### Custom UI Component System

This project uses a custom component system built with TailwindCSS and Headless UI:

- **BaseButton**: Multi-variant button (solid, outline, ghost, link) with loading states
- **BaseCard**: Flexible card with header, body, and footer slots
- **BaseInput**: Form input with validation states and icon support
- **BaseModal**: Modal dialogs with smooth transitions
- **BaseAlert**: Notification alerts with multiple variants
- **BaseDropdown**: Dropdown menus with keyboard navigation
- **BaseBadge**: Status badges with color variants
- **BaseTable**: Data tables with selection support
- **Toast System**: Global notification management

All components are auto-imported and include full TypeScript support.

### Code Quality & Linting

This project maintains high code quality standards with:

- **ESLint Configuration**: Comprehensive rules for Vue.js, TypeScript, and Nuxt.js
- **TypeScript Support**: Full type safety with proper prop definitions and strict type checking
- **Component Prop Types**: Optimized for @nuxt/icon compatibility with Boxicons
- **Clean Code Standards**: Automated linting with `pnpm lint` and `pnpm lint:fix`
- **Zero ESLint Errors**: Complete elimination of all TypeScript 'any' types and lint violations
- **Type Safety**: Replaced all 'any' types with proper TypeScript interfaces and error handling
- **Dead Code Elimination**: Removed unused variables, functions, and commented-out code
- **Shared Utilities**: Created reusable formatting functions to eliminate code duplication
- **Production Ready**: All pages optimized for maintainability and performance

### CSS Architecture & Organization

The project uses a completely refactored modular CSS architecture for maximum maintainability and performance:

- **External CSS Files**: All inline component CSS moved to organized external stylesheets
- **Zero CSS Duplication**: Common patterns extracted and consolidated across 400+ lines of code
- **Component-Specific Organization**: CSS grouped by functionality (UI, navigation, effects, notifications)
- **Consistent Z-Index Scale**: Standardized layering system using CSS custom properties
- **Global Optimizations**: Universal transitions, reduced-motion preferences, and accessibility
- **Performance Focused**: Minimized CSS redundancy and optimized loading

**CSS Architecture:**
- `main.css` - Global styles, z-index scale, common utilities, and CSS imports
- `ui-components.css` - Button ripple effects, input focus rings, loading animations
- `navigation.css` - Hamburger menu animations, mobile nav transitions, gradient backgrounds
- `notifications.css` - Toast transitions, positioning, and progress animations
- `effects.css` - Confetti celebrations, magical particles, and visual effects
- `dashboard.css` - Dashboard metrics animations and hover effects
- `profile.css` - Profile page micro-interactions and delightful animations
- `mobile-optimizations.css` - Mobile-first responsive design and touch optimizations

**Refactoring Achievements:**
- ✅ **Eliminated 400+ lines** of duplicated CSS from Vue components
- ✅ **Standardized z-index values** using CSS custom properties (`--z-*`)
- ✅ **Extracted common animation patterns** (ripple effects, gradient shifts, fade transitions)
- ✅ **Maintained all functionality** - zero behavior changes during refactoring
- ✅ **Improved maintainability** - centralized styling with clean separation of concerns

### Authentication Flow

1. **Route Protection**: All routes use the `auth` middleware
2. **Login Required**: Unauthenticated users are redirected to `/auth/login`
3. **Clean Auth Experience**: Navigation is hidden on login/auth pages for cleaner UX
4. **Session Persistence**: Supabase handles session management automatically
5. **Profile Access**: Users can access their profile page via the navigation menu
6. **Logout**: Available through the user menu in the navigation

### Database Schema

The application uses the following main tables:
- `profiles` - User profiles with role-based access control
- `user_activity_logs` - Comprehensive audit trail for all user management actions
- `orders` - Product release records with quality control data
- `order_items` - Individual items and test results within releases

**Role-Based Access Control:**
- **Admin**: Full system access including user management
- **Supervisor**: Can manage orders and view all data
- **Inspector**: Can create and manage assigned orders

See `supabase/migrations/` for complete schema definitions and security policies.

## Deployment

### Environment Variables

Ensure these environment variables are set in your deployment platform:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build and Deploy

```bash
# Build the application
pnpm build

# The .output directory contains the built application
# Deploy the .output directory to your hosting platform
```

## Security Considerations

- **Authentication Required**: All routes are protected by default
- **Row Level Security**: Database tables use RLS policies
- **Environment Variables**: Sensitive data stored in environment variables
- **Session Management**: Secure session handling via Supabase Auth

## Development Status

- ✅ **Authentication System**: Complete with login/logout/password reset and conditional navigation
- ✅ **Custom UI System**: Modern component library with TailwindCSS + Headless UI
- ✅ **Route Protection**: All pages require authentication  
- ✅ **User Interface**: Dashboard, navigation, and responsive design with Spanish localization
- ✅ **Navigation System**: Streamlined navigation with improved user experience
- ✅ **Toast Notifications**: Global notification system
- ✅ **Component Architecture**: 12+ base components with TypeScript support
- ✅ **Code Quality**: Complete TypeScript compliance with zero ESLint errors
- ✅ **Type Safety**: Eliminated all 'any' types, implemented strict TypeScript checking
- ✅ **Vue Component Optimization**: Fixed prop type issues and component resolution
- ✅ **Icon System**: Migrated from Heroicons to Boxicons via @nuxt/icon
- ✅ **Package Management**: Clean dependencies with pnpm, resolved version conflicts
- ✅ **Theme System**: Classic blue color palette with simplified theme management
- ✅ **Quality Control Workflow**: 4-step product release process with image upload
- ✅ **Project Structure Optimization**: Removed unused customer/product management, focused on liberador workflow
- ✅ **CSS Architecture Refactor**: Complete CSS reorganization with external stylesheets, eliminated 400+ lines of duplicated code
- ✅ **Configuration Management**: Updated nuxt.config.ts with SEO optimization, performance settings, and proper auth routing
- ✅ **Framework Upgrade**: Successfully upgraded to Nuxt 4.0.3 with improved performance and type safety
- ✅ **Codebase Cleanup**: Comprehensive cleanup completed across all pages - removed unused code, dead functions, and duplicate utilities
- ✅ **Shared Utilities**: Created centralized formatting utilities to eliminate code duplication and improve maintainability
- ✅ **User Administration System**: Complete admin panel with role-based access control, user CRUD operations, and activity auditing
- ✅ **Role-Based Security**: Three-tier role system (Admin/Supervisor/Inspector) with granular permissions and route protection
- ✅ **Activity Audit Trail**: Comprehensive logging system tracking all user management actions with database triggers and functions
- ✅ **Profile Management**: Full user profile functionality with real-time name updates and validation
- ✅ **Internationalization**: Complete Spanish localization with all user-facing messages translated
- ✅ **Error Handling**: Robust error handling with user-friendly Spanish error messages
- ✅ **Permission Error Handling**: Intelligent error detection for access denied scenarios with user-friendly messaging
- ✅ **Admin Security**: Protected admin routes with graceful permission error handling and clear user feedback
- ✅ **SSR Compatibility**: Full server-side rendering support with Pinia state management
- ✅ **Order Status System**: Simplified order management with "Aceptado/Rechazado" states
- ✅ **Component Resolution Issues**: Fixed Vue component auto-import issues with explicit imports for critical UI components
- ✅ **TypeScript Compliance**: Resolved all TypeScript errors in admin user interface with proper type casting and prop handling
- ✅ **Vue 3 Hydration**: Eliminated SSR hydration mismatch warnings and improved client-side rendering performance
- ✅ **UI Component Compatibility**: Updated BaseTable, BaseBadge, and BaseModal components with correct prop interfaces and slot handling
- ✅ **TypeScript Database Integration**: Complete Supabase type safety with properly typed RPC functions and database schemas
- ✅ **Database Type Safety**: Fixed all TypeScript errors in database composables with proper Database generic types and RPC function definitions
- ✅ **Admin API Refactoring**: Modular admin user management with separate API composables for better code organization
- ✅ **Testing Infrastructure**: Comprehensive testing endpoints for admin functionality and direct Supabase integration
- ✅ **Server Utilities**: Centralized server-side utilities for improved code reusability
- ✅ **Statistics API Integration**: Fixed admin user statistics display issues by implementing API-first approach with service role authentication
- ✅ **RLS Bypass Architecture**: Admin operations now use secure API endpoints that bypass Row Level Security restrictions while maintaining security
- ✅ **Enhanced User Authentication**: Added role metadata to JWT claims for improved authorization handling
- ✅ **Modal Component Improvements**: Refactored admin user modals with better styling and proper composable integration
- ✅ **Code Cleanup**: Removed redundant composables and consolidated admin user management logic
- ✅ **User Creation System**: Fixed critical architecture flaw in user creation modal to use secure server-side API endpoints instead of client-side admin operations
- ✅ **Security Architecture**: Corrected user creation flow to properly use service role authentication through server endpoints for admin operations
- ✅ **User Deletion System**: Fixed user deletion functionality to use secure server-side API endpoints with proper admin authentication and role validation
- ✅ **User Edit System**: Complete user editing functionality with secure server-side API endpoints, email updates, and password reset functionality
- ✅ **Email Integration**: Fixed user email fetching in admin interface using Supabase Auth admin API for accurate email display and editing
- ✅ **Auth UI/UX**: Resolved navbar display issues on authentication pages with route-based conditional rendering
- ✅ **Admin Operations Security**: Complete CRUD operations now properly use server-side endpoints with service role authentication instead of client-side admin calls
- ✅ **Password Reset System**: Added secure admin-initiated password reset functionality with email notifications
- ✅ **Testing Infrastructure**: Complete testing setup with Vitest for unit/integration tests and Playwright for E2E testing with multi-browser support
- ✅ **Profile Route Migration**: Moved user profile from root to auth section for better organization and improved navigation consistency
- ✅ **Component Testing**: Comprehensive test structure for components, composables, middleware, stores, and utilities
- 🔄 **Database Integration**: Supabase integration for release data and quality control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.

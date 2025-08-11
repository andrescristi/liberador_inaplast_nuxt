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

### 🏭 Product Release Management
- **Dashboard** - Overview of inspections, approvals, and rejections with Spanish localization
- **Nueva Liberación** - 4-step quality control workflow:
  - Step 1: Initial data (label image upload, box quantity)
  - Step 2: Product details (client, batch, order info, personnel, sampling levels)
  - Step 3: Quality tests (dimensions, resistance, appearance)
  - Step 4: Results summary and approval/rejection
- **Release Tracking** - View and manage release status and quality test results
- **Historial** - Complete release history with filtering and search capabilities

## Tech Stack

- **Frontend**: Nuxt.js 4, Vue.js 3, TailwindCSS
- **UI Components**: Custom component system with Headless UI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: Pinia
- **Icons**: @nuxt/icon with Boxicons
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

Since user registration is disabled, you'll need to create users through the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" 
4. Enter email and password (e.g., `user@example.com` / `123456`)
5. The user can now log in to the application

**Test Credentials**: Create a user with `user@example.com` and password `123456` for testing.

## Project Structure

```
app/
├── components/
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
│   ├── useAuth.ts             # Authentication composable
│   └── useToast.ts            # Toast notification management
├── layouts/
│   └── default.vue            # Main layout with navigation
├── middleware/
│   └── auth.ts                # Route protection middleware
├── pages/
│   ├── auth/
│   │   ├── confirm.vue        # Email confirmation handler
│   │   ├── login.vue          # Login page with password reset
│   │   └── reset-password.vue # Password reset page
│   ├── orders/
│   │   ├── [id].vue           # Individual release details
│   │   ├── index.vue          # Release history and management
│   │   └── new.vue            # 4-step quality control workflow
│   ├── index.vue              # Dashboard with metrics
│   └── profile.vue            # User profile page
├── types/                     # TypeScript type definitions
├── utils/
│   └── formatters.ts          # Shared formatting utilities (currency, dates)
└── assets/
    ├── css/
    │   ├── main.css                    # Global styles, animations, and utilities
    │   ├── dashboard.css               # Dashboard-specific styles and animations
    │   ├── profile.css                # Profile page micro-interactions
    │   └── mobile-optimizations.css    # Mobile-first responsive optimizations
    └── images/                # Application images
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
- **TypeScript Support**: Full type safety with proper prop definitions
- **Component Prop Types**: Optimized for @nuxt/icon compatibility with Boxicons
- **Clean Code Standards**: Automated linting with `pnpm lint` and `pnpm lint:fix`
- **Zero ESLint Errors**: Comprehensive codebase cleanup completed across all pages
- **Dead Code Elimination**: Removed unused variables, functions, and commented-out code
- **Shared Utilities**: Created reusable formatting functions to eliminate code duplication
- **Production Ready**: All pages optimized for maintainability and performance

### CSS Architecture & Organization

The project uses a modular CSS architecture for maintainability and performance:

- **Modular Structure**: Page-specific CSS files separated from global styles
- **Duplicate Elimination**: Common animations and utilities consolidated in `main.css`
- **Global Optimizations**: Universal transitions, reduced-motion preferences, and accessibility
- **Performance Focused**: Minimized CSS redundancy and optimized loading
- **Maintainable**: Clean separation of concerns between global and component-specific styles

**CSS Files:**
- `main.css` - Global styles, common animations (`fade-in-up`), accessibility features
- `dashboard.css` - Dashboard metrics animations and hover effects
- `profile.css` - Profile page micro-interactions and delightful animations
- `mobile-optimizations.css` - Mobile-first responsive design and touch optimizations

### Authentication Flow

1. **Route Protection**: All routes use the `auth` middleware
2. **Login Required**: Unauthenticated users are redirected to `/auth/login`
3. **Clean Auth Experience**: Navigation is hidden on login/auth pages for cleaner UX
4. **Session Persistence**: Supabase handles session management automatically
5. **Profile Access**: Users can access their profile page via the navigation menu
6. **Logout**: Available through the user menu in the navigation

### Database Schema

The application uses the following main tables:
- `profiles` - User profiles and information
- `orders` - Product release records with quality control data
- `order_items` - Individual items and test results within releases

See `supabase/migrations/` for complete schema definitions.

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
- ✅ **Code Quality**: ESLint configuration with comprehensive linting rules
- ✅ **Vue Component Optimization**: Fixed prop type issues and component resolution
- ✅ **Icon System**: Migrated from Heroicons to Boxicons via @nuxt/icon
- ✅ **Package Management**: Clean dependencies with pnpm, resolved version conflicts
- ✅ **Theme System**: Classic blue color palette with simplified theme management
- ✅ **Quality Control Workflow**: 4-step product release process with image upload
- ✅ **Project Structure Optimization**: Removed unused customer/product management, focused on liberador workflow
- ✅ **CSS Architecture**: Modular CSS with deduplication, performance optimization, and maintainable organization
- ✅ **Configuration Management**: Updated nuxt.config.ts with SEO optimization, performance settings, and proper auth routing
- ✅ **Framework Upgrade**: Successfully upgraded to Nuxt 4.0.3 with improved performance and type safety
- ✅ **Codebase Cleanup**: Comprehensive cleanup completed across all pages - removed unused code, dead functions, and duplicate utilities
- ✅ **Shared Utilities**: Created centralized formatting utilities to eliminate code duplication and improve maintainability
- 🔄 **Database Integration**: Supabase integration for release data and quality control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.

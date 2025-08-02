# INAPLAST Order Management System - Project Structure

## Current Application Structure

```
liberador_inaplast_nuxt/
├── app/                           # Nuxt.js application source
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # TailwindCSS styles
│   ├── components/               # Vue components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Badge.vue
│   │   │   ├── Button.vue
│   │   │   ├── Card.vue
│   │   │   ├── Input.vue
│   │   │   ├── Modal.vue
│   │   │   ├── Pagination.vue
│   │   │   └── Select.vue
│   │   ├── forms/                # Form components
│   │   │   ├── CustomerForm.vue
│   │   │   ├── OrderForm.vue
│   │   │   └── ProductForm.vue
│   │   ├── tables/               # Table components
│   │   ├── modals/               # Modal components
│   │   ├── MetricCard.vue        # Dashboard metrics
│   │   └── QuickActionCard.vue   # Dashboard actions
│   ├── composables/              # Vue composables
│   │   └── useAuth.ts           # Authentication logic
│   ├── layouts/
│   │   └── default.vue          # Main layout with auth-aware navigation
│   ├── middleware/              # Route middleware
│   │   └── auth.ts              # Authentication middleware
│   ├── pages/                   # Application routes
│   │   ├── auth/                # Authentication pages
│   │   │   ├── login.vue        # Login page
│   │   │   └── reset-password.vue # Password reset
│   │   ├── customers/           # Customer management
│   │   │   ├── index.vue        # Customer list
│   │   │   └── new.vue          # Create customer
│   │   ├── orders/              # Order management
│   │   │   ├── index.vue        # Order list
│   │   │   ├── new.vue          # Create order
│   │   │   └── [id].vue         # Order details
│   │   ├── products/            # Product management
│   │   │   ├── index.vue        # Product list
│   │   │   └── new.vue          # Create product
│   │   ├── confirm.vue          # Email confirmation
│   │   └── index.vue            # Dashboard
│   ├── stores/                  # Pinia state stores
│   │   ├── customers.ts         # Customer state
│   │   ├── dashboard.ts         # Dashboard state
│   │   ├── orders.ts            # Order state
│   │   └── products.ts          # Product state
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── utils/
│       ├── debounce.ts          # Utility functions
│       └── supabase.ts          # Supabase API client
├── docs/
│   └── database-schema.md       # Database documentation
├── supabase/                    # Supabase configuration
│   ├── config.toml              # Local Supabase config
│   ├── migrations/              # Database migrations
│   │   ├── 20250801000001_initial_schema.sql
│   │   └── 20250801000002_database_functions.sql
│   └── seed.sql                 # Sample data
├── agent-context/               # Agent collaboration files
│   ├── handoff-log.md
│   ├── phase1-ux-output.md
│   ├── phase2-ui-output.md
│   ├── phase3-frontend-output.md
│   ├── phase4-backend-output.md
│   └── project-spec.md
├── tests/                       # Test files
│   └── app-functionality.spec.js
├── .env                         # Environment variables
├── nuxt.config.ts               # Nuxt configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## Authentication System

### Key Features
- **Secure Authentication**: Supabase Auth with email/password login
- **Route Protection**: All routes protected by authentication middleware
- **Session Management**: Automatic session handling and persistence
- **Password Reset**: Email-based password recovery system
- **User Interface**: User menu with logout functionality

### Authentication Flow
1. **Unauthenticated Access**: Users are redirected to `/auth/login`
2. **Login Process**: Email/password validation via Supabase Auth
3. **Session Creation**: Automatic session establishment on successful login
4. **Route Access**: Authentication middleware validates all protected routes
5. **Logout**: Secure session termination and redirect to login

### File Descriptions

#### Authentication Files
- `app/composables/useAuth.ts` - Core authentication logic and state management
- `app/middleware/auth.ts` - Route protection middleware
- `app/pages/auth/login.vue` - Login form with Spanish UI
- `app/pages/auth/reset-password.vue` - Password reset functionality
- `app/pages/confirm.vue` - Email confirmation handling

#### Configuration
- `nuxt.config.ts` - Supabase module configuration with redirect settings
- `.env` - Environment variables for Supabase connection

### Security Implementation
- **Route Guards**: Authentication middleware on all protected pages
- **Session Validation**: Automatic token validation via Supabase
- **Secure Redirects**: Proper redirect flow for authenticated/unauthenticated states
- **Environment Security**: Sensitive credentials stored in environment variables

## Development Guidelines

### Adding New Pages
1. Create page component in appropriate directory under `app/pages/`
2. Authentication is applied by default through layout middleware
3. Use existing UI components from `app/components/ui/`
4. Follow existing patterns for state management with Pinia stores

### Component Organization
- **UI Components**: Reusable base components in `app/components/ui/`
- **Form Components**: Business logic forms in `app/components/forms/`
- **Page Components**: Route-specific components in `app/pages/`
- **Layout Components**: Global layout and navigation in `app/layouts/`

### State Management
- **Pinia Stores**: Domain-specific stores for each business entity
- **Authentication State**: Managed by Supabase composables
- **API Integration**: Centralized in `app/utils/supabase.ts`
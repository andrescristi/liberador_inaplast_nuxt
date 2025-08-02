# Liberador Inaplast - Order Management System

A modern web application for managing orders, customers, and products built with Nuxt.js, Supabase, and TailwindCSS.

## Features

### 🔐 Authentication
- **Secure Login System** - Email/password authentication via Supabase Auth
- **Password Reset** - Forgot password functionality with email verification
- **Protected Routes** - All application routes require authentication
- **User Session Management** - Automatic login/logout handling
- **User Menu** - Access to user profile and logout functionality

### 📊 Order Management
- **Dashboard** - Overview of key metrics and recent activity
- **Order Creation** - Create new orders with multiple products
- **Order Tracking** - View and manage order status
- **Order History** - Complete order history with filtering

### 👥 Customer Management
- **Customer Directory** - Comprehensive customer database
- **Customer Profiles** - Detailed customer information and order history
- **Customer Analytics** - Track customer spending and order patterns

### 📦 Product Management
- **Product Catalog** - Manage product inventory and pricing
- **Stock Tracking** - Monitor stock levels and low inventory alerts
- **Product Analytics** - Track product performance and sales

## Tech Stack

- **Frontend**: Nuxt.js 3, Vue.js 3, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI Components**: Custom component library with shadcn/ui inspiration
- **State Management**: Pinia
- **Form Validation**: VeeValidate with Zod schemas
- **Icons**: Lucide Vue
- **Deployment**: Ready for Vercel/Netlify deployment

## Recent Updates

### ✅ Authentication System (Latest)
- **Fully Implemented**: Complete Supabase authentication integration
- **Form Issues Fixed**: Resolved UI component binding issues with native HTML inputs
- **User Management**: Added user dropdown menu with logout functionality
- **Route Protection**: All pages now require authentication
- **Documentation**: Complete setup guide and troubleshooting documentation

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd liberador_inaplast_nuxt
   ```

2. **Install dependencies**
   ```bash
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
├── composables/
│   └── useAuth.ts              # Authentication composable
├── middleware/
│   └── auth.ts                 # Route protection middleware
├── pages/
│   ├── auth/
│   │   ├── login.vue          # Login page
│   │   └── reset-password.vue # Password reset page
│   ├── confirm.vue            # Email confirmation handler
│   ├── index.vue              # Dashboard
│   ├── orders/                # Order management pages
│   ├── customers/             # Customer management pages
│   └── products/              # Product management pages
├── layouts/
│   └── default.vue            # Main layout with auth-aware navigation
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── forms/                 # Form components
│   └── tables/                # Table components
├── stores/                    # Pinia stores
├── types/                     # TypeScript type definitions
└── utils/
    └── supabase.ts            # Supabase API utilities
```

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run generate     # Generate static site
npm run preview      # Preview production build
```

### Authentication Flow

1. **Route Protection**: All routes use the `auth` middleware
2. **Login Required**: Unauthenticated users are redirected to `/auth/login`
3. **Session Persistence**: Supabase handles session management automatically
4. **Logout**: Available through the user menu in the navigation

### Database Schema

The application uses the following main tables:
- `customers` - Customer information
- `products` - Product catalog
- `orders` - Order records
- `order_items` - Individual items within orders

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
npm run build

# The .output directory contains the built application
# Deploy the .output directory to your hosting platform
```

## Security Considerations

- **Authentication Required**: All routes are protected by default
- **Row Level Security**: Database tables use RLS policies
- **Environment Variables**: Sensitive data stored in environment variables
- **Session Management**: Secure session handling via Supabase Auth

## Known Issues & Solutions

### Authentication Working ✅
- **Issue**: "Invalid login credentials" error
- **Solution**: User must exist in Supabase Auth. Create users through Supabase dashboard.

### UI Components ✅  
- **Issue**: Input/Button component warnings resolved
- **Solution**: Replaced custom components with native HTML inputs for better compatibility.

## Development Status

- ✅ **Authentication System**: Complete with login/logout/password reset
- ✅ **Route Protection**: All pages require authentication  
- ✅ **User Interface**: Dashboard, orders, customers, products pages
- ✅ **Database Schema**: Complete with migrations and functions
- ✅ **Documentation**: Setup guides and API documentation
- 🔄 **Testing**: Form validation and authentication flow tested
- 📋 **Next Steps**: Add user roles and permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.

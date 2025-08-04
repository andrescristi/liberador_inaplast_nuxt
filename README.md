# Liberador Inaplast - Order Management System

A modern web application for managing orders, customers, and products built with Nuxt.js, DaisyUI, and Supabase.

## Features

### 🔐 Authentication & User Management
- **Secure Login System** - Email/password authentication via Supabase Auth
- **Password Reset** - Forgot password functionality with email verification
- **User Profiles** - Complete profile management with role-based access
- **Protected Routes** - All application routes require authentication
- **User Session Management** - Automatic login/logout handling

### 📊 Order Management
- **Dashboard** - Overview of key metrics and recent activity
- **Order Creation** - Create new orders with multiple products
- **Order Tracking** - View and manage order status
- **Order History** - Complete order history with filtering

### 👥 Customer Management
- **Customer Directory** - Comprehensive customer database
- **Customer Profiles** - Detailed customer information and order history

### 📦 Product Management
- **Product Catalog** - Manage product inventory and pricing
- **Stock Tracking** - Monitor stock levels and alerts

## Tech Stack

- **Frontend**: Nuxt.js 3, Vue.js 3, TailwindCSS
- **UI Framework**: DaisyUI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: Pinia
- **Icons**: Lucide Vue
- **Deployment**: Ready for Vercel/Netlify deployment

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
├── components/
│   ├── business/              # Business-specific components
│   ├── core/                  # Core app components (navigation)
│   ├── data/                  # Data display components
│   ├── feedback/              # User feedback components
│   ├── forms/                 # Form components
│   ├── modals/                # Modal components
│   └── ui/                    # UI components (DaisyUI-based)
├── composables/
│   ├── useAuth.ts             # Authentication composable
│   ├── useDaisyComponents.ts  # DaisyUI component utilities
│   └── useDaisyUI.ts          # DaisyUI configuration
├── layouts/
│   └── default.vue            # Main layout with navigation
├── middleware/
│   └── auth.ts                # Route protection middleware
├── pages/
│   ├── auth/
│   │   ├── login.vue          # Login page
│   │   └── reset-password.vue # Password reset page
│   ├── customers/             # Customer management pages
│   ├── orders/                # Order management pages
│   ├── products/              # Product management pages
│   ├── confirm.vue            # Email confirmation handler
│   ├── index.vue              # Dashboard
│   └── profile.vue            # User profile page
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
4. **Profile Access**: Users can access their profile page via the navigation menu
5. **Logout**: Available through the user menu in the navigation

### Database Schema

The application uses the following main tables:
- `profiles` - User profiles and information
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

## Development Status

- ✅ **Authentication System**: Complete with login/logout/password reset
- ✅ **User Profile System**: Profile management with security features
- ✅ **Route Protection**: All pages require authentication  
- ✅ **User Interface**: Dashboard, orders, customers, products, and profile pages
- ✅ **Database Schema**: Complete with migrations and RLS policies
- ✅ **DaisyUI Integration**: Modern UI components with responsive design
- 🔄 **Core Features**: Order, customer, and product management in development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.

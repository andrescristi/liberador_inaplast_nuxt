# Order Management Webapp - Project Specification

## LOCKED FEATURE SCOPE

### Core Features (DO NOT ADD BEYOND THIS LIST):

#### 1. Dashboard Overview
- Total orders count (pending, completed, cancelled)
- Revenue metrics for current month/week
- Recent orders list (last 10)
- Quick action buttons

#### 2. Order Management
- Create new orders with customer details, items, quantities, prices
- View all orders in a paginated table with filters (status, date range, customer)
- Edit existing orders (only if status is 'pending')
- Update order status (pending → processing → completed/cancelled)
- Delete orders (with confirmation)

#### 3. Customer Management
- Add/edit customer information (name, email, phone, address)
- View customer order history
- Customer search and selection during order creation

#### 4. Product/Item Management
- Add/edit products with name, description, price, stock
- Product search and selection during order creation
- Stock level tracking

#### 5. Order Details & Tracking
- Detailed order view with all information
- Order status timeline
- Print order summary (PDF export)

## CONFIRMED TECH STACK

- **Frontend**: Nuxt.js 3 with TypeScript
- **UI Components**: shadcn/ui (Vue version)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (database, auth, real-time)
- **State Management**: Pinia
- **Form Handling**: VeeValidate + Zod

## DATABASE ENTITIES

### Customers
- id, name, email, phone, address, created_at, updated_at

### Products
- id, name, description, price, stock_quantity, created_at, updated_at

### Orders
- id, customer_id, status, total_amount, order_date, created_at, updated_at

### Order Items
- id, order_id, product_id, quantity, unit_price, subtotal

## CONSTRAINTS
- NO feature additions beyond this specification
- All agents must work within this defined scope
- Focus on polished implementation of these exact features
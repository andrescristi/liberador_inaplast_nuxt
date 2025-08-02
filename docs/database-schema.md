# Database Schema Documentation

## Overview

This document describes the database schema for the Order Management System built with Supabase PostgreSQL.

## Tables

### customers

Stores customer information for order management.

```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (length(name) > 0),
    email TEXT UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone TEXT CHECK (phone IS NULL OR length(phone) >= 10),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: Unique identifier (UUID, primary key)
- `name`: Customer full name (required, minimum 1 character)
- `email`: Customer email address (required, unique, validated format)
- `phone`: Customer phone number (optional, minimum 10 characters if provided)
- `address`: Customer address (optional)
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

**Indexes:**
- `idx_customers_email`: Index on email for unique lookups
- `idx_customers_name`: Index on name for search performance

### products

Stores product catalog and inventory information.

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (length(name) > 0),
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: Unique identifier (UUID, primary key)
- `name`: Product name (required, minimum 1 character)
- `description`: Product description (optional)
- `price`: Product price (required, non-negative, 2 decimal places)
- `stock_quantity`: Available stock quantity (required, non-negative, default 0)
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

**Indexes:**
- `idx_products_name`: Index on name for search performance
- `idx_products_stock`: Index on stock_quantity for inventory queries

### orders

Stores order header information.

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id`: Unique identifier (UUID, primary key)
- `customer_id`: Reference to customer (foreign key, required)
- `status`: Order status (required, enum: pending/processing/completed/cancelled)
- `total_amount`: Order total amount (required, non-negative, 2 decimal places)
- `order_date`: Order placement date (default: current timestamp)
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

**Indexes:**
- `idx_orders_customer_id`: Index on customer_id for customer queries
- `idx_orders_status`: Index on status for status-based filtering
- `idx_orders_date`: Index on order_date for date range queries
- `idx_orders_created_at`: Index on created_at for recent orders

**Foreign Keys:**
- `customer_id` → `customers(id)` ON DELETE RESTRICT

### order_items

Stores individual items within orders.

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    CONSTRAINT valid_subtotal CHECK (subtotal = quantity * unit_price)
);
```

**Columns:**
- `id`: Unique identifier (UUID, primary key)
- `order_id`: Reference to order (foreign key, required)
- `product_id`: Reference to product (foreign key, required)
- `quantity`: Item quantity (required, positive integer)
- `unit_price`: Price per unit at time of order (required, non-negative, 2 decimal places)
- `subtotal`: Line item total (required, non-negative, calculated as quantity × unit_price)

**Indexes:**
- `idx_order_items_order_id`: Index on order_id for order queries
- `idx_order_items_product_id`: Index on product_id for product queries

**Foreign Keys:**
- `order_id` → `orders(id)` ON DELETE CASCADE
- `product_id` → `products(id)` ON DELETE RESTRICT

**Constraints:**
- `valid_subtotal`: Ensures subtotal equals quantity × unit_price

## Database Functions

### get_dashboard_metrics()

Returns comprehensive dashboard statistics in JSON format.

```sql
CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS JSON
```

**Returns:**
- `pending_orders`: Count of pending orders
- `processing_orders`: Count of processing orders
- `completed_orders`: Count of completed orders
- `cancelled_orders`: Count of cancelled orders
- `current_month_revenue`: Revenue for current month (completed orders only)
- `current_week_revenue`: Revenue for current week (completed orders only)
- `completion_rate`: Percentage of completed orders
- `total_orders`: Total number of orders

### search_orders()

Advanced order search with filtering and pagination.

```sql
CREATE OR REPLACE FUNCTION search_orders(
    search_term TEXT DEFAULT NULL,
    status_filter TEXT DEFAULT NULL,
    customer_id_filter UUID DEFAULT NULL,
    date_from TIMESTAMP DEFAULT NULL,
    date_to TIMESTAMP DEFAULT NULL,
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 20
)
RETURNS TABLE(...)
```

**Parameters:**
- `search_term`: Text search in customer name, email, or order ID
- `status_filter`: Filter by order status
- `customer_id_filter`: Filter by specific customer
- `date_from`: Start date for date range filter
- `date_to`: End date for date range filter
- `page_num`: Page number for pagination
- `page_size`: Items per page

### get_order_details()

Retrieves complete order information with customer and items.

```sql
CREATE OR REPLACE FUNCTION get_order_details(order_id_param UUID)
RETURNS JSON
```

### search_customers()

Customer search with pagination and statistics.

```sql
CREATE OR REPLACE FUNCTION search_customers(
    search_term TEXT DEFAULT NULL,
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 20
)
RETURNS TABLE(...)
```

### search_products()

Product search with sales statistics and filtering.

```sql
CREATE OR REPLACE FUNCTION search_products(
    search_term TEXT DEFAULT NULL,
    low_stock_only BOOLEAN DEFAULT FALSE,
    low_stock_threshold INTEGER DEFAULT 10,
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 20
)
RETURNS TABLE(...)
```

## Triggers

### handle_updated_at()

Automatically updates the `updated_at` timestamp on record modifications.

**Applied to:**
- customers
- products
- orders

### update_product_stock()

Automatically adjusts product stock quantities when order items are created, updated, or deleted.

**Triggered by:**
- INSERT, UPDATE, DELETE on order_items

### recalculate_order_total()

Automatically recalculates order totals when order items change.

**Triggered by:**
- INSERT, UPDATE, DELETE on order_items

## Row Level Security (RLS)

All tables have RLS enabled with policies allowing authenticated users to perform all operations. These policies can be refined based on specific user roles and permissions.

**Current Policies:**
- Allow authenticated users to SELECT, INSERT, UPDATE, DELETE on all tables
- Future enhancement: Role-based access control (RBAC)

## Indexes Strategy

The database uses strategic indexing for optimal query performance:

1. **Primary Keys**: Automatic unique indexes on all UUID primary keys
2. **Foreign Keys**: Indexes on all foreign key columns for join performance
3. **Search Fields**: Indexes on frequently searched columns (names, emails)
4. **Date Fields**: Indexes on date columns for range queries and sorting
5. **Status Fields**: Indexes on status columns for filtering

## Data Integrity

The schema enforces data integrity through:

1. **CHECK Constraints**: Validate data ranges and formats
2. **NOT NULL Constraints**: Ensure required fields are provided
3. **UNIQUE Constraints**: Prevent duplicate data where appropriate
4. **FOREIGN KEY Constraints**: Maintain referential integrity
5. **Custom Constraints**: Business logic validation (e.g., subtotal calculation)

## Performance Considerations

1. **Pagination**: All search functions support pagination to handle large datasets
2. **Selective Queries**: Functions return only necessary columns
3. **Efficient Joins**: Optimized join patterns for related data
4. **Index Usage**: Strategic indexing for common query patterns
5. **Aggregate Caching**: Dashboard metrics can be cached for better performance

## Security Features

1. **RLS Policies**: Row-level security controls data access
2. **Input Validation**: Database-level validation prevents invalid data
3. **Parameterized Queries**: All functions use parameterized inputs
4. **Email Validation**: Regex-based email format validation
5. **Data Type Safety**: Strong typing prevents injection attacks
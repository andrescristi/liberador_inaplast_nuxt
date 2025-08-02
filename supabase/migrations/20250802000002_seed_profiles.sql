-- Seed data for testing profiles and user roles
-- Created: 2025-08-02
-- Description: Creates test users and profiles with different roles

-- First, we need to insert test users into auth.users
-- Note: In production, users would be created through the authentication flow
-- This is just for testing purposes

-- Create test admin user (you'll need to replace with actual user IDs from your auth.users table)
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES (
--   gen_random_uuid(),
--   'admin@inaplast.com',
--   crypt('admin123', gen_salt('bf')),
--   now(),
--   now(),
--   now()
-- );

-- Create sample profiles for existing users (if any)
-- This function will help create default profiles for existing users who don't have one
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Create profiles for any existing users without profiles
    FOR user_record IN 
        SELECT u.id, u.email 
        FROM auth.users u 
        LEFT JOIN public.profiles p ON u.id = p.user_id 
        WHERE p.user_id IS NULL
    LOOP
        INSERT INTO public.profiles (user_id, first_name, last_name, user_role)
        VALUES (
            user_record.id,
            'Usuario',
            'Demo',
            'Inspector'::profile_role
        );
    END LOOP;
END $$;

-- Example of how to create specific test profiles
-- You can uncomment and modify these after creating actual test users

-- Insert test profiles with different roles
-- These will be created automatically when users sign up, but we can also create them manually for testing

-- Admin user profile
-- INSERT INTO public.profiles (user_id, first_name, last_name, user_role)
-- SELECT id, 'Admin', 'Sistema', 'Admin'::profile_role
-- FROM auth.users 
-- WHERE email = 'admin@inaplast.com';

-- Supervisor user profile  
-- INSERT INTO public.profiles (user_id, first_name, last_name, user_role)
-- SELECT id, 'Supervisor', 'Inaplast', 'Supervisor'::profile_role
-- FROM auth.users 
-- WHERE email = 'supervisor@inaplast.com';

-- Inspector user profile
-- INSERT INTO public.profiles (user_id, first_name, last_name, user_role)
-- SELECT id, 'Inspector', 'Calidad', 'Inspector'::profile_role
-- FROM auth.users 
-- WHERE email = 'inspector@inaplast.com';

-- Add some sample data that demonstrates the role hierarchy
INSERT INTO public.customers (name, email, phone, address) VALUES
  ('Empresa Demo 1', 'demo1@example.com', '1234567890', 'Dirección Demo 1'),
  ('Empresa Demo 2', 'demo2@example.com', '0987654321', 'Dirección Demo 2')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.products (name, description, price, stock_quantity) VALUES
  ('Producto Demo 1', 'Descripción del producto demo 1', 99.99, 100),
  ('Producto Demo 2', 'Descripción del producto demo 2', 149.50, 50),
  ('Producto Demo 3', 'Descripción del producto demo 3', 75.25, 200)
ON CONFLICT DO NOTHING;

-- Add a sample order
DO $$
DECLARE
    customer_id UUID;
    product1_id UUID;
    product2_id UUID;
    order_id UUID;
BEGIN
    -- Get customer and product IDs
    SELECT id INTO customer_id FROM public.customers WHERE email = 'demo1@example.com';
    SELECT id INTO product1_id FROM public.products WHERE name = 'Producto Demo 1';
    SELECT id INTO product2_id FROM public.products WHERE name = 'Producto Demo 2';
    
    IF customer_id IS NOT NULL AND product1_id IS NOT NULL THEN
        -- Create sample order
        INSERT INTO public.orders (customer_id, status, total_amount)
        VALUES (customer_id, 'pending', 249.48)
        RETURNING id INTO order_id;
        
        -- Add order items
        INSERT INTO public.order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
          (order_id, product1_id, 1, 99.99, 99.99),
          (order_id, product2_id, 1, 149.50, 149.50);
    END IF;
END $$;
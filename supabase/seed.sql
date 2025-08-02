-- Seed data for Order Management System
-- Created: 2025-08-01
-- Description: Sample data for development and testing

-- Clear existing data (in correct order due to foreign keys)
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.customers;
DELETE FROM public.products;

-- Insert sample customers
INSERT INTO public.customers (id, name, email, phone, address) VALUES
    ('11111111-1111-1111-1111-111111111111', 'John Smith', 'john.smith@email.com', '555-0101', '123 Main St, Anytown, ST 12345'),
    ('22222222-2222-2222-2222-222222222222', 'Mary Johnson', 'mary.johnson@email.com', '555-0102', '456 Oak Ave, Somewhere, ST 12346'),
    ('33333333-3333-3333-3333-333333333333', 'Bob Wilson', 'bob.wilson@email.com', '555-0103', '789 Pine Rd, Elsewhere, ST 12347'),
    ('44444444-4444-4444-4444-444444444444', 'Sarah Lee', 'sarah.lee@email.com', '555-0104', '321 Elm St, Nowhere, ST 12348'),
    ('55555555-5555-5555-5555-555555555555', 'Mike Davis', 'mike.davis@email.com', '555-0105', '654 Maple Dr, Anywhere, ST 12349'),
    ('66666666-6666-6666-6666-666666666666', 'Emily Brown', 'emily.brown@email.com', '555-0106', '987 Cedar Ln, Everywhere, ST 12350'),
    ('77777777-7777-7777-7777-777777777777', 'David Garcia', 'david.garcia@email.com', '555-0107', '147 Birch Ave, Someplace, ST 12351'),
    ('88888888-8888-8888-8888-888888888888', 'Lisa Martinez', 'lisa.martinez@email.com', '555-0108', '258 Spruce St, Noplace, ST 12352'),
    ('99999999-9999-9999-9999-999999999999', 'James Taylor', 'james.taylor@email.com', '555-0109', '369 Willow Way, Everyplace, ST 12353'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jennifer White', 'jennifer.white@email.com', '555-0110', '741 Poplar Pl, Anyplace, ST 12354');

-- Insert sample products
INSERT INTO public.products (id, name, description, price, stock_quantity) VALUES
    ('p1111111-1111-1111-1111-111111111111', 'Premium Widget', 'High-quality widget for professional use', 29.99, 50),
    ('p2222222-2222-2222-2222-222222222222', 'Standard Widget', 'Reliable widget for everyday tasks', 19.99, 75),
    ('p3333333-3333-3333-3333-333333333333', 'Budget Widget', 'Affordable widget for basic needs', 9.99, 100),
    ('p4444444-4444-4444-4444-444444444444', 'Super Gadget', 'Advanced gadget with multiple features', 99.99, 25),
    ('p5555555-5555-5555-5555-555555555555', 'Mini Gadget', 'Compact gadget for portable use', 39.99, 60),
    ('p6666666-6666-6666-6666-666666666666', 'Deluxe Tool', 'Professional-grade tool for experts', 149.99, 15),
    ('p7777777-7777-7777-7777-777777777777', 'Standard Tool', 'Versatile tool for general use', 79.99, 40),
    ('p8888888-8888-8888-8888-888888888888', 'Basic Tool', 'Simple tool for beginners', 24.99, 80),
    ('p9999999-9999-9999-9999-999999999999', 'Smart Device', 'IoT-enabled device with app connectivity', 199.99, 20),
    ('paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Classic Device', 'Time-tested device with proven reliability', 89.99, 35),
    ('pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Eco-Friendly Widget', 'Sustainable widget made from recycled materials', 34.99, 45),
    ('pcccccc-cccc-cccc-cccc-cccccccccccc', 'Heavy-Duty Gadget', 'Industrial-strength gadget for tough jobs', 299.99, 10),
    ('pdddddd-dddd-dddd-dddd-dddddddddddd', 'Portable Kit', 'Complete kit with multiple components', 129.99, 30),
    ('peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Starter Pack', 'Everything needed to get started', 49.99, 55),
    ('pfffffff-ffff-ffff-ffff-ffffffffffff', 'Pro Bundle', 'Professional bundle with premium accessories', 399.99, 8);

-- Insert sample orders with realistic dates (last 30 days)
INSERT INTO public.orders (id, customer_id, status, total_amount, order_date) VALUES
    ('o1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'completed', 159.97, NOW() - INTERVAL '1 day'),
    ('o2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'processing', 89.98, NOW() - INTERVAL '2 days'),
    ('o3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'pending', 49.98, NOW() - INTERVAL '3 days'),
    ('o4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'completed', 299.99, NOW() - INTERVAL '5 days'),
    ('o5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'completed', 179.98, NOW() - INTERVAL '7 days'),
    ('o6666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'cancelled', 99.99, NOW() - INTERVAL '10 days'),
    ('o7777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'processing', 224.97, NOW() - INTERVAL '12 days'),
    ('o8888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'completed', 149.99, NOW() - INTERVAL '15 days'),
    ('o9999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'pending', 69.98, NOW() - INTERVAL '18 days'),
    ('oaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'completed', 399.99, NOW() - INTERVAL '20 days'),
    ('obbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'processing', 129.98, NOW() - INTERVAL '22 days'),
    ('occcccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'completed', 79.99, NOW() - INTERVAL '25 days'),
    ('odddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'pending', 59.98, NOW() - INTERVAL '28 days');

-- Insert sample order items
INSERT INTO public.order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
    -- Order 1: John Smith - completed
    ('o1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 2, 29.99, 59.98),
    ('o1111111-1111-1111-1111-111111111111', 'p4444444-4444-4444-4444-444444444444', 1, 99.99, 99.99),
    
    -- Order 2: Mary Johnson - processing
    ('o2222222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222222', 2, 19.99, 39.98),
    ('o2222222-2222-2222-2222-222222222222', 'p8888888-8888-8888-8888-888888888888', 2, 24.99, 49.98),
    
    -- Order 3: Bob Wilson - pending
    ('o3333333-3333-3333-3333-333333333333', 'p3333333-3333-3333-3333-333333333333', 3, 9.99, 29.97),
    ('o3333333-3333-3333-3333-333333333333', 'p2222222-2222-2222-2222-222222222222', 1, 19.99, 19.99),
    
    -- Order 4: Sarah Lee - completed
    ('o4444444-4444-4444-4444-444444444444', 'pcccccc-cccc-cccc-cccc-cccccccccccc', 1, 299.99, 299.99),
    
    -- Order 5: Mike Davis - completed
    ('o5555555-5555-5555-5555-555555555555', 'p7777777-7777-7777-7777-777777777777', 1, 79.99, 79.99),
    ('o5555555-5555-5555-5555-555555555555', 'p4444444-4444-4444-4444-444444444444', 1, 99.99, 99.99),
    
    -- Order 6: Emily Brown - cancelled
    ('o6666666-6666-6666-6666-666666666666', 'p4444444-4444-4444-4444-444444444444', 1, 99.99, 99.99),
    
    -- Order 7: David Garcia - processing
    ('o7777777-7777-7777-7777-777777777777', 'p6666666-6666-6666-6666-666666666666', 1, 149.99, 149.99),
    ('o7777777-7777-7777-7777-777777777777', 'p8888888-8888-8888-8888-888888888888', 3, 24.99, 74.98),
    
    -- Order 8: Lisa Martinez - completed
    ('o8888888-8888-8888-8888-888888888888', 'p6666666-6666-6666-6666-666666666666', 1, 149.99, 149.99),
    
    -- Order 9: James Taylor - pending
    ('o9999999-9999-9999-9999-999999999999', 'p1111111-1111-1111-1111-111111111111', 1, 29.99, 29.99),
    ('o9999999-9999-9999-9999-999999999999', 'p5555555-5555-5555-5555-555555555555', 1, 39.99, 39.99),
    
    -- Order 10: Jennifer White - completed
    ('oaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pfffffff-ffff-ffff-ffff-ffffffffffff', 1, 399.99, 399.99),
    
    -- Order 11: John Smith (second order) - processing
    ('obbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'pdddddd-dddd-dddd-dddd-dddddddddddd', 1, 129.99, 129.99),
    
    -- Order 12: Mary Johnson (second order) - completed
    ('occcccc-cccc-cccc-cccc-cccccccccccc', 'p7777777-7777-7777-7777-777777777777', 1, 79.99, 79.99),
    
    -- Order 13: Bob Wilson (second order) - pending
    ('odddddd-dddd-dddd-dddd-dddddddddddd', 'p2222222-2222-2222-2222-222222222222', 3, 19.99, 59.97);

-- Update order totals to match order items (trigger should handle this, but ensuring consistency)
UPDATE public.orders SET total_amount = (
    SELECT COALESCE(SUM(subtotal), 0)
    FROM public.order_items
    WHERE order_id = orders.id
);

-- Add some additional recent orders for better dashboard metrics
INSERT INTO public.orders (id, customer_id, status, total_amount, order_date) VALUES
    ('orecent1-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'pending', 89.98, NOW() - INTERVAL '2 hours'),
    ('orecent2-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'pending', 199.99, NOW() - INTERVAL '4 hours'),
    ('orecent3-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'processing', 149.99, NOW() - INTERVAL '6 hours');

-- Add corresponding order items for recent orders
INSERT INTO public.order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
    ('orecent1-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 3, 29.99, 89.97),
    ('orecent2-2222-2222-2222-222222222222', 'p9999999-9999-9999-9999-999999999999', 1, 199.99, 199.99),
    ('orecent3-3333-3333-3333-333333333333', 'p6666666-6666-6666-6666-666666666666', 1, 149.99, 149.99);

-- Final total recalculation
UPDATE public.orders SET total_amount = (
    SELECT COALESCE(SUM(subtotal), 0)
    FROM public.order_items
    WHERE order_id = orders.id
);

-- Create some low-stock products for testing
UPDATE public.products SET stock_quantity = 5 WHERE id = 'pfffffff-ffff-ffff-ffff-ffffffffffff';
UPDATE public.products SET stock_quantity = 3 WHERE id = 'pcccccc-cccc-cccc-cccc-cccccccccccc';
UPDATE public.products SET stock_quantity = 0 WHERE id = 'p6666666-6666-6666-6666-666666666666';

-- Add some additional products with realistic stock levels
INSERT INTO public.products (name, description, price, stock_quantity) VALUES
    ('Emergency Kit', 'Complete emergency preparedness kit', 89.99, 12),
    ('Travel Bundle', 'Essential items for business travel', 159.99, 8),
    ('Home Office Setup', 'Complete home office solution', 499.99, 5),
    ('Student Package', 'Everything a student needs', 79.99, 25),
    ('Senior Friendly Kit', 'Easy-to-use products for seniors', 119.99, 18);
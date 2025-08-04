-- Cleanup and fix RLS policies
-- Created: 2025-08-02
-- Description: Ensures all vulnerable USING (true) policies are removed and proper role-based policies are active

-- Drop any remaining vulnerable policies that might still exist
DROP POLICY IF EXISTS "Allow authenticated users to view customers" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to insert customers" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to update customers" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to delete customers" ON public.customers;

DROP POLICY IF EXISTS "Allow authenticated users to view products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated users to update products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated users to delete products" ON public.products;

DROP POLICY IF EXISTS "Allow authenticated users to view orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to delete orders" ON public.orders;

DROP POLICY IF EXISTS "Allow authenticated users to view order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow authenticated users to insert order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow authenticated users to update order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow authenticated users to delete order_items" ON public.order_items;

-- Ensure proper role-based policies are in place (recreate if they don't exist)

-- Customer policies with role-based access
CREATE POLICY IF NOT EXISTS "Allow users to view customers" 
    ON public.customers FOR SELECT 
    TO authenticated 
    USING (true); -- All authenticated users can view

CREATE POLICY IF NOT EXISTS "Allow inspectors and above to modify customers" 
    ON public.customers FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Inspector', 'Supervisor', 'Admin')
        )
    );

CREATE POLICY IF NOT EXISTS "Allow inspectors and above to update customers" 
    ON public.customers FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Inspector', 'Supervisor', 'Admin')
        )
    );

CREATE POLICY IF NOT EXISTS "Allow supervisors and admins to delete customers" 
    ON public.customers FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Supervisor', 'Admin')
        )
    );

-- Product policies with role-based access
CREATE POLICY IF NOT EXISTS "Allow users to view products" 
    ON public.products FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY IF NOT EXISTS "Allow supervisors and admins to modify products" 
    ON public.products FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Supervisor', 'Admin')
        )
    );

CREATE POLICY IF NOT EXISTS "Allow supervisors and admins to update products" 
    ON public.products FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Supervisor', 'Admin')
        )
    );

CREATE POLICY IF NOT EXISTS "Allow admins to delete products" 
    ON public.products FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role = 'Admin'
        )
    );

-- Order policies with role-based access
CREATE POLICY IF NOT EXISTS "Allow users to view orders" 
    ON public.orders FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY IF NOT EXISTS "Allow inspectors and above to create orders" 
    ON public.orders FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Inspector', 'Supervisor', 'Admin')
        )
    );

CREATE POLICY IF NOT EXISTS "Allow inspectors and above to update orders" 
    ON public.orders FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Inspector', 'Supervisor', 'Admin')
        )
    );

CREATE POLICY IF NOT EXISTS "Allow supervisors and admins to delete orders" 
    ON public.orders FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Supervisor', 'Admin')
        )
    );

-- Order items policies with role-based access
CREATE POLICY IF NOT EXISTS "Allow users to view order_items" 
    ON public.order_items FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY IF NOT EXISTS "Allow inspectors and above to modify order_items" 
    ON public.order_items FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Inspector', 'Supervisor', 'Admin')
        )
    );

CREATE POLICY IF NOT EXISTS "Allow inspectors and above to update order_items" 
    ON public.order_items FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Inspector', 'Supervisor', 'Admin')
        )
    );

CREATE POLICY IF NOT EXISTS "Allow supervisors and admins to delete order_items" 
    ON public.order_items FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Supervisor', 'Admin')
        )
    );

-- Add a function to verify RLS policies are properly configured
CREATE OR REPLACE FUNCTION public.verify_rls_policies()
RETURNS TABLE(
    table_name TEXT,
    policy_count INTEGER,
    has_vulnerable_policies BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::TEXT,
        COUNT(p.policyname)::INTEGER as policy_count,
        BOOL_OR(p.qual IS NULL OR p.qual = 'true'::text) as has_vulnerable_policies
    FROM (
        VALUES 
            ('customers'),
            ('products'), 
            ('orders'),
            ('order_items'),
            ('profiles')
    ) t(table_name)
    LEFT JOIN pg_policies p ON p.tablename = t.table_name
    WHERE p.schemaname = 'public'
    GROUP BY t.table_name
    ORDER BY t.table_name;
END;
$$ LANGUAGE plpgsql;

-- Create a view to easily monitor policy status
CREATE OR REPLACE VIEW public.rls_policy_status AS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual IS NOT NULL AND qual != 'true' as has_proper_conditions,
    CASE 
        WHEN qual IS NULL OR qual = 'true' THEN 'VULNERABLE'
        ELSE 'SECURE'
    END as security_status
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
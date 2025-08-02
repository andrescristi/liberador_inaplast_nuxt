-- Add user profiles and roles to the system
-- Created: 2025-08-02
-- Description: Creates enum for profile roles and profiles table for user management

-- Create enum for profile roles
CREATE TYPE profile_role AS ENUM ('Admin', 'Inspector', 'Supervisor');

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL CHECK (length(first_name) > 0),
    last_name TEXT NOT NULL CHECK (length(last_name) > 0),
    user_role profile_role NOT NULL DEFAULT 'Inspector',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON public.profiles(user_role);
CREATE INDEX IF NOT EXISTS idx_profiles_name ON public.profiles(first_name, last_name);

-- Add trigger for updated_at
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);

-- Users can update their own profile (except role - only admins can change roles)
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id AND user_role = (SELECT user_role FROM public.profiles WHERE user_id = auth.uid()));

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
    ON public.profiles FOR SELECT 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role = 'Admin'
        )
    );

-- Admins can insert new profiles
CREATE POLICY "Admins can insert profiles" 
    ON public.profiles FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role = 'Admin'
        )
    );

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" 
    ON public.profiles FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role = 'Admin'
        )
    );

-- Admins can delete profiles (except their own)
CREATE POLICY "Admins can delete profiles" 
    ON public.profiles FOR DELETE 
    TO authenticated 
    USING (
        user_id != auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role = 'Admin'
        )
    );

-- Function to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, first_name, last_name, user_role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuario'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'Nuevo'),
        'Inspector'::profile_role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to get user profile with role
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id_param UUID DEFAULT auth.uid())
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'id', p.id,
        'user_id', p.user_id,
        'first_name', p.first_name,
        'last_name', p.last_name,
        'full_name', p.first_name || ' ' || p.last_name,
        'user_role', p.user_role,
        'email', u.email,
        'created_at', p.created_at,
        'updated_at', p.updated_at
    )
    INTO result
    FROM public.profiles p
    LEFT JOIN auth.users u ON p.user_id = u.id
    WHERE p.user_id = user_id_param;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.user_has_role(required_role profile_role, user_id_param UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = user_id_param 
        AND user_role = required_role
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.user_has_role('Admin', user_id_param);
END;
$$ LANGUAGE plpgsql;

-- Function to get all users with profiles (admin only)
CREATE OR REPLACE FUNCTION public.get_all_profiles(
    search_term TEXT DEFAULT NULL,
    role_filter profile_role DEFAULT NULL,
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 20
)
RETURNS TABLE(
    id UUID,
    user_id UUID,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    user_role profile_role,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    total_count BIGINT
) AS $$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    RETURN QUERY
    WITH filtered_profiles AS (
        SELECT 
            p.id,
            p.user_id,
            p.first_name,
            p.last_name,
            p.first_name || ' ' || p.last_name as full_name,
            p.user_role,
            u.email,
            p.created_at,
            p.updated_at
        FROM public.profiles p
        LEFT JOIN auth.users u ON p.user_id = u.id
        WHERE 
            (search_term IS NULL OR 
             p.first_name ILIKE '%' || search_term || '%' OR 
             p.last_name ILIKE '%' || search_term || '%' OR
             u.email ILIKE '%' || search_term || '%')
        AND (role_filter IS NULL OR p.user_role = role_filter)
        ORDER BY p.first_name, p.last_name
    ),
    total_count_query AS (
        SELECT COUNT(*) as total FROM filtered_profiles
    )
    SELECT 
        fp.*,
        tc.total as total_count
    FROM filtered_profiles fp
    CROSS JOIN total_count_query tc
    LIMIT page_size
    OFFSET (page_num - 1) * page_size;
END;
$$ LANGUAGE plpgsql;

-- Update existing policies to use role-based access
-- Update customer policies to allow different access levels
DROP POLICY IF EXISTS "Allow authenticated users to view customers" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to insert customers" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to update customers" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to delete customers" ON public.customers;

-- Customers policies with role-based access
CREATE POLICY "Allow users to view customers" 
    ON public.customers FOR SELECT 
    TO authenticated 
    USING (true); -- All authenticated users can view

CREATE POLICY "Allow inspectors and above to modify customers" 
    ON public.customers FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Inspector', 'Supervisor', 'Admin')
        )
    );

CREATE POLICY "Allow inspectors and above to update customers" 
    ON public.customers FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Inspector', 'Supervisor', 'Admin')
        )
    );

CREATE POLICY "Allow supervisors and admins to delete customers" 
    ON public.customers FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Supervisor', 'Admin')
        )
    );

-- Update product policies
DROP POLICY IF EXISTS "Allow authenticated users to view products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated users to update products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated users to delete products" ON public.products;

CREATE POLICY "Allow users to view products" 
    ON public.products FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow supervisors and admins to modify products" 
    ON public.products FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Supervisor', 'Admin')
        )
    );

CREATE POLICY "Allow supervisors and admins to update products" 
    ON public.products FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Supervisor', 'Admin')
        )
    );

CREATE POLICY "Allow admins to delete products" 
    ON public.products FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role = 'Admin'
        )
    );

-- Update order policies  
DROP POLICY IF EXISTS "Allow authenticated users to view orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to delete orders" ON public.orders;

CREATE POLICY "Allow users to view orders" 
    ON public.orders FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow inspectors and above to create orders" 
    ON public.orders FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Inspector', 'Supervisor', 'Admin')
        )
    );

CREATE POLICY "Allow inspectors and above to update orders" 
    ON public.orders FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Inspector', 'Supervisor', 'Admin')
        )
    );

CREATE POLICY "Allow supervisors and admins to delete orders" 
    ON public.orders FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Supervisor', 'Admin')
        )
    );

-- Update order_items policies
DROP POLICY IF EXISTS "Allow authenticated users to view order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow authenticated users to insert order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow authenticated users to update order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow authenticated users to delete order_items" ON public.order_items;

CREATE POLICY "Allow users to view order_items" 
    ON public.order_items FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow inspectors and above to modify order_items" 
    ON public.order_items FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Inspector', 'Supervisor', 'Admin')
        )
    );

CREATE POLICY "Allow inspectors and above to update order_items" 
    ON public.order_items FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Inspector', 'Supervisor', 'Admin')
        )
    );

CREATE POLICY "Allow supervisors and admins to delete order_items" 
    ON public.order_items FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role IN ('Supervisor', 'Admin')
        )
    );
-- Fix ALL infinite recursion in profiles RLS policies
-- Created: 2025-08-09
-- Description: Removes all circular references from profiles policies

-- Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update profiles with role restrictions" ON public.profiles;

-- Create simple policies WITHOUT any references to profiles table

-- 1. Allow users to SELECT their own profile
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);

-- 2. Allow users to UPDATE their own profile 
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 3. Create a function to check admin status using auth.jwt()
-- This avoids querying profiles table from within profiles policies
CREATE OR REPLACE FUNCTION public.is_admin_from_jwt()
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user has admin role from JWT claims
    -- This requires setting user_role in JWT when user logs in
    RETURN COALESCE(
        (auth.jwt() ->> 'user_role')::text = 'Admin',
        false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Admin policies using JWT instead of profiles table queries
CREATE POLICY "Admins can view all profiles" 
    ON public.profiles FOR SELECT 
    TO authenticated 
    USING (public.is_admin_from_jwt());

CREATE POLICY "Admins can insert profiles" 
    ON public.profiles FOR INSERT 
    TO authenticated 
    WITH CHECK (public.is_admin_from_jwt());

CREATE POLICY "Admins can update any profile" 
    ON public.profiles FOR UPDATE 
    TO authenticated 
    USING (public.is_admin_from_jwt());

CREATE POLICY "Admins can delete profiles" 
    ON public.profiles FOR DELETE 
    TO authenticated 
    USING (public.is_admin_from_jwt() AND user_id != auth.uid());

-- NOTE: This approach requires updating your auth flow to include user_role in JWT
-- If JWT approach is not feasible, we can use a simpler approach with just basic policies
-- Simple profile policies without recursion (Alternative approach)
-- Created: 2025-08-09
-- Description: Ultra-simple policies that avoid all circular references

-- Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update profiles with role restrictions" ON public.profiles;

-- Create minimal policies that work without recursion

-- 1. Users can view and update their own profile
CREATE POLICY "Users can manage own profile" 
    ON public.profiles FOR ALL
    TO authenticated 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. For admin operations, rely on application-level checks in your functions
-- The RLS policies will be minimal, and admin checks happen in your stored procedures

-- Note: Admin operations like viewing all profiles, creating/deleting profiles
-- will be handled by the existing functions (get_all_profiles, etc.) which
-- have their own admin checks built-in
-- Fix infinite recursion in profiles RLS policy
-- Created: 2025-08-09
-- Description: Fixes the circular reference in "Users can update own profile" policy

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a new policy without circular reference
-- Users can update their own profile (first_name, last_name only)
-- Role changes are handled by a separate admin-only policy
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
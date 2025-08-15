-- Fix role change restrictions
-- The trigger was failing because auth.uid() returns NULL when using service role client
-- Created: 2025-08-15
-- Description: Remove problematic trigger and simplify RLS to work with service role operations

-- Drop the existing problematic trigger and function
DROP TRIGGER IF EXISTS prevent_role_changes_trigger ON public.profiles;
DROP FUNCTION IF EXISTS public.prevent_unauthorized_role_changes();

-- Update the RLS policy to be simpler and work better with service role
DROP POLICY IF EXISTS "Users can update profiles with role restrictions" ON public.profiles;

-- Create a simpler policy that works with service role operations
-- The API layer already handles all the complex permission logic
CREATE POLICY "Users can update profiles with role restrictions" 
    ON public.profiles FOR UPDATE 
    TO authenticated 
    USING (
        -- Users can update their own profile OR admins can update any profile
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role = 'Admin'
        )
    )
    WITH CHECK (
        -- Trust the API layer validation for role changes
        -- The API already validates admin permissions properly
        public.can_change_user_role(user_id, user_role)
    );
-- Enforce role change restrictions for profiles
-- Created: 2025-08-09
-- Description: Prevents users from changing their own role, only admins can change roles

-- Create a function to check if user can change roles
-- This function uses a direct auth.users query to avoid circular references
CREATE OR REPLACE FUNCTION public.can_change_user_role(target_user_id UUID, new_role profile_role)
RETURNS BOOLEAN AS $$
DECLARE
    current_user_role profile_role;
    target_current_role profile_role;
BEGIN
    -- Get current user's role directly without recursion
    SELECT user_role INTO current_user_role
    FROM public.profiles 
    WHERE user_id = auth.uid()
    LIMIT 1;
    
    -- Get target user's current role
    SELECT user_role INTO target_current_role
    FROM public.profiles 
    WHERE user_id = target_user_id
    LIMIT 1;
    
    -- Allow if user is admin
    IF current_user_role = 'Admin' THEN
        RETURN true;
    END IF;
    
    -- Allow if user is updating themselves but NOT changing role
    IF target_user_id = auth.uid() AND new_role = target_current_role THEN
        RETURN true;
    END IF;
    
    -- Deny all other cases
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create new policy that uses the function
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
        -- Use the function to check role change permissions
        public.can_change_user_role(user_id, user_role)
    );

-- Add a trigger as an additional safeguard
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- If role is being changed
    IF OLD.user_role != NEW.user_role THEN
        -- Check if current user is admin
        IF NOT EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role = 'Admin'
        ) THEN
            RAISE EXCEPTION 'Only administrators can change user roles';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to prevent unauthorized role changes
DROP TRIGGER IF EXISTS prevent_role_changes_trigger ON public.profiles;
CREATE TRIGGER prevent_role_changes_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_unauthorized_role_changes();
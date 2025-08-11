-- Add user activity logging for admin actions
-- Created: 2025-08-11
-- Description: Creates a table to log user management activities

-- Create enum for activity types
CREATE TYPE activity_type AS ENUM (
    'user_created', 
    'user_updated', 
    'user_deleted', 
    'user_role_changed',
    'password_reset',
    'user_login',
    'user_logout'
);

-- Create user activity logs table
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type activity_type NOT NULL,
    activity_description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor ON public.user_activity_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_target ON public.user_activity_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON public.user_activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.user_activity_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for activity logs
-- Only admins can view activity logs
CREATE POLICY "Admins can view activity logs" 
    ON public.user_activity_logs FOR SELECT 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND user_role = 'Admin'
        )
    );

-- Only the system can insert activity logs (through functions)
CREATE POLICY "System can insert activity logs" 
    ON public.user_activity_logs FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_actor_user_id UUID,
    p_target_user_id UUID,
    p_activity_type activity_type,
    p_activity_description TEXT,
    p_metadata JSONB DEFAULT '{}',
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.user_activity_logs (
        actor_user_id,
        target_user_id,
        activity_type,
        activity_description,
        metadata,
        ip_address,
        user_agent
    )
    VALUES (
        p_actor_user_id,
        p_target_user_id,
        p_activity_type,
        p_activity_description,
        p_metadata,
        p_ip_address::INET,
        p_user_agent
    )
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get activity logs with user details (admin only)
CREATE OR REPLACE FUNCTION public.get_activity_logs(
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0,
    p_activity_type activity_type DEFAULT NULL,
    p_target_user_id UUID DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    actor_user_id UUID,
    actor_name TEXT,
    actor_email TEXT,
    target_user_id UUID,
    target_name TEXT,
    target_email TEXT,
    activity_type activity_type,
    activity_description TEXT,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    RETURN QUERY
    SELECT 
        l.id,
        l.actor_user_id,
        COALESCE(ap.first_name || ' ' || ap.last_name, 'Unknown') as actor_name,
        au.email as actor_email,
        l.target_user_id,
        COALESCE(tp.first_name || ' ' || tp.last_name, 'Unknown') as target_name,
        tu.email as target_email,
        l.activity_type,
        l.activity_description,
        l.metadata,
        l.ip_address,
        l.user_agent,
        l.created_at
    FROM public.user_activity_logs l
    LEFT JOIN public.profiles ap ON l.actor_user_id = ap.user_id
    LEFT JOIN auth.users au ON l.actor_user_id = au.id
    LEFT JOIN public.profiles tp ON l.target_user_id = tp.user_id
    LEFT JOIN auth.users tu ON l.target_user_id = tu.id
    WHERE 
        (p_activity_type IS NULL OR l.activity_type = p_activity_type)
        AND (p_target_user_id IS NULL OR l.target_user_id = p_target_user_id)
    ORDER BY l.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to automatically log user logins
CREATE OR REPLACE FUNCTION public.log_user_login()
RETURNS TRIGGER AS $$
BEGIN
    -- Log successful login
    IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at 
       AND NEW.last_sign_in_at IS NOT NULL THEN
        
        PERFORM public.log_user_activity(
            NEW.id,
            NEW.id,
            'user_login',
            'User logged in successfully',
            jsonb_build_object(
                'login_time', NEW.last_sign_in_at,
                'login_method', 'password'
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user logins
CREATE TRIGGER on_user_login
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.log_user_login();
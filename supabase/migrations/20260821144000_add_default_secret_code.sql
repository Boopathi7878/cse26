-- Migration to seed default signup code MYADMIN2026 and grant admin privileges

-- 1. Insert default secret code MYADMIN2026
INSERT INTO public.signup_codes (code, is_active)
VALUES ('MYADMIN2026', true)
ON CONFLICT (code) DO UPDATE SET is_active = true;

-- 2. Update handle_new_user function to automatically assign admin role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  
  -- Assign admin role so new users can access the admin dashboard
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Assign default user role as well
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 3. Grant admin role retroactively to all existing registered users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;


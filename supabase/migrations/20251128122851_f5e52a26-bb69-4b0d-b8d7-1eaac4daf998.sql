-- Create signup codes table
CREATE TABLE public.signup_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.signup_codes ENABLE ROW LEVEL SECURITY;

-- Policies for signup_codes
CREATE POLICY "Signup codes are viewable by everyone"
ON public.signup_codes
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage signup codes"
ON public.signup_codes
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Add more fields to events table
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS organizer TEXT,
ADD COLUMN IF NOT EXISTS capacity INTEGER,
ADD COLUMN IF NOT EXISTS registration_link TEXT,
ADD COLUMN IF NOT EXISTS event_type TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add file attachments to resources table
ALTER TABLE public.resources
ADD COLUMN IF NOT EXISTS file_urls TEXT[];

-- Trigger for updated_at on signup_codes
CREATE TRIGGER update_signup_codes_updated_at
BEFORE UPDATE ON public.signup_codes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
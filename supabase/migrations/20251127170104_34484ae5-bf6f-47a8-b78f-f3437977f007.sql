-- Create faculty table for staff details
CREATE TABLE public.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT DEFAULT 'Computer Science & Engineering',
  image_url TEXT,
  email TEXT,
  phone TEXT,
  office_location TEXT,
  qualifications TEXT NOT NULL,
  experience_years INT,
  research_areas TEXT[],
  publications TEXT[],
  bio TEXT,
  linkedin_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on faculty
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

-- Faculty policies
CREATE POLICY "Faculty are viewable by everyone"
  ON public.faculty FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage faculty"
  ON public.faculty FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER set_updated_at_faculty
  BEFORE UPDATE ON public.faculty
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
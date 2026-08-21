-- Create storage bucket for faculty images
INSERT INTO storage.buckets (id, name, public)
VALUES ('faculty-images', 'faculty-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view faculty images (public bucket)
CREATE POLICY "Faculty images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'faculty-images');

-- Allow admins to upload faculty images
CREATE POLICY "Admins can upload faculty images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'faculty-images' AND has_role(auth.uid(), 'admin'));

-- Allow admins to update faculty images
CREATE POLICY "Admins can update faculty images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'faculty-images' AND has_role(auth.uid(), 'admin'));

-- Allow admins to delete faculty images
CREATE POLICY "Admins can delete faculty images"
ON storage.objects FOR DELETE
USING (bucket_id = 'faculty-images' AND has_role(auth.uid(), 'admin'));
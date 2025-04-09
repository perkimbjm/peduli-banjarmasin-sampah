
-- Create an enum for report status
CREATE TYPE report_status AS ENUM (
  'pending',
  'processing',
  'resolved',
  'rejected'
);

-- Create table for reports
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  status report_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolver_id UUID REFERENCES auth.users,
  resolution_notes TEXT
);

-- Create RLS policies
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Anyone can view reports
CREATE POLICY "Reports are viewable by everyone" 
ON public.reports FOR SELECT 
USING (true);

-- Only authenticated users can insert reports
CREATE POLICY "Authenticated users can create reports" 
ON public.reports FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports (except admin can update any)
CREATE POLICY "Users can update their own reports" 
ON public.reports FOR UPDATE 
TO authenticated 
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin')
);

-- Create table for report_images
CREATE TABLE public.report_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for images
ALTER TABLE public.report_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view report images
CREATE POLICY "Report images are viewable by everyone" 
ON public.report_images FOR SELECT 
USING (true);

-- Only authenticated users can insert images
CREATE POLICY "Authenticated users can add report images" 
ON public.report_images FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.reports 
    WHERE id = report_id AND user_id = auth.uid()
  )
);

-- Create storage bucket for report images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('report_images', 'report_images', true);

-- Allow public access to the bucket
CREATE POLICY "Report images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'report_images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload report images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'report_images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own report images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'report_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

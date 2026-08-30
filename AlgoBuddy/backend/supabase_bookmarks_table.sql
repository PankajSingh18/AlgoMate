-- Create bookmarks table for saving job listings
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, job_id)
);

-- Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Students can manage their own bookmarks"
ON public.bookmarks FOR ALL
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_bookmarks_student
ON public.bookmarks (student_id, created_at DESC);

-- Create applications table for one-click "Apply with Profile"
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    student_name TEXT,
    student_email TEXT,
    student_branch TEXT,
    student_cgpa TEXT,
    student_skills TEXT,
    student_resume_link TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, job_id)
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Students can view their own applications"
ON public.applications FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own applications"
ON public.applications FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_applications_student
ON public.applications (student_id, applied_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_job
ON public.applications (job_id);

-- Create jobs table for student job listings with full-text search support
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    description TEXT NOT NULL,
    skills TEXT,
    salary_range TEXT,
    job_type TEXT DEFAULT 'full-time',
    experience_level TEXT DEFAULT 'entry',
    status TEXT NOT NULL DEFAULT 'pending',
    posted_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_recruiter BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view approved jobs"
ON public.jobs FOR SELECT
USING (status = 'approved');

CREATE POLICY "Authenticated users can create jobs"
ON public.jobs FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own jobs"
ON public.jobs FOR UPDATE
USING (auth.uid() = posted_by);

-- Index for pagination and search
CREATE INDEX IF NOT EXISTS idx_jobs_status_created
ON public.jobs (status, created_at DESC);

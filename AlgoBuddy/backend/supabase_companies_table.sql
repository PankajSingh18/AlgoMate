-- Create companies table for company profile pages
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    location TEXT,
    industry TEXT,
    size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add company_id FK to existing jobs table
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view companies"
ON public.companies FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create companies"
ON public.companies FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own companies"
ON public.companies FOR UPDATE
USING (auth.uid() IN (
    SELECT posted_by FROM public.jobs WHERE public.jobs.company_id = id
));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_companies_name
ON public.companies (name);

CREATE INDEX IF NOT EXISTS idx_jobs_company_id
ON public.jobs (company_id);

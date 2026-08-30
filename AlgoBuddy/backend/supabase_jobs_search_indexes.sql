-- Enable pg_trgm extension for efficient ILIKE search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add trigram indexes for searchable columns on the jobs table
-- These enable index scans for ILIKE '%term%' and 'term%' queries
CREATE INDEX IF NOT EXISTS idx_jobs_title_trgm ON jobs USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_company_trgm ON jobs USING gin (company gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_location_trgm ON jobs USING gin (location gin_trgm_ops);

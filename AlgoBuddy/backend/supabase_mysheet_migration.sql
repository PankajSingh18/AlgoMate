-- Migration: Add visibility columns to my_sheet table
-- This enables the shared sheet feature with per-item privacy control

ALTER TABLE my_sheet ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE my_sheet ADD COLUMN IF NOT EXISTS shared_notes BOOLEAN NOT NULL DEFAULT false;

-- Allow authenticated users to view public items of any user
CREATE POLICY IF NOT EXISTS "Anyone can view public sheet items"
ON my_sheet FOR SELECT
USING (is_public = true);

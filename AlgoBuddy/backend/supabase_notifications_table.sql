-- Create notifications table for job alert notifications and application status updates
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    type TEXT NOT NULL DEFAULT 'new_job' CHECK (type IN ('new_job', 'application_status_update')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Students can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Students can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = student_id);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_notifications_student_read
ON public.notifications (student_id, read, created_at DESC);

-- Function to notify all students when a new approved job is posted
CREATE OR REPLACE FUNCTION public.notify_students_new_job()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (student_id, job_id, message, type)
  SELECT
    up.id AS student_id,
    NEW.id AS job_id,
    'New job posted: ' || NEW.title || ' at ' || NEW.company,
    'new_job'
  FROM auth.users up
  WHERE up.id <> '00000000-0000-0000-0000-000000000000';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run after a new job is inserted with approved status
DROP TRIGGER IF EXISTS on_job_approved_notify_students ON public.jobs;
CREATE TRIGGER on_job_approved_notify_students
AFTER INSERT ON public.jobs
FOR EACH ROW
WHEN (NEW.status = 'approved')
EXECUTE FUNCTION public.notify_students_new_job();

-- Migration: Add '2times' option to repeat_type constraint
-- This allows reminders to repeat every 12 hours (2 times per day)

-- Drop the existing check constraint
ALTER TABLE reminders DROP CONSTRAINT IF EXISTS reminders_repeat_type_check;

-- Add new check constraint with all valid repeat types including '2times'
ALTER TABLE reminders ADD CONSTRAINT reminders_repeat_type_check 
    CHECK (repeat_type IN ('once', 'daily', '2times', '3times'));

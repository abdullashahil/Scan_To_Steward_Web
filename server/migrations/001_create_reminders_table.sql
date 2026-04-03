-- Migration: Create reminders table for email notification system
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    medicine VARCHAR(255) NOT NULL,
    reminder_time TIMESTAMP NOT NULL,
    repeat_type VARCHAR(20) CHECK (repeat_type IN ('once', 'daily', '3times')),
    is_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries on pending reminders
CREATE INDEX IF NOT EXISTS idx_reminders_time_sent ON reminders(reminder_time, is_sent);

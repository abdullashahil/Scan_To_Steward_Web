"""
Reminder service for sending email notifications via Resend.
Handles CRUD operations and email generation.
"""
import os
import logging
from datetime import datetime, timedelta
from db import get_db, is_db_connected

logger = logging.getLogger(__name__)

# Initialize Resend
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
if RESEND_API_KEY:
    import resend
    resend.api_key = RESEND_API_KEY
    logger.info("Resend API initialized")
else:
    logger.warning("RESEND_API_KEY not set. Email sending will be disabled.")


def create_reminder(user_name: str, user_email: str, medicine: str, reminder_time: datetime, repeat_type: str = "once"):
    """Create a new reminder in the database."""
    if not is_db_connected():
        raise Exception("Database not connected")
    
    with get_db() as cursor:
        cursor.execute(
            """
            INSERT INTO reminders (user_name, user_email, medicine, reminder_time, repeat_type)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, user_name, user_email, medicine, reminder_time, repeat_type, is_sent, created_at;
            """,
            (user_name, user_email, medicine, reminder_time, repeat_type)
        )
        result = cursor.fetchone()
        logger.info(f"Created reminder: {result['id']} for {user_email}")
        return dict(result)

def delete_reminder(reminder_id: str):
    """Delete a reminder by ID."""
    if not is_db_connected():
        raise Exception("Database not connected")
    
    with get_db() as cursor:
        cursor.execute("DELETE FROM reminders WHERE id = %s RETURNING id;", (reminder_id,))
        result = cursor.fetchone()
        if result:
            logger.info(f"Deleted reminder: {reminder_id}")
            return True
        return False

def get_due_reminders(now: datetime):
    """Get reminders that are due and not yet sent."""
    if not is_db_connected():
        logger.warning("Database not connected, cannot fetch due reminders")
        return []
    
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set, skipping reminder check")
        return []
    
    with get_db() as cursor:
        cursor.execute(
            """
            SELECT * FROM reminders 
            WHERE is_sent = FALSE 
            AND reminder_time <= %s
            ORDER BY reminder_time;
            """,
            (now,)
        )
        results = cursor.fetchall()
        return [dict(row) for row in results]

def mark_as_sent(reminder_id: str):
    """Mark a reminder as sent."""
    if not is_db_connected():
        raise Exception("Database not connected")
    
    with get_db() as cursor:
        cursor.execute(
            "UPDATE reminders SET is_sent = TRUE WHERE id = %s;",
            (reminder_id,)
        )
        logger.info(f"Marked reminder as sent: {reminder_id}")

def reschedule_reminder(reminder):
    """Handle repeat logic for a reminder."""
    if not is_db_connected():
        raise Exception("Database not connected")
    
    repeat_type = reminder['repeat_type']
    current_time = reminder['reminder_time']
    
    if repeat_type == 'once':
        # Delete one-time reminders after sending
        delete_reminder(reminder['id'])
        logger.info(f"Deleted one-time reminder: {reminder['id']}")
        return None
    
    elif repeat_type == 'daily':
        new_time = current_time + timedelta(days=1)
    elif repeat_type == '3times':
        new_time = current_time + timedelta(hours=8)
    else:
        logger.warning(f"Unknown repeat type: {repeat_type}")
        return None
    
    with get_db() as cursor:
        cursor.execute(
            """
            UPDATE reminders 
            SET reminder_time = %s, is_sent = FALSE 
            WHERE id = %s
            RETURNING *;
            """,
            (new_time, reminder['id'])
        )
        result = cursor.fetchone()
        if result:
            logger.info(f"Rescheduled reminder: {reminder['id']} to {new_time}")
            return dict(result)
        return None

def generate_email_body(user_name: str, medicine: str) -> dict:
    """Generate email subject and body for a reminder."""
    subject = f"💊 Medicine Reminder: Time to take {medicine}"
    
    body = f"""Hi {user_name},

This is a friendly reminder to take your medicine:

🩺 Medicine: {medicine}
⏰ Time: {datetime.now().strftime('%I:%M %p')}

Stay healthy!

---
ScanToSteward Medicine Reminders
"""
    
    return {"subject": subject, "body": body}


def send_email(to_email: str, subject: str, body: str) -> bool:
    """Send an email using Resend API."""
    if not RESEND_API_KEY:
        logger.error("Cannot send email: RESEND_API_KEY not set")
        return False
    
    try:
        from_email = os.getenv("RESEND_FROM_EMAIL", "reminder@scantosteward.app")
        from_name = os.getenv("RESEND_FROM_NAME", "ScanToSteward")
        
        result = resend.Emails.send({
            "from": f"{from_name} <{from_email}>",
            "to": [to_email],
            "subject": subject,
            "text": body,
        })
        
        logger.info(f"Email sent to {to_email}: {result.get('id', 'unknown')}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False

def process_due_reminder(reminder: dict) -> bool:
    """Process a single due reminder: send email and handle repeat logic."""
    try:
        # Generate email
        email = generate_email_body(reminder['user_name'], reminder['medicine'])
        
        # Send email
        sent = send_email(reminder['user_email'], email['subject'], email['body'])
        
        if sent:
            # Mark as sent
            mark_as_sent(reminder['id'])
            
            # Handle repeat logic
            reschedule_reminder(reminder)
            return True
        else:
            logger.error(f"Failed to send reminder email for {reminder['id']}")
            return False
            
    except Exception as e:
        logger.error(f"Error processing reminder {reminder['id']}: {e}")
        return False

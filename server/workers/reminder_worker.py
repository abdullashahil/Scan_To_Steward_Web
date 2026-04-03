"""
Background worker for processing due reminders.
Checks every minute for reminders that need to be sent.
"""
import asyncio
import logging
from datetime import datetime
from services.reminder_service import get_due_reminders, process_due_reminder

logger = logging.getLogger(__name__)

# Worker control flag
_worker_running = False


async def reminder_worker():
    """
    Background worker that checks for due reminders every minute
    and sends email notifications.
    """
    global _worker_running
    _worker_running = True
    
    logger.info("Reminder worker started - checking every 60 seconds")
    
    while _worker_running:
        try:
            now = datetime.now()
            logger.debug(f"Checking for due reminders at {now}")
            
            # Fetch pending reminders
            reminders = get_due_reminders(now)
            
            if reminders:
                logger.info(f"Found {len(reminders)} due reminder(s) to process")
                
                for reminder in reminders:
                    try:
                        success = process_due_reminder(reminder)
                        if success:
                            logger.info(f"Successfully processed reminder: {reminder['id']}")
                        else:
                            logger.warning(f"Failed to process reminder: {reminder['id']}")
                    except Exception as e:
                        logger.error(f"Error processing reminder {reminder['id']}: {e}")
                        # Continue with next reminder
                        continue
            else:
                logger.debug("No due reminders found")
                
        except Exception as e:
            logger.error(f"Error in reminder worker loop: {e}")
        
        # Wait for 60 seconds before next check
        await asyncio.sleep(60)
    
    logger.info("Reminder worker stopped")


def stop_worker():
    """Stop the reminder worker gracefully."""
    global _worker_running
    _worker_running = False
    logger.info("Reminder worker stop signal sent")

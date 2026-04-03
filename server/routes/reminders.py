from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from services.reminder_service import create_reminder, delete_reminder
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/reminders", tags=["reminders"])


class CreateReminderRequest(BaseModel):
    user_name: str
    user_email: str
    medicine: str
    reminder_time: datetime
    repeat_type: Optional[str] = "once"


class ReminderResponse(BaseModel):
    id: str
    user_name: str
    user_email: str
    medicine: str
    reminder_time: datetime
    repeat_type: str
    is_sent: bool
    created_at: datetime


@router.post("/", response_model=ReminderResponse)
async def create_new_reminder(request: CreateReminderRequest):
    """
    Create a new medicine reminder.
    The reminder worker will automatically send emails when the time comes.
    """
    try:
        reminder = create_reminder(
            user_name=request.user_name,
            user_email=request.user_email,
            medicine=request.medicine,
            reminder_time=request.reminder_time,
            repeat_type=request.repeat_type or "once"
        )
        return ReminderResponse(**reminder)
    except Exception as e:
        logger.error(f"Error creating reminder: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{reminder_id}")
async def delete_existing_reminder(reminder_id: str):
    """
    Delete a reminder by ID.
    """
    try:
        deleted = delete_reminder(reminder_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Reminder not found")
        return {"message": "Reminder deleted successfully", "id": reminder_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting reminder: {e}")
        raise HTTPException(status_code=500, detail=str(e))

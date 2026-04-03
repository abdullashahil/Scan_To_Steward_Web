from routes.chat import router as chat_router
from routes.reminders import router as reminders_router
from routes.prescriptions import router as prescriptions_router

__all__ = ["chat_router", "reminders_router", "prescriptions_router"]

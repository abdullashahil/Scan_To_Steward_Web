import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables FIRST (before services that need them)
from dotenv import load_dotenv
load_dotenv()

from vector_store import load_vector_store, get_vector_store
from db import init_db, close_db, health_check as db_health_check

from workers.reminder_worker import reminder_worker, stop_worker
from routes import chat_router, reminders_router, prescriptions_router


# lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load FAISS index and DB
    try:
        load_vector_store("faiss_index")
        logger.info("Vector store loaded successfully")
    except Exception as e:
        logger.warning(f"Could not load vector store: {e}")
        logger.info("Run: python ingest.py to create the FAISS index")
    
    # Initialize database connection
    db_initialized = init_db()
    if db_initialized:
        logger.info("Database connected successfully")
    else:
        logger.warning("Database connection failed - continuing without DB")
    
    # Start reminder worker as background task
    # TEMPORARILY COMMENTED OUT
    worker_task = None
    if db_initialized and os.getenv("RESEND_API_KEY"):
        worker_task = asyncio.create_task(reminder_worker())
        logger.info("Reminder worker started")
    else:
        logger.warning("Reminder worker not started - missing DB or RESEND_API_KEY")
    logger.info("Reminder worker temporarily disabled")
    
    yield
    # Shutdown: cleanup
    if worker_task:
        stop_worker()
        worker_task.cancel()
        try:
            await worker_task
        except asyncio.CancelledError:
            pass
    close_db()
    logger.info("Shutting down...")


app = FastAPI(
    title="ScanToSteward API",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat_router)
app.include_router(reminders_router)
app.include_router(prescriptions_router)


@app.get("/")
async def root():
    return {"message": "Welcome to ScanToSteward API", "status": "running"}


@app.get("/health")
async def health_check():
    store = get_vector_store()
    db_status = db_health_check()
    return {
        "status": "healthy",
        "vector_store_loaded": store.is_initialized(),
        "database_connected": db_status["connected"],
    }

if __name__ == "__main__":
    import uvicorn
    # uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        workers=1
    )
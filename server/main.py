from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables FIRST (before services that need them)
from dotenv import load_dotenv
load_dotenv()

from vector_store import load_vector_store, get_vector_store

# OCR service
# from services.ocr_service import perform_ocr  # Replaced with vision model

# LLM service
from services.llm_service import (
    call_openrouter,
    call_openrouter_vision,
    build_summary_prompt,
    build_qa_prompt,
    generate_fallback_response,
)


# lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load FAISS index
    try:
        load_vector_store("faiss_index")
        logger.info("Vector store loaded successfully")
    except Exception as e:
        logger.warning(f"Could not load vector store: {e}")
        logger.info("Run: python ingest.py to create the FAISS index")
    yield
    # Shutdown: cleanup if needed
    logger.info("Shutting down...")


app = FastAPI(
    title="ScanToSteward API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for requests/responses
class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    sources: List[str]


class PrescriptionRequest(BaseModel):
    prescription_text: str


class PrescriptionResponse(BaseModel):
    analysis: str
    recommendations: List[str]
    sources: List[str]


class AnalyzePrescriptionResponse(BaseModel):
    extracted_text: str
    response: str
    sources: List[str]


@app.get("/")
async def root():
    return {"message": "Welcome to ScanToSteward API", "status": "running"}


@app.get("/health")
async def health_check():
    store = get_vector_store()
    return {
        "status": "healthy",
        "vector_store_loaded": store.is_initialized(),
    }


# ================== API ENDPOINTS ==================

@app.post("/chat", response_model=ChatResponse)
async def general_chat(request: ChatRequest):
    """
    General chatbot for antibiotic guidance.
    Uses RAG + LLM for intelligent responses based on hospital policy.
    """
    store = get_vector_store()
    if not store.is_initialized():
        raise HTTPException(status_code=503, detail="Vector store not initialized")
    
    # Retrieve relevant documents from knowledge base
    docs = store.similarity_search(request.message, k=3)
    sources = [doc.page_content[:200] + "..." for doc in docs]
    policy_context = "\n\n".join([doc.page_content for doc in docs])
    
    # Build LLM prompt for general antibiotic chat
    system_prompt = f"""You are ScanToSteward AI, an expert antibiotic guidance assistant.

CRITICAL RULE - MEDICAL AND HEALTH BASED ONLY:
You are a specialized medical AI assistant. You ONLY answer questions related to:
- Antibiotics and antimicrobial stewardship
- Prescriptions and medications
- Medical conditions and treatments
- Patient care and clinical pharmacy
- Hospital policies related to healthcare

If the user asks about ANYTHING outside these topics (e.g., weather, coding, sports, politics, general knowledge, entertainment), you MUST politely decline and say something like:
"I'm designed specifically to help with medical and prescription-related questions. I'd be happy to assist with any health, medication, or healthcare policy questions you have!"

Use the hospital antibiotic policy context to answer questions accurately.
If the context doesn't fully answer the question, provide general medical knowledge 
but indicate what was found in the policy vs. general knowledge.

Hospital Policy Context:
{policy_context}
"""
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": request.message}
    ]
    
    # Call LLM
    try:
        response = await call_openrouter(messages, temperature=0.4)
        return ChatResponse(
            response=response,
            sources=sources,
        )
    except Exception as e:
        logger.error(f"Chat LLM Error: {e}")
        # Fallback with retrieved context
        context_preview = policy_context[:500] if policy_context else "No relevant policy found."
        return ChatResponse(
            response=f"Based on the hospital antibiotic policy:\n\n{context_preview}...\n\n(Note: LLM service temporarily unavailable)",
            sources=sources,
        )


@app.post("/analyze-prescription", response_model=AnalyzePrescriptionResponse)
async def analyze_prescription(
    file: UploadFile = File(...),
    role: str = Form(...),
    message: Optional[str] = Form(None)
):
    """
    Enhanced prescription analyzer with Vision AI + RAG + LLM.
    Uses Gemini 2.5 Flash-Lite for image extraction instead of OCR.
    
    - If only file + role: generates a prescription summary/report
    - If message also provided: answers the follow-up question
    """
    # Validate role
    if role not in ["patient", "pharmacist"]:
        raise HTTPException(status_code=400, detail="Role must be 'patient' or 'pharmacist'")
    
    # Check vector store
    store = get_vector_store()
    if not store.is_initialized():
        raise HTTPException(status_code=503, detail="Vector store not initialized")
    
    # Step 1: Vision Extraction - Use Gemini 2.5 Flash-Lite to extract text from image
    try:
        extracted_text = await call_openrouter_vision(file)
    except Exception as e:
        logger.error(f"Vision extraction failed: {e}")
        return AnalyzePrescriptionResponse(
            extracted_text="",
            response="Could not extract text from the uploaded file. Please ensure the prescription image is clear and try again.",
            sources=[]
        )
    
    if not extracted_text or extracted_text.strip() == "":
        return AnalyzePrescriptionResponse(
            extracted_text="",
            response="Could not extract text from the uploaded file. Please ensure the prescription image is clear and try again.",
            sources=[]
        )
    
    # Step 2: Retrieval - Get relevant policy context
    query = f"antibiotic prescription analysis: {extracted_text}"
    logger.debug(f"Vector search query: {query[:100]}...")
    
    docs = store.similarity_search(query, k=5)
    logger.debug(f"Retrieved {len(docs)} documents from vector store")
    
    sources = [doc.page_content[:300] + "..." for doc in docs]
    policy_context = "\n\n".join([doc.page_content for doc in docs])
    logger.debug(f"Policy context: {policy_context}")
    
    # Step 3: LLM - Generate response
    try:
        if message and message.strip():
            # Q&A mode - answer the user's question
            messages = build_qa_prompt(extracted_text, message, role, policy_context)
        else:
            # Summary mode - generate prescription summary
            messages = build_summary_prompt(extracted_text, role, policy_context)
        
        llm_response = await call_openrouter(messages)
        
        return AnalyzePrescriptionResponse(
            extracted_text=extracted_text,
            response=llm_response,
            sources=sources,
        )
    except Exception as e:
        logger.error(f"LLM Error: {e}")
        # Fallback response if LLM fails
        fallback_response = generate_fallback_response(extracted_text, role, message)
        
        return AnalyzePrescriptionResponse(
            extracted_text=extracted_text,
            response=fallback_response,
            sources=sources,
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

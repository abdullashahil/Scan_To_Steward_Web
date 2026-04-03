from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List
from vector_store import get_vector_store
from services.llm_service import (
    call_openrouter,
    call_openrouter_vision,
    build_summary_prompt,
    generate_fallback_response,
)
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/analyze-prescription", tags=["prescriptions"])


class AnalyzePrescriptionResponse(BaseModel):
    extracted_text: str
    response: str
    sources: List[str]


@router.post("/", response_model=AnalyzePrescriptionResponse)
async def analyze_prescription(
    file: UploadFile = File(...),
    role: str = Form(...)
):
    """
    Enhanced prescription analyzer with Vision AI + RAG + LLM.
    Uses Gemini 2.5 Flash-Lite for image extraction.
    Generates a prescription summary/report only.
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

    # Step 3: LLM - Generate summary response
    try:
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
        fallback_response = generate_fallback_response(extracted_text, role)

        return AnalyzePrescriptionResponse(
            extracted_text=extracted_text,
            response=fallback_response,
            sources=sources,
        )

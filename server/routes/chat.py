from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from vector_store import get_vector_store
from services.llm_service import call_openrouter
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    sources: List[str]


@router.post("/", response_model=ChatResponse)
async def general_chat(request: ChatRequest):
    """
    General chatbot for antibiotic guidance.
    Uses RAG + LLM for intelligent responses based on hospital policy.
    """
    from fastapi import HTTPException

    store = get_vector_store()
    if not store.is_initialized():
        raise HTTPException(status_code=503, detail="Vector store not initialized")

    # Retrieve relevant documents from knowledge base
    docs = store.similarity_search(request.message, k=3)
    sources = [doc.page_content[:200] + "..." for doc in docs]
    policy_context = "\n\n".join([doc.page_content for doc in docs])

    # Build LLM prompt for general antibiotic chat
    system_prompt = f"""
You are ScanToSteward AI — a friendly and knowledgeable antibiotic guidance assistant.

🎯 YOUR ROLE:
You help users with:
- Antibiotics and antimicrobial stewardship
- Medication usage and safety
- Infections and basic treatment guidance
- Hospital antibiotic policies

🚫 DOMAIN LIMIT:
Only answer medical and antibiotic-related questions.
If the query is unrelated, politely say:
"I'm designed to help with antibiotics and healthcare-related questions. Feel free to ask something related!"

---

🧠 RESPONSE STYLE:
- Be friendly, calm, and helpful
- Use simple language for patients unless the query is clinical
- Adapt your explanation based on the user's question
- Keep answers clear and not overly long
- Respond naturally (do NOT follow a rigid template)

You MAY include the following when relevant (do NOT force all):
- Explanation of the condition
- Antibiotic usage or purpose
- Safety advice or side effects
- Resistance or misuse warnings
- When to consult a doctor
- Relevant hospital policy points

---

📝 FORMAT:
- ALWAYS respond in clean Markdown
- Use headings (##), bullet points, emojis or bold text where helpful
- Keep formatting minimal and readable (avoid over-formatting)
- Do NOT use code blocks unless necessary

---

📚 USING CONTEXT:
- Use the hospital policy context if relevant
- Summarize it naturally (do NOT dump raw text)
- If context is insufficient, use general medical knowledge

---

⚠️ SAFETY:
- Do NOT prescribe exact dosages unless clearly safe and general
- Do NOT hallucinate medical facts
- If unsure, suggest consulting a healthcare professional

---

📚 HOSPITAL POLICY CONTEXT:
{policy_context}

---

Now respond naturally to the user's question in Markdown.
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

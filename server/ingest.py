"""
Ingestion script for RAG system.
Run once to process PDF and create FAISS index.
Usage: python ingest.py
"""

import os
import logging
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def ingest_pdfs(
    pdf_paths: list[str],
    output_dir: str = "faiss_index",
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
) -> None:
    """
    Load multiple PDFs, split into chunks, generate embeddings, and save FAISS index.
    
    Args:
        pdf_paths: List of paths to PDF files
        output_dir: Directory to save the FAISS index
        chunk_size: Size of text chunks
        chunk_overlap: Overlap between chunks
    """
    all_documents = []
    
    for pdf_path in pdf_paths:
        logger.info(f"Loading PDF: {pdf_path}")
        # Load PDF
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        # Add source metadata
        for doc in documents:
            doc.metadata["source"] = pdf_path
        all_documents.extend(documents)
        logger.info(f"Loaded {len(documents)} pages from {pdf_path}")
    
    logger.info(f"Total documents loaded: {len(all_documents)}")
    
    # Split into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = text_splitter.split_documents(all_documents)
    logger.info(f"Split into {len(chunks)} chunks")
    
    # Initialize embeddings (free HuggingFace model)
    logger.info("Initializing embeddings model...")
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )
    
    # Create FAISS vector store
    logger.info("Creating FAISS index...")
    vectorstore = FAISS.from_documents(chunks, embeddings)
    
    # Save index to disk
    os.makedirs(output_dir, exist_ok=True)
    vectorstore.save_local(output_dir)
    logger.info(f"FAISS index saved to: {output_dir}")
    logger.info("Ingestion complete!")


if __name__ == "__main__":
    # Paths to PDF files to ingest
    pdf_files = [
        "data/antibiotic_policy_2024.pdf",
        "data/WHO_antibiotic_policy.pdf",
    ]
    
    ingest_pdfs(pdf_files)

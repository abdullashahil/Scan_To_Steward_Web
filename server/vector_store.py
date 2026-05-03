"""
Vector store loader module for FastAPI app.
Provides functions to load and query the FAISS index.
"""

from typing import List, Optional
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document


class VectorStore:
    """Singleton wrapper for FAISS vector store."""
    
    _instance: Optional["VectorStore"] = None
    _vectorstore: Optional[FAISS] = None
    _embeddings: Optional[HuggingFaceEmbeddings] = None
    
    def __new__(cls) -> "VectorStore":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def _get_embeddings(self) -> HuggingFaceEmbeddings:
        """Lazy load embeddings model only when needed."""
        if self._embeddings is None:
            self._embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2",
                model_kwargs={"device": "cpu"},
                encode_kwargs={"normalize_embeddings": True},
            )
        return self._embeddings

    def initialize(self, index_path: str = "faiss_index") -> None:
        """
        Load FAISS index from disk.
        Call this once at app startup.
        
        Args:
            index_path: Path to the saved FAISS index directory
        """
        if self._vectorstore is not None:
            return  # Already initialized
        
        # Load FAISS index from disk (embeddings loaded lazily on first search)
        self._vectorstore = FAISS.load_local(
            index_path,
            self._get_embeddings(),
            allow_dangerous_deserialization=True,
        )
    
    def is_initialized(self) -> bool:
        """Check if vector store is loaded."""
        return self._vectorstore is not None
    
    def similarity_search(
        self,
        query: str,
        k: int = 5,
        filter_dict: Optional[dict] = None,
    ) -> List[Document]:
        """
        Search for similar documents in the vector store.
        
        Args:
            query: Search query string
            k: Number of results to return
            filter_dict: Optional metadata filter
            
        Returns:
            List of Document objects
        """
        if self._vectorstore is None:
            raise RuntimeError("Vector store not initialized. Call initialize() first.")
        
        return self._vectorstore.similarity_search(
            query,
            k=k,
            filter=filter_dict,
        )
    
    def similarity_search_with_score(
        self,
        query: str,
        k: int = 5,
    ) -> List[tuple[Document, float]]:
        """
        Search with similarity scores (lower score = more similar).
        
        Args:
            query: Search query string
            k: Number of results to return
            
        Returns:
            List of (Document, score) tuples
        """
        if self._vectorstore is None:
            raise RuntimeError("Vector store not initialized. Call initialize() first.")
        
        return self._vectorstore.similarity_search_with_score(query, k=k)


# Global instance for import
def get_vector_store() -> VectorStore:
    """Get the singleton VectorStore instance."""
    return VectorStore()


def load_vector_store(index_path: str = "faiss_index") -> VectorStore:
    """
    Convenience function to initialize and return vector store.
    Use this in FastAPI startup event.
    
    Args:
        index_path: Path to FAISS index directory
        
    Returns:
        Initialized VectorStore instance
    """
    store = get_vector_store()
    store.initialize(index_path)
    return store

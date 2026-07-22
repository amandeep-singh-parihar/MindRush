import numpy as np
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from core.config import GEMINI_API_KEY


class EmbeddingManager:
    def __init__(self, model_name: str = "models/gemini-embedding-001"):
        self.model_name = model_name
        if GEMINI_API_KEY:
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model=self.model_name,
                google_api_key=GEMINI_API_KEY,
            )
        else:
            self.embeddings = None

    def generate_embeddings(self, texts: list[str]) -> list[np.ndarray]:
        """Encode a list of text strings into embedding vectors via Google Gemini API."""
        if not self.embeddings:
            raise ValueError(
                "GEMINI_API_KEY is not set in environment variables. Cannot generate embeddings."
            )
        vectors = self.embeddings.embed_documents(texts)
        return [np.array(vec) for vec in vectors]


# Shared singleton — loaded once at startup
embedding_manager = EmbeddingManager()


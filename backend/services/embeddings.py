from sentence_transformers import SentenceTransformer


class EmbeddingManager:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = SentenceTransformer(self.model_name)

    def generate_embeddings(self, texts: list[str]):
        """Encode a list of text strings into embedding vectors."""
        return self.model.encode(texts)


# Shared singleton — loaded once at startup
embedding_manager = EmbeddingManager()

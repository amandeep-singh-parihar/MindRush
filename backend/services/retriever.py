from services.vector_store import VectorStoreManager
from services.embeddings import EmbeddingManager


class RAGRetriever:
    def __init__(
        self, embedding_manager: EmbeddingManager, vector_store: VectorStoreManager
    ):
        self.embedding_manager = embedding_manager
        self.vector_store = vector_store

    def retrieve(
        self, query: str, top_k: int = 3, score_thres: float = 0.0
    ) -> list[dict]:
        """Embed the query and return the top-k most similar chunks."""
        query_embedding = self.embedding_manager.generate_embeddings([query])[0]

        results = self.vector_store.collection.query(
            query_embeddings=[query_embedding.tolist()], n_results=top_k
        )

        retrieved = []
        if results["documents"] and results["documents"][0]:
            for i, (doc_id, metadata, distance, document) in enumerate(
                zip(
                    results["ids"][0],
                    results["metadatas"][0],
                    results["distances"][0],
                    results["documents"][0],
                )
            ):
                similarity_score = 1 - distance
                if similarity_score > score_thres:
                    retrieved.append(
                        {
                            "id": doc_id,
                            "document": document,
                            "metadata": metadata,
                            "distance": distance,
                            "similarity_score": similarity_score,
                            "rank": i + 1,
                        }
                    )
        else:
            print("No documents found in vector store.")

        return retrieved

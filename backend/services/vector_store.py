import os
import uuid
import chromadb


class VectorStoreManager:
    def __init__(
        self,
        persist_directory: str = os.path.join(
            os.path.dirname(__file__), "..", "chroma_db"
        ),
        collection_name: str = "pdf_document",
        use_memory: bool = False,
    ):
        self.collection_name = collection_name
        self.persist_directory = persist_directory
        self.use_memory = use_memory
        self.collection = None
        self.client = None
        self._initialize_store()

    def _initialize_store(self):
        if self.use_memory:
            # Ephemeral — lives only in RAM, discarded when the request ends.
            self.client = chromadb.Client()
        else:
            os.makedirs(self.persist_directory, exist_ok=True)
            self.client = chromadb.PersistentClient(path=self.persist_directory)

        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"description": "vector store collection for pdfs"},
        )

    def get_all_documents(self) -> list[str]:
        """Fetch every chunk in this collection (used for whole-doc quiz generation)."""
        result = self.collection.get(include=["documents"])
        return result["documents"] if result and result["documents"] else []

    def add_documents(self, documents, embeddings) -> None:
        """Store document chunks with their embeddings."""
        if len(documents) != len(embeddings):
            raise ValueError("Number of documents does not match number of embeddings.")

        ids, all_metadata, documents_content, embeddings_list = [], [], [], []

        for i, (doc, embedding) in enumerate(zip(documents, embeddings)):
            ids.append(f"doc_{uuid.uuid4()}")

            metadata = dict(doc.metadata)
            metadata["doc_index"] = i
            metadata["content_length"] = len(doc.page_content)
            all_metadata.append(metadata)

            documents_content.append(doc.page_content)
            embeddings_list.append(embedding.tolist())

        self.collection.add(
            ids=ids,
            metadatas=all_metadata,
            documents=documents_content,
            embeddings=embeddings_list,
        )


def create_session_store(session_id: str) -> VectorStoreManager:
    """Create an isolated in-memory VectorStoreManager for a single quiz session.
    Uses chromadb.Client() (ephemeral) so nothing is written to disk —
    avoids accumulating thousands of abandoned collections under chroma_db/.
    """
    collection_name = f"session_{session_id.replace('-', '_')}"
    return VectorStoreManager(collection_name=collection_name, use_memory=True)

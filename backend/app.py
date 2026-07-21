from fastapi import FastAPI, Form, File, UploadFile, HTTPException
from pydantic import BaseModel
from langchain_core.documents import Document
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.document_loaders.text import TextLoader
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import tempfile
import os
import uuid
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import chromadb
from sklearn.metrics.pairwise import cosine_similarity
from langchain_groq import ChatGroq

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Ingestion Pipeline


# document loader
def load_pdf(filePath: str):
    loader = PyMuPDFLoader(filePath)
    return loader.load()


# chunking
def split_docs(document, chunk_size=500, chunk_overlap=50):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    chunked_doc = text_splitter.split_documents(document)
    return chunked_doc


# embeddings
class EmbeddingManager:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = SentenceTransformer(self.model_name)

    def generate_embeddings(self, text):
        embeddings = self.model.encode(text)
        return embeddings


# initilize embedding manager
embedding_manager = EmbeddingManager()


# vector Store
class VectorStoreManager:
    def __init__(
        self,
        persist_directory=os.path.join(os.path.dirname(__file__), "chroma_db"),
        collection_name="pdf_document",
    ):
        self.collection_name = collection_name
        self.persist_directory = persist_directory
        self.collection = None
        self.client = None

        self._initialize_store()

    # initilize the store
    def _initialize_store(self):
        os.makedirs(self.persist_directory, exist_ok=True)
        self.client = chromadb.PersistentClient(path=self.persist_directory)

        # create the collection
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"description": "vector store collection for pdfs"},
        )

    # add document
    def add_documents(self, documents, embeddings):
        if len(documents) != len(embeddings):
            raise ValueError("num of documents does not match num of embeddings")

        ids = []
        all_metadata = []
        documents_content = []
        embeddings_list = []

        for i, (doc, embedding) in enumerate(zip(documents, embeddings)):
            doc_id = f"doc_{uuid.uuid4()}"

            ids.append(doc_id)

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


# Retrieval pipeline
class RAGRetriever:
    def __init__(self, embedding_manager, vector_store):
        self.embedding_manager = embedding_manager
        self.vector_store = vector_store

    def retrieve(self, query, top_k=3, score_thres=0.0):
        # query -> embeddings
        query_embeddings = self.embedding_manager.generate_embeddings([query])[0]

        # semantic search
        results = self.vector_store.collection.query(
            query_embeddings=[query_embeddings.tolist()], n_results=top_k
        )

        # cosine similarity
        retrived_documents = []
        if results["documents"] and results["documents"][0]:
            ids = results["ids"][0]
            metadatas = results["metadatas"][0]
            distances = results["distances"][0]
            documents = results["documents"][0]

            for i, (doc_id, metadata, distance, document) in enumerate(
                zip(ids, metadatas, distances, documents)
            ):
                similarity_score = 1 - distance

                if similarity_score > score_thres:
                    retrived_documents.append(
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
            print("No documents found!!!")

        return retrived_documents


def create_session_store(session_id: str) -> VectorStoreManager:
    """Create an isolated VectorStoreManager for the given session."""
    collection_name = f"session_{session_id.replace('-', '_')}"
    return VectorStoreManager(collection_name=collection_name)


# Integrating LLM

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="openai/gpt-oss-120b",
    temperature=0.1,
    max_tokens=1024,
)

# Generate


def generate_output(query, retriever, llm, questions_count, difficulty, top_k=3):
    results = retriever.retrieve(query, top_k)

    context = ""

    if results:
        for doc in results:
            context += doc["document"]
            context += "\n"

    prompt = f""" You are a Quiz Generator. Create {questions_count} {difficulty} multiple choice questions based on the provided context. 
                Generate a JSON object with a single key "questions" which contains a list of {questions_count} questions. Each question should have "question", "options" (list of 4 strings), and "answer" (string) keys. Do not include any extra text outside the JSON object. 
                Context: {context} 
                Query: {query} 
                output should be a JSON """

    response = llm.invoke(prompt)
    return response.content


class QuizRequest(BaseModel):
    text_or_pdf: str
    difficulty: str
    questions_count: int


@app.post("/generate-quiz")
async def generate_quiz(
    input_type: str = Form(...),
    difficulty: str = Form(...),
    questions_count: int = Form(...),
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
):
    print(f"Received input_type: {input_type}")
    print(f"Received difficulty: {difficulty}")
    print(f"Received questions_count: {questions_count}")
    print(f"Received text: {text}")
    print(f"Received pdf: {file}")

    # Each request gets its own isolated collection — no cross-user contamination
    session_id = str(uuid.uuid4())
    vector_store = create_session_store(session_id)
    rag_retriever = RAGRetriever(embedding_manager, vector_store)

    if input_type == "pdf" and file:
        print(f"Processing pdf file: {file.filename}")

        # Ensure temp directory exists
        temp_dir = os.path.join(os.path.dirname(__file__), "temp")
        os.makedirs(temp_dir, exist_ok=True)

        # Unique UUID filename prevents collisions in multi-user environments
        unique_filename = f"{uuid.uuid4()}.pdf"
        temp_path = os.path.join(temp_dir, unique_filename)

        try:
            # Save file temporarily
            with open(temp_path, "wb") as f:
                f.write(await file.read())

            print(f"PDF saved to temp file: {temp_path}")

            # PyMuPDF processing will happen here
            pdf_doc = load_pdf(temp_path)
            print(pdf_doc)

            # data => documents => chunks => embeddings => store in vector store
            chunks = split_docs(pdf_doc)
            texts = []
            for doc in chunks:
                texts.append(doc.page_content)

            embedding = embedding_manager.generate_embeddings(texts)

            vector_store.add_documents(chunks, embedding)

            return {
                "status": "success",
                "message": f"Successfully processed '{file.filename}'",
                "session_id": session_id,
            }
        finally:
            # Always clean up and delete the temp file immediately after processing
            if os.path.exists(temp_path):
                # os.remove(temp_path)
                print(f"Cleaned up temp file: {temp_path}")

    elif input_type == "text" and text:
        doc = Document(
            page_content=text,
            metadata={"source": "user_input", "doc_index": str(uuid.uuid4())},
        )

        chunks = split_docs([doc])
        texts = []
        for doc in chunks:
            texts.append(doc.page_content)

        embedding = embedding_manager.generate_embeddings(texts)

        vector_store.add_documents(chunks, embedding)
        print("vector store updated successfully")

        return {
            "status": "success",
            "message": "Text received successfully!",
            "session_id": session_id,
            "text": text,
        }
    else:
        return {"status": "error", "message": "No valid text or PDF file received!"}

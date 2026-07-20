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
def split_docs(document, chunk_size = 500, chunk_overlap = 50):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size = chunk_size, chunk_overlap = chunk_overlap)
    chunked_doc = text_splitter.split_documents(document)
    return chunked_doc

# embeddings
class EmbeddingManager:
    def __init__(self, model_name = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = SentenceTransformer(self.model_name)

    def generate_embeddings(self, text):
        embeddings = self.model.encode(text)
        return embeddings


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

            return {
                "status": "success",
                "message": f"Successfully processed '{file.filename}'",
            }
        finally:
            # Always clean up and delete the temp file immediately after processing
            if os.path.exists(temp_path):
                # os.remove(temp_path)
                print(f"Cleaned up temp file: {temp_path}")

    elif input_type == "text" and text:
        print(f"Processing text: {text[:30]}...")
        return {
            "status": "success",
            "message": "Text received successfully!",
            "text": text,
        }
    else:
        return {"status": "error", "message": "No valid text or PDF file received!"}

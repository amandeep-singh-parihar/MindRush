import os
import uuid
from typing import Optional

from fastapi import FastAPI, Form, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.documents import Document

from core.config import ALLOW_ORIGINS
from core.llm import llm, gemini_llm
from models.schemas import QuizRequest
from services.ingestion import load_pdf, split_docs
from services.embeddings import embedding_manager
from services.vector_store import create_session_store
from services.retriever import RAGRetriever
from services.quiz import generate_output, generate_output_from_topic

# ─── App Setup ────────────────────────────────────────────────────────────────

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routes ───────────────────────────────────────────────────────────────────


@app.post("/generate-quiz")
async def generate_quiz(
    input_type: str = Form(...),
    difficulty: str = Form(...),
    questions_count: int = Form(...),
    topic: Optional[str] = Form(None),
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
):
    # Each request gets its own isolated in-memory collection — no cross-user contamination
    session_id = str(uuid.uuid4())

    if input_type == "topic" and topic:
        try:
            quiz = generate_output_from_topic(
                topic, gemini_llm, questions_count, difficulty
            )
        except ValueError as e:
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail="Our servers are facing high traffic, please try after some time.",
            )

        return {"status": "success", "session_id": session_id, "quiz": quiz}

    elif input_type == "pdf" and file:
        vector_store = create_session_store(session_id)
        temp_dir = os.path.join(os.path.dirname(__file__), "temp")
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, f"{uuid.uuid4()}.pdf")

        try:
            with open(temp_path, "wb") as f:
                f.write(await file.read())

            pdf_doc = load_pdf(temp_path)
            chunks = split_docs(pdf_doc)
            texts = [doc.page_content for doc in chunks]
            embeddings = embedding_manager.generate_embeddings(texts)
            vector_store.add_documents(chunks, embeddings)

            retriever = RAGRetriever(
                embedding_manager=embedding_manager, vector_store=vector_store
            )

            try:
                quiz = generate_output(
                    vector_store, retriever, llm, questions_count, difficulty
                )
            except ValueError as e:
                raise HTTPException(status_code=500, detail=str(e))
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail="Our servers are facing high traffic, please try after some time.",
                )

            return {"status": "success", "session_id": session_id, "quiz": quiz}

        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    elif input_type == "text" and text:
        vector_store = create_session_store(session_id)
        doc = Document(
            page_content=text,
            metadata={"source": "user_input", "doc_index": str(uuid.uuid4())},
        )
        chunks = split_docs([doc])
        texts = [doc.page_content for doc in chunks]
        embeddings = embedding_manager.generate_embeddings(texts)
        vector_store.add_documents(chunks, embeddings)

        retriever = RAGRetriever(
            embedding_manager=embedding_manager, vector_store=vector_store
        )
        try:
            quiz = generate_output(
                vector_store, retriever, llm, questions_count, difficulty
            )
        except ValueError as e:
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail="Our servers are facing high traffic, please try after some time.",
            )

        return {"status": "success", "session_id": session_id, "quiz": quiz}

    else:
        raise HTTPException(
            status_code=400, detail="No valid topic, text, or PDF file received!"
        )

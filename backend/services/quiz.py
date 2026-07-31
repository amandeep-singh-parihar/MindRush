import re
from typing import List

from pydantic import BaseModel
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate

from services.vector_store import VectorStoreManager
from services.retriever import RAGRetriever

MAX_CONTEXT_CHARS = 4000


# ── Pydantic schemas ──────────────────────────────────────────────────────────


class Question(BaseModel):
    question: str
    options: List[str]
    answer: str


class Quiz(BaseModel):
    questions: List[Question]


class Topics(BaseModel):
    topics: List[str]


# ── Helper: strip markdown code fences ────────────────────────────────────────


def _strip_code_fences(text: str) -> str:
    """Remove ```json ... ``` fences that LLMs sometimes wrap around output."""
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text


# ── Quiz generation from uploaded documents ───────────────────────────────────


def generate_output(
    vector_store: VectorStoreManager,
    retriever: RAGRetriever,
    llm,
    questions_count: int,
    difficulty: str,
) -> dict:
    """Fetch all chunks from the session collection and ask the LLM to generate MCQs."""
    all_docs = vector_store.get_all_documents()

    if not all_docs:
        raise ValueError("No documents found in the collection.")

    combined_docs = "\n".join(all_docs)

    topics = extract_topics_from_docs(combined_docs, llm)

    topic_context = []

    for topic in topics:
        retrieved_docs = retriever.retrieve(query=topic, top_k=3)
        text_chunks = [doc["document"] for doc in retrieved_docs if "document" in doc]

        if text_chunks:
            topic_text = "\n".join(text_chunks)
            topic_context.append(f"--- Topic: {topic} ---\n{topic_text}")

    context = "\n\n".join(topic_context) if topic_context else combined_docs

    if len(context) > MAX_CONTEXT_CHARS:
        context = context[:MAX_CONTEXT_CHARS] + "\n...[context truncated]"

    # ~150 tokens per MCQ (question + 4 options + answer) with a safe floor
    max_tokens = max(1024, questions_count * 150)

    parser = PydanticOutputParser(pydantic_object=Quiz)

    prompt = PromptTemplate(
        template=(
            "You are a Quiz Generator. Generate {questions_count} questions "
            "of {difficulty} difficulty based on the context provided.\n\n"
            "Context:\n{context}\n\n"
            "{format_instructions}"
        ),
        input_variables=["questions_count", "difficulty", "context"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )

    try:
        formatted = prompt.format(
            questions_count=questions_count,
            difficulty=difficulty,
            context=context,
        )
        response = llm.invoke(formatted, config={"max_tokens": max_tokens})
        raw = _strip_code_fences(response.content.strip())
        quiz = parser.parse(raw)
        return quiz.model_dump()
    except Exception as e:
        print("Quiz generation API error:", e)
        raise ValueError(
            "Our servers are facing high traffic, please try after some time."
        )


# ── Quiz generation from a plain topic string ────────────────────────────────


def generate_output_from_topic(
    topic: str, llm, questions_count: int, difficulty: str
) -> dict:
    """Generate multiple choice questions directly based on a topic string."""
    if not llm:
        raise ValueError(
            "Gemini LLM is not initialized. "
            "Please ensure GEMINI_API_KEY is set in your .env file."
        )

    max_tokens = max(1024, questions_count * 150)

    parser = PydanticOutputParser(pydantic_object=Quiz)

    prompt = PromptTemplate(
        template=(
            "You are an expert Quiz Generator. Create {questions_count} "
            '{difficulty} multiple choice questions on the topic: "{topic}".\n\n'
            "{format_instructions}"
        ),
        input_variables=["questions_count", "difficulty", "topic"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )

    try:
        formatted = prompt.format(
            questions_count=questions_count,
            difficulty=difficulty,
            topic=topic,
        )
        response = llm.invoke(formatted, config={"max_tokens": max_tokens})
        raw = _strip_code_fences(response.content.strip())
        quiz = parser.parse(raw)
        return quiz.model_dump()
    except Exception as e:
        print("Topic quiz generation API error:", e)
        raise ValueError(
            "Our servers are facing high traffic, please try after some time."
        )


# ── Topic extraction from document context ────────────────────────────────────


def extract_topics_from_docs(context: str, llm, num_topics: int = 4) -> list[str]:
    """Ask LLM to identify top key topics/concepts from document context."""
    parser = PydanticOutputParser(pydantic_object=Topics)

    prompt = PromptTemplate(
        template=(
            "Extract {num_topics} distinct key topics or concepts from the "
            "following text. Return ONLY the topics.\n\n"
            "Context sample:\n{context}\n\n"
            "{format_instructions}"
        ),
        input_variables=["num_topics", "context"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )

    try:
        formatted = prompt.format(
            num_topics=num_topics,
            context=context[:3000],
        )
        response = llm.invoke(formatted)
        raw = _strip_code_fences(response.content.strip())
        result = parser.parse(raw)

        if result.topics:
            return result.topics
    except Exception as e:
        print("Topic extraction API error:", e)
        raise ValueError(
            "Our servers are facing high traffic, please try after some time."
        )

    raise ValueError("Our servers are facing high traffic, please try after some time.")

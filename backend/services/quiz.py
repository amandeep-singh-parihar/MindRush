import json
import re
from services.vector_store import VectorStoreManager

MAX_CONTEXT_CHARS = 4000


def generate_output(
    vector_store: VectorStoreManager, llm, questions_count: int, difficulty: str
) -> dict:
    """Fetch all chunks from the session collection and ask the LLM to generate MCQs."""
    all_docs = vector_store.get_all_documents()
    if not all_docs:
        raise ValueError("No documents found in the collection.")

    context = "\n".join(all_docs)
    if len(context) > MAX_CONTEXT_CHARS:
        context = context[:MAX_CONTEXT_CHARS] + "\n...[context truncated]"

    # ~150 tokens per MCQ (question + 4 options + answer) with a safe floor
    max_tokens = max(1024, questions_count * 150)

    prompt = f"""You are a Quiz Generator. Create {questions_count} {difficulty} multiple choice questions based on the provided context.
Generate a JSON object with a single key "questions" which contains a list of {questions_count} questions.
Each question must have:
  - "question": string
  - "options": list of exactly 4 strings
  - "answer": string (must match one of the options exactly)
Do not include any extra text, markdown, or code fences outside the JSON object.

Context:
{context}"""

    response = llm.invoke(prompt, config={"max_tokens": max_tokens})
    raw = response.content.strip()

    # Strip ```json ... ``` fences if present
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"LLM returned invalid JSON: {e}\nRaw output:\n{raw}")


def generate_output_from_topic(
    topic: str, llm, questions_count: int, difficulty: str
) -> dict:
    """Generate multiple choice questions directly based on a topic string."""
    if not llm:
        raise ValueError(
            "Gemini LLM is not initialized. Please ensure GEMINI_API_KEY is set in your .env file."
        )

    max_tokens = max(1024, questions_count * 150)

    prompt = f"""You are an expert Quiz Generator. Create {questions_count} {difficulty} multiple choice questions on the topic: "{topic}".
Generate a JSON object with a single key "questions" which contains a list of {questions_count} questions.
Each question must have:
  - "question": string
  - "options": list of exactly 4 strings
  - "answer": string (must match one of the options exactly)
Do not include any extra text, markdown, or code fences outside the JSON object.
"""

    response = llm.invoke(prompt, config={"max_tokens": max_tokens})
    raw = response.content.strip()

    # Strip ```json ... ``` fences if present
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"LLM returned invalid JSON: {e}\nRaw output:\n{raw}")

import json
import re
from services.vector_store import VectorStoreManager
from services.retriever import RAGRetriever

MAX_CONTEXT_CHARS = 4000


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
    # print("combined_docs from quiz.py -> ", combined_docs)

    topics = extract_topics_from_docs(combined_docs, llm)
    # print("topics from quiz.py -> ", topics)

    topic_context = []

    for topic in topics:
        retrieved_docs = retriever.retrieve(query=topic, top_k=3)
        text_chunks = []
        for doc in retrieved_docs:
            if "document" in doc:
                text_chunks.append(doc["document"])

        # print("text chunk -> ", text_chunks)

        if text_chunks:
            topic_text = "\n".join(text_chunks)
            topic_context.append(f"--- Topic: {topic} ---\n{topic_text}")

    if topic_context:
        context = "\n\n".join(topic_context)
    else:
        context = combined_docs

    # print("topic context -> ", topic_context)
    # print("final context -> ", context)

    if len(context) > MAX_CONTEXT_CHARS:
        context = context[:MAX_CONTEXT_CHARS] + "\n...[context truncated]"
        # print("after truncation -> ", context)

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

    try:
        response = llm.invoke(prompt, config={"max_tokens": max_tokens})
        raw = response.content.strip()

        # Strip ```json ... ``` fences if present
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

        return json.loads(raw)
    except Exception as e:
        print("Quiz generation API error:", e)
        raise ValueError("Our servers are facing high traffic, please try after some time.")


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

    try:
        response = llm.invoke(prompt, config={"max_tokens": max_tokens})
        raw = response.content.strip()

        # Strip ```json ... ``` fences if present
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

        return json.loads(raw)
    except Exception as e:
        print("Topic quiz generation API error:", e)
        raise ValueError("Our servers are facing high traffic, please try after some time.")


def extract_topics_from_docs(context: str, llm, num_topics: int = 4) -> list[str]:
    """Ask LLM to identify top key topics/concepts from document context."""
    prompt = f"""Extract {num_topics} distinct key topics or concepts from the following text.
Return ONLY a valid JSON list of strings representing the topic names, e.g., ["Topic 1", "Topic 2", "Topic 3"].
Do not include extra text or markdown formatting outside the JSON array.

Context sample:
{context[:3000]}"""

    try:
        response = llm.invoke(prompt)
        raw = response.content.strip()
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        topics = json.loads(raw)
        if isinstance(topics, list) and len(topics) > 0:
            return topics
    except Exception as e:
        print("Topic extraction API error:", e)
        raise ValueError("Our servers are facing high traffic, please try after some time.")

    raise ValueError("Our servers are facing high traffic, please try after some time.")

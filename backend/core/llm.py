from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from core.config import GROQ_API_KEY, GEMINI_API_KEY

llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name="openai/gpt-oss-120b",
    temperature=0.1,
)

gemini_llm = (
    ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        api_key=GEMINI_API_KEY,
        temperature=0.3,
    )
    if GEMINI_API_KEY
    else None
)

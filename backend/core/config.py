import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(usecwd=True))

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

origins_env = os.getenv("ALLOW_ORIGINS", "*")
ALLOW_ORIGINS = (
    [origin.strip() for origin in origins_env.split(",") if origin.strip()]
    if origins_env != "*"
    else ["*"]
)


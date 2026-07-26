from pydantic import BaseModel, Field
from typing import Literal


class QuizRequest(BaseModel):
    text_or_pdf: str = Field(description="The input text or PDF to generate")
    difficulty: Literal["easy", "medium", "hard"] = Field(
        description="The difficulty level of the quiz"
    )
    questions_count: int = Field(
        description="The number of questions to generate", ge=1, le=10
    )

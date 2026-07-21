from pydantic import BaseModel


class QuizRequest(BaseModel):
    text_or_pdf: str
    difficulty: str
    questions_count: int

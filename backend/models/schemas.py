from pydantic import BaseModel


class GenerateRequest(BaseModel):
    model: str
    prompt: str
    stream: bool = False


class GenerateResponse(BaseModel):
    response: str

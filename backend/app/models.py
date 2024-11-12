from pydantic import BaseModel


class CustomRequest(BaseModel):
    model: str
    prompt: str
    stream: bool


class CustomResponse(BaseModel):
    result: str

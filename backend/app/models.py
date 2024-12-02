from pydantic import BaseModel


class CustomRequest(BaseModel):
    model: str
    prompt: str
    stream: bool
    isLoggedIn: bool
    username: str


class CustomResponse(BaseModel):
    result: str

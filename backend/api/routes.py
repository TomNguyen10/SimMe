from fastapi import APIRouter
from models.schemas import GenerateRequest, GenerateResponse
from api.ollama_api import call_ollama_api

router = APIRouter()


@router.post("/generate", response_model=GenerateResponse)
async def generate_text(request: GenerateRequest):
    return call_ollama_api(request)

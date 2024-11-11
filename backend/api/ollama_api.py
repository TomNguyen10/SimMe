import requests
from models.schemas import GenerateRequest, GenerateResponse
from fastapi import HTTPException


def call_ollama_api(request: GenerateRequest) -> GenerateResponse:
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json=request.model_dump()
        )

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code,
                                detail="Error communicating with Ollama API")

        data = response.json()
        return GenerateResponse(response=data.get("response"))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

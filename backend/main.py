from fastapi import FastAPI
from api.routes import router as generate_router
from models.schemas import GenerateRequest

app = FastAPI()

app.include_router(generate_router)


def test_generate_text():
    test_request = GenerateRequest(
        model="llama3.1", prompt="Hello", stream=False)
    from api.ollama_api import call_ollama_api
    result = call_ollama_api(test_request)
    print("Test response:", result)


if __name__ == "__main__":
    test_generate_text()

from fastapi import APIRouter, HTTPException
from .models import CustomRequest, CustomResponse
from .config import LLM_API_URL, TIMEOUT, LOCAL_LLM
import httpx
import logging
import traceback


logging.basicConfig(level=logging.INFO)

router = APIRouter()

local_llm = LOCAL_LLM


@router.post("/custom_generate", response_model=CustomResponse)
async def custom_generate(request: CustomRequest):
    prompt_with_context = f"{local_llm}\n{request.prompt}"

    llm_payload = {
        "model": request.model,
        "prompt": prompt_with_context,
        "stream": request.stream,
    }

    try:
        logging.info(f"Sending request to LLM: {llm_payload}")

        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            response = await client.post(LLM_API_URL, json=llm_payload)
            response.raise_for_status()
            llm_response = response.json()

            logging.info(f"Received response from LLM: {llm_response}")

    except httpx.HTTPStatusError as e:
        logging.error(f"HTTP error from LLM: {
                      e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code,
                            detail="Error from LLM") from e
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        logging.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal Server Error")

    return CustomResponse(result=llm_response.get("response", "No result returned"))

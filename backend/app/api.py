from fastapi import APIRouter, HTTPException, UploadFile, File
from .models import CustomRequest, CustomResponse
from .config import LLM_API_URL, TIMEOUT, GENERAL_LLM, FRIEND_LLM, OPENAI_API_KEY
import httpx
import logging
import os
import openai
import traceback

logging.basicConfig(level=logging.INFO)

router = APIRouter()

general_llm = GENERAL_LLM
friend_llm = FRIEND_LLM

openai.api_key = OPENAI_API_KEY


@router.post("/custom_generate", response_model=CustomResponse)
async def custom_generate(request: CustomRequest):
    if request.isLoggedIn:
        base_prompt = friend_llm
        context = f"You are talking to {request.username}, who is a friend."
    else:
        base_prompt = general_llm
        context = "You are talking to a stranger."

    prompt_with_context = f"{base_prompt}\n{context}\n{request.prompt}"

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


@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        with open(file.filename, "wb") as buffer:
            buffer.write(await file.read())

        with open(file.filename, "rb") as audio_file:
            transcription = openai.Audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )

        os.remove(file.filename)

        return {"transcription": transcription["text"]}
    except Exception as e:
        logging.error(f"Error during transcription: {str(e)}")
        raise HTTPException(status_code=500, detail="Transcription failed")

from dotenv import load_dotenv
import os

load_dotenv()

LOCAL_LLM = os.getenv("LOCAL_LLM")
LLM_API_URL = os.getenv("LLM_API_URL")
TIMEOUT = float(os.getenv("TIMEOUT"))

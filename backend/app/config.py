from dotenv import load_dotenv
import os

load_dotenv()

LOCAL_LLM = os.getenv("LOCAL_LLM")
LLM_API_URL = os.getenv("LLM_API_URL")
TIMEOUT = float(os.getenv("TIMEOUT"))
FRIEND_LLM = os.getenv("FRIEND_LLM")
GENERAL_LLM = os.getenv("GENERAL_LLM")

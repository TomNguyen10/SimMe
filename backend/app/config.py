from dotenv import load_dotenv
import os

load_dotenv()

GENERAL_LLM = os.getenv("GENERAL_LLM")
FRIEND_LLM = os.getenv("FRIEND_LLM")
LLM_API_URL = os.getenv("LLM_API_URL")
TIMEOUT = float(os.getenv("TIMEOUT"))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

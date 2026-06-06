import os
from pathlib import Path

# Load environment variables from .env file
_BACKEND_DIR = Path(__file__).resolve().parent
from dotenv import load_dotenv
load_dotenv(_BACKEND_DIR / ".env")

# Import the Flask app
from app import app

if __name__ == "__main__":
    app.run()

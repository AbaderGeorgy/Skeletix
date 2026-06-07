import os
import time
from pathlib import Path

from dotenv import load_dotenv

# Always load `.env` from this folder (backend/), even if Flask is started from another cwd.
_BACKEND_DIR = Path(__file__).resolve().parent
load_dotenv(_BACKEND_DIR / ".env")

import google.generativeai as genai
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

allowed_origins = os.getenv(
    "FRONTEND_ORIGIN",
    "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001,https://skeletix-dsw7.vercel.app",
).split(",")
CORS(
    app,
    resources={r"/chat": {"origins": [origin.strip() for origin in allowed_origins if origin.strip()]}},
)

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY environment variable.")

genai.configure(api_key=API_KEY)
PREFERRED_MODEL_CANDIDATES = [
    model_name.strip()
    for model_name in os.getenv("GEMINI_MODELS", "gemini-1.5-pro,gemini-1.5-flash,gemini-pro").split(",")
    if model_name.strip()
]

SYSTEM_PROMPT = (
    "You are a medical assistant for educational purposes only. "
    "Provide clear, safe, and concise guidance. "
    "Do not provide final diagnosis, prescriptions, or emergency decisions. "
    "If the user reports severe symptoms, advise immediate professional care."
)


def resolve_model_candidates():
    available_by_short_name = {}
    try:
        for model in genai.list_models():
            methods = set(model.supported_generation_methods or [])
            if "generateContent" not in methods:
                continue

            # API usually returns names like "models/gemini-1.5-pro".
            full_name = model.name
            short_name = full_name.split("/", 1)[-1]
            available_by_short_name[short_name] = short_name
    except Exception as exc:
        app.logger.warning("Could not list Gemini models, using configured models only: %s", exc)
        return PREFERRED_MODEL_CANDIDATES

    ordered = [name for name in PREFERRED_MODEL_CANDIDATES if name in available_by_short_name]

    # Add remaining supported models as fallback.
    for short_name in available_by_short_name:
        if short_name not in ordered:
            ordered.append(short_name)

    return ordered or PREFERRED_MODEL_CANDIDATES


MODEL_CANDIDATES = resolve_model_candidates()
app.logger.info("Gemini model candidates: %s", MODEL_CANDIDATES)


def generate_gemini_reply(user_message):
    prompt = f"{SYSTEM_PROMPT}\n\nUser question: {user_message}"
    last_error = None
    for _ in range(3):
        for model_name in MODEL_CANDIDATES:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                text = (response.text or "").strip()
                if text:
                    return text, None
            except Exception as exc:
                last_error = exc
                app.logger.warning("Gemini model '%s' failed: %s", model_name, exc)
        time.sleep(1)
    return None, str(last_error) if last_error else "Unknown Gemini error"


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(silent=True) or {}
        user_message = str(data.get("message", "")).strip()

        if not user_message:
            return jsonify({"reply": "Please enter a valid message."}), 400

        reply, error = generate_gemini_reply(user_message)
        if not reply:
            if app.debug:
                return jsonify({"reply": f"Gemini error: {error}"}), 502
            return jsonify({"reply": "Sorry, I could not generate a response right now."}), 502

        return jsonify({"reply": reply}), 200
    except Exception:
        return jsonify({"reply": "Internal server error. Please try again."}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
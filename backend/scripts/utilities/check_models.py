#!/usr/bin/env python3
"""
Script to check available Google Gemini models
Based on: https://ai.google.dev/api/models
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

# Use the same environment loading logic as config.py
current_dir = Path(__file__).parent
backend_dir = current_dir  # We're already in backend/
project_root = backend_dir.parent  # Portfolio/

# Try to load .env from multiple locations (same as config.py)
env_locations = [backend_dir / ".env", project_root / ".env", Path(".env")]

loaded_env_path = None
for env_path in env_locations:
    if env_path.exists():
        print(f"Loading environment variables from: {env_path}")

        # Load with dotenv first
        result = load_dotenv(env_path)
        print(f"DEBUG: load_dotenv returned: {result}")

        # Check for BOM and handle manually if needed (same as config.py)
        try:
            with open(env_path, "rb") as f:
                raw_bytes = f.read()
                has_bom = raw_bytes.startswith(b"\xef\xbb\xbf")

            if has_bom:
                print("DEBUG: BOM detected, manually parsing .env file")
                with open(env_path, "r", encoding="utf-8-sig") as f:
                    for line_num, line in enumerate(f, 1):
                        line = line.strip()
                        if line and "=" in line and not line.startswith("#"):
                            key, value = line.split("=", 1)
                            key = key.strip()
                            value = value.strip()
                            # Remove any remaining BOM characters
                            key = key.lstrip("\ufeff")
                            os.environ[key] = value
                            print(
                                f"DEBUG: Set {key} = {value[:10]}..."
                                if len(value) > 10
                                else f"DEBUG: Set {key} = {value}"
                            )
        except Exception as e:
            print(f"DEBUG: Error handling BOM: {e}")

        loaded_env_path = env_path
        break
else:
    print("No .env file found in any of the expected locations:")
    for loc in env_locations:
        print(f"  - {loc.absolute()}")
    print("Using system environment variables only.")

# Debug: Print what we finally loaded
print(f"DEBUG: Final GOOGLE_API_KEY = '{os.getenv('GOOGLE_API_KEY', 'NOT_FOUND')}'")
print(
    f"DEBUG: Final LANGCHAIN_API_KEY = '{os.getenv('LANGCHAIN_API_KEY', 'NOT_FOUND')}'"
)
print()


def list_available_models():
    """List all available Gemini models"""
    api_key = os.getenv("GOOGLE_API_KEY")

    if not api_key:
        print("❌ GOOGLE_API_KEY not found in environment variables")
        return

    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

    try:
        print("🔍 Fetching available Google Gemini models...")
        response = requests.get(url)
        response.raise_for_status()

        data = response.json()
        models = data.get("models", [])

        print(f"\n✅ Found {len(models)} available models:\n")

        # Filter models that support generateContent
        content_models = []
        embed_models = []

        for model in models:
            name = model.get("name", "").replace("models/", "")
            base_model_id = model.get("baseModelId", "")
            display_name = model.get("displayName", "")
            description = model.get("description", "")
            supported_methods = model.get("supportedGenerationMethods", [])

            if "generateContent" in supported_methods:
                content_models.append(
                    {
                        "name": name,
                        "base_model_id": base_model_id,
                        "display_name": display_name,
                        "description": description,
                    }
                )

            if "embedContent" in supported_methods:
                embed_models.append({"name": name, "base_model_id": base_model_id})

        print("🤖 Models that support generateContent (chat/completion):")
        print("=" * 60)
        for model in content_models:
            print(f"📝 Model ID: {model['base_model_id']}")
            print(f"   Full Name: {model['name']}")
            print(f"   Display: {model['display_name']}")
            print(
                f"   Description: {model['description'][:100]}{'...' if len(model['description']) > 100 else ''}"
            )
            print()

        print("\n🔗 Models that support embedContent:")
        print("=" * 60)
        for model in embed_models:
            print(f"📊 Model ID: {model['base_model_id']}")
            print(f"   Full Name: {model['name']}")
            print()

        # Recommend best models for your use case
        print("\n💡 Recommended models for your portfolio application:")
        print("=" * 60)

        # Look for the latest Gemini models
        gemini_models = [
            m for m in content_models if "gemini" in m["base_model_id"].lower()
        ]

        if gemini_models:
            # Sort by version to get latest
            flash_models = [
                m for m in gemini_models if "flash" in m["base_model_id"].lower()
            ]
            pro_models = [
                m for m in gemini_models if "pro" in m["base_model_id"].lower()
            ]

            if flash_models:
                latest_flash = flash_models[-1]  # Assume last is latest
                print(f"🚀 FASTEST: {latest_flash['base_model_id']}")
                print(f"   {latest_flash['display_name']}")
                print(f"   Best for: Quick responses, real-time chat")
                print()

            if pro_models:
                latest_pro = pro_models[-1]  # Assume last is latest
                print(f"🧠 MOST CAPABLE: {latest_pro['base_model_id']}")
                print(f"   {latest_pro['display_name']}")
                print(f"   Best for: Complex analysis, strategic fit analysis")
                print()

        return content_models

    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching models: {e}")
        return None
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return None


if __name__ == "__main__":
    list_available_models()

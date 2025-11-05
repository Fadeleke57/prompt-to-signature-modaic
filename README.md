# Prompt to Signature

A full-stack application for generating custom signatures from text prompts using AI models.
DSPy program implmentation here: [https://www.modaic.dev/fadeleke/prompt-to-signature](https://www.modaic.dev/fadeleke/prompt-to-signature)

## Quickstart

### Prerequisites

- Node.js (v18 or higher)
- Python 3.11+
- [uv](https://github.com/astral-sh/uv) (Python package manager)
- Make

### 1. Environment Setup

#### Server Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and add your API keys:

```env
MODAIC_TOKEN="your-modaic-token-here"
GEMINI_API_KEY="your-gemini-api-key-here"
OPENAI_API_KEY="your-openai-api-key-here"
OPENROUTER_API_KEY="your-openrouter-api-key-here"
API_URL="http://localhost:8000"
CLIENT_URL="http://localhost:3000"
```

**Note on API Keys**: The API key you need depends on which model you're using:
- **Default**: The application uses `openrouter/claude-haiku-4.5`, so you'll need to set `OPENROUTER_API_KEY`
- **Custom Model**: You can override the model in `server/main.py:29` by passing `config_options`:
  ```python
  AutoAgent.from_precompiled(
      "fadeleke/prompt-to-signature",
      config_options={"lm": "openai/gpt-4o"}
  )
  ```
  In this case, you would need to set `OPENAI_API_KEY` instead.

#### Client Environment Variables

Create a `.env` file in the `client/` directory:

```bash
cd client
cp .env.example .env
```

Edit `client/.env` and set the API URL:

```env
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
cd client
npm install
```

#### Backend Dependencies
```bash
cd server
uv sync
```

### 3. Run the Application

From the root directory, you can use the following commands:

#### Start Both Services
```bash
make start-all
```

#### Start Services Individually
```bash
# Start frontend only
make start-frontend

# Start backend only
make start-backend
```

#### Stop Services
```bash
# Stop both services
make stop-all

# Stop frontend only
make stop-frontend

# Stop backend only
make stop-backend
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: FastAPI, Python
- **AI Models**: Modaic, Gemini, OpenAI

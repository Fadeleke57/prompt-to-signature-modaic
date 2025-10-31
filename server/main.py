from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from modaic import AutoAgent
from config import settings

prompt_to_signature_agent = AutoAgent.from_precompiled("fadeleke/prompt-to-signature")
app = FastAPI()

origins = [
    "*",
    settings.client_url,
    settings.api_url,
] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptPayload(BaseModel):
    prompt: str
    refine: bool = False

@app.get("/")
def read_root():
    return {"Message": "Hello World! FastAPI is working."}

@app.post("/prompt")
async def create_prompt(payload: PromptPayload):
    result = prompt_to_signature_agent(payload.prompt, refine=payload.refine)
    code = prompt_to_signature_agent.generate_code(result)
    return JSONResponse(content=code)


from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from modaic import AutoProgram
from config import settings

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://sgntrs.dev",
    "https://app.sgntrs.dev",
    "https://www.sgntrs.dev",
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

prompt_to_signature = AutoProgram.from_precompiled("farouk1/prompt-to-signature")
    
@app.get("/")
def read_root():
    return {"Message": "Hello World! FastAPI is working."}

@app.post("/prompt")
async def create_prompt(payload: PromptPayload):
    result = prompt_to_signature(payload.prompt, refine=payload.refine)
    code = prompt_to_signature.generate_code(result)
    return JSONResponse(content=code)


from fastapi import FastAPI
from contextlib import asynccontextmanager



@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title= "Knowledge Base", lifespan= lifespan)


@app.get("/")
async def get_response():
    return "Hey"

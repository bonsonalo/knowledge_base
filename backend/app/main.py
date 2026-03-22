from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.v1.routes import routers


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title= "Knowledge Base", lifespan= lifespan)


@app.get("/")
async def get_response():
    return "Hey"



app.include_router(routers)
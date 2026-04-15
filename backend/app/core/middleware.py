from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware




def add_middleware(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins= [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://knowledge-base-tcp8.vercel.app"
        ],
        allow_credentials= True,
        allow_methods= ["*"],
        allow_headers= ["*"]
    )
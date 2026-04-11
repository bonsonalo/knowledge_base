from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.v1.routes import routers
from app.core.middleware import add_middleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.core.database import engine, Base
    # Import all models to ensure they're registered
    from app.model import user, article, notification
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title= "Knowledge Base", lifespan= lifespan)

#CORS middleware
add_middleware(app)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(routers)
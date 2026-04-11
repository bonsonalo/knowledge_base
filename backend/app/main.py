print("Starting imports...")
try:
    from fastapi import FastAPI
    print("FastAPI imported")
    from contextlib import asynccontextmanager
    print("asynccontextmanager imported")
    from app.api.v1.routes import routers
    print("routes imported")
    from app.core.middleware import add_middleware
    print("middleware imported")
except Exception as e:
    print(f"Import failed: {e}")
    raise


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


print("Creating FastAPI app...")
app = FastAPI(title= "Knowledge Base", lifespan= lifespan)
print("FastAPI app created")

print("Adding middleware...")
add_middleware(app)
print("Middleware added")

print("Adding health endpoint...")
@app.get("/health")
def health_check():
    return {"status": "healthy"}

print("Including routers...")
app.include_router(routers)
print("Routers included")
print("App setup complete!")
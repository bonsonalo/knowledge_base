from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings
from sqlalchemy.orm import DeclarativeBase

#engine

engine= create_async_engine(settings.DB_URL)

#Session

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit= False,
    autoflush= False,
    autocommit= False
)


#Base

class Base(DeclarativeBase):
    pass


#get_db

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db
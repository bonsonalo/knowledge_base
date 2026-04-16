from pydantic import BaseModel
from enum import Enum
from datetime import datetime
import uuid
from app.schema.user_schema import PublicAuthor




class Category(str, Enum):
    technology = "technology"
    science = "science"
    health = "health"
    business = "business"
    education = "education"
    finance = "finance"
    programming = "programming"
    design = "design"
    marketing = "marketing"
    productivity = "productivity"
    artificial_intelligence = "artificial_intelligence"
    cybersecurity = "cybersecurity"
    personal_development = "personal_development"
    research = "research"
    other = "other"


class ArticleResponse(BaseModel):
    id: uuid.UUID
    title: str
    content: str
    category: Category
    cover_image: str | None
    created_at: datetime
    author: PublicAuthor

    class Config:
        from_attributes = True


# class CreateArticle(BaseModel):
#     title: str
#     content: str
#     category: Category
    

# class ToUpdate(BaseModel):
#     title: str | None= None
#     content: str | None= None
#     cover_image: str | None= None
#     category: Category | None= None



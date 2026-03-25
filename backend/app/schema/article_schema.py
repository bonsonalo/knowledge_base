from pydantic import BaseModel
from enum import Enum




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


class CreateArticle(BaseModel):
    title: str
    content: str
    category: Category
    

class ToUpdate(BaseModel):
    title: str | None= None
    content: str | None= None
    cover_image: str | None= None
    category: Category | None= None



from sqlalchemy import String, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import uuid




class Category(Base):
    __tablename__= "category"


    id: Mapped[UUID]= mapped_column(
        UUID(as_uuid= True),
        primary_key= True,
        default= uuid.uuid4
    )
    name: Mapped[str]= mapped_column(
        String,
        unique= True
    )
    description: Mapped[str | None]= mapped_column(
        String,
        nullable= True
    )


    articles: Mapped[list["Article"]]= relationship(
        "Article",
        back_populates= "category",
        cascade= "all, delete-orphan",
        lazy="selectin"
    )

from sqlalchemy import DateTime, String, Boolean, ForeignKey, UUID, Enum as sqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from app.core.database import Base
from enum import Enum
from datetime import datetime, timezone

from app.schema.article_schema import Category





class Status(str, Enum):
    draft= "draft"
    published= "published"





class Article(Base):
    __tablename__= "article"


    id: Mapped[UUID]= mapped_column(
        UUID(as_uuid= True),
        primary_key= True,
        default= uuid.uuid4
    )
    title: Mapped[str]= mapped_column(
        String,
        nullable= False
    )
    content: Mapped[str]= mapped_column(
        String,
        nullable=False
    )
    author_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid= True),
        ForeignKey("users.id", ondelete= "CASCADE")
    )
    category: Mapped[Category] = mapped_column(
        sqlEnum(Category),
        nullable= False
    )
    cover_image: Mapped[str | None]= mapped_column(
        String,
        nullable= True
    )
    status: Mapped[Status]= mapped_column(
        sqlEnum(Status),
        default= Status.draft
    )
    created_at: Mapped[datetime]= mapped_column(
        DateTime(timezone= True),
        default= lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime]= mapped_column(
        DateTime(timezone= True),
        default= lambda: datetime.now(timezone.utc)
    )



    user: Mapped["User"]= relationship(
        "User",
        back_populates= "articles",
        lazy="selectin"
    )
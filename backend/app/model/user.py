from app.core.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, String, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from enum import Enum
from sqlalchemy import Enum as sqlEnum
from datetime import datetime, timezone
from app.schema.auth_schema import Role



class User(Base):
    __tablename__= "users"

    id: Mapped[UUID]= mapped_column(
        UUID(as_uuid=True),
        primary_key= True,
        default= uuid.uuid4
    )
    first_name: Mapped[str]= mapped_column(
        String,
        nullable=False
    )
    last_name: Mapped[str]= mapped_column(
        String,
        nullable= False
    )
    email: Mapped[str]= mapped_column(
        String,
        nullable= False
    )
    hashed_password: Mapped[str]= mapped_column(
        String,
        nullable= False
    )
    role: Mapped[Role]= mapped_column(
        sqlEnum(Role),
        nullable= False,
        default= Role.editor
    )
    avatar: Mapped[str]= mapped_column(
        String,
        nullable= True
    )
    created_at: Mapped[datetime]= mapped_column(
        DateTime(timezone= True),
        default= lambda: datetime.now(timezone.utc)
    )




    articles: Mapped[list["Article"]]= relationship(
        "Article",
        back_populates= "user",
        cascade= "all, delete-orphan",
        lazy= "selectin"
    )
    notification: Mapped[list["Notification"]]= relationship(
        "Notification",
        back_populates= "user",
        cascade= "all, delete-orphan",
        lazy= "selectin"
    )
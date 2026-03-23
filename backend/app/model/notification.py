from sqlalchemy import DateTime, String, UUID, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from app.core.database import Base
from datetime import datetime, timezone


class Notification(Base):
    __tablename__= "notification"


    id: Mapped[UUID]= mapped_column(
        UUID(as_uuid= True),
        primary_key= True,
        default= uuid.uuid4
    )
    user_id: Mapped[UUID]= mapped_column(
        ForeignKey("users.id", ondelete= "CASCADE")
    )
    message: Mapped[str]= mapped_column(
        String
    )
    is_read: Mapped[bool]= mapped_column(
        Boolean,
        default= False
    )
    created_at: Mapped[datetime]= mapped_column(
        DateTime(timezone= True),
        default= datetime.now(timezone.utc)
    )


    user: Mapped["User"]= relationship(
        "User",
        back_populates= "notification",
        lazy= "selectin"
    )
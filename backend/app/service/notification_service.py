from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.model.notification import Notification




#create notification

async def create_notification(user_id: UUID, message: str, db: AsyncSession):
    notification= Notification(
        user_id= user_id,
        message= message,
        is_read= False
    )

    db.add(notification)
    await db.commit()



#get all notifications

async def get_notifications(current_user, db: AsyncSession):
    current_id= current_user["id"]
    notification= await db.execute(select(Notification).where(Notification.id == current_id).order_by(Notification.created_at.desc()))

    return notification.scalars().all()


# mark one as read

async def mark_as_read(notification_id: UUID, current_user, db: AsyncSession):
    current_id= current_user["id"]

    notification= db.scalar(select(Notification).where(Notification.id == notification_id).where(Notification.user_id == current_id))

    if not notification:
        raise ValueError("Notification not found")
    notification.is_read= True

    db.commit()
    return {"messgae": "message marked as read"}


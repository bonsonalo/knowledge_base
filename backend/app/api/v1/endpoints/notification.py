from fastapi import APIRouter, Depends
from app.api.deps import db_dependency, get_current_user
from app.service.notification_service import get_notifications, mark_as_read
from uuid import UUID
from app.api.deps import editor_dependency





router= APIRouter(
    prefix= "/api/v1/notification",
    tags= ["notifications"]
)





# get all your notifications
@router.get("/")
async def read_notifications(
    current_user: editor_dependency,
    db: db_dependency
):
    return await get_notifications(current_user, db)


# mark one as read
@router.put("/{notification_id}/read")
async def read_notification(
    notification_id: UUID,
    current_user: editor_dependency,
    db: db_dependency
):
    return await mark_as_read(notification_id, current_user, db)
from fastapi import APIRouter, HTTPException, status, Form, UploadFile
from app.service import user_service
from app.schema.user_schema import UserProfile
from app.api.deps import editor_dependency, db_dependency
from app.core.logger import logger



router= APIRouter(
    prefix= "/api/v1/me",
    tags= ["me"]
)


# get profile

@router.get("/", response_model= UserProfile)
async def get_profile(current_user: editor_dependency, db: db_dependency):
    try:
        return await user_service.user_profile_service(current_user, db)
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    


#update profile

@router.patch("/update")
async def update_profile(current_user: editor_dependency, db: db_dependency, first_name: str | None= Form(None), last_name: str | None= Form(None), avatar: UploadFile | None= Form(None)):
    try:
        return await user_service.update_profile_service(current_user, db, first_name, last_name, avatar)
    except ValueError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= str(e))

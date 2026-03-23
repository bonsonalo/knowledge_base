from sqlalchemy import select
from app.model.user import User
from app.core.logger import logger
from app.schema.user_schema import ProfileUpdate
from sqlalchemy.ext.asyncio import AsyncSession




# get user profile
async def user_profile_service(current_user, db: AsyncSession):
        current_id= current_user["id"]
        user= await db.scalar(select(User).where(User.id == current_id))
        if not user:
            logger.error("User doesnt exist")
            raise ValueError("user not found")
        return user


#update profile

async def update_profile_service(to_update: ProfileUpdate, current_user, db: AsyncSession):
    current_id= current_user["id"]
    user= await db.scalar(select(User).where(User.id == current_id))

    if not user:
         raise ValueError("user not available")
    if to_update.first_name is not None:
         user.first_name = to_update.first_name
    if to_update.last_name is not None:
         user.last_name = to_update.last_name
    if to_update.avatar is not None:
         user.avatar = to_update.avatar

    db.commit()
    db.refresh(user)
    return user

# upload profile picture

##########
##########



# change password


#####


     


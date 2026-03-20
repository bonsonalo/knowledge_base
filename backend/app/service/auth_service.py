from datetime import datetime, timedelta, timezone
import uuid

from jose import jwt
from app.schema.auth_schema import UserSignUp, LoginInfo
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.model.user import User
from app.utils.password_strength import validate_password_strength
from app.core.logger import logger
from pydantic import EmailStr
from app.core.config import settings
from app.schema.auth_schema import Role
from app.api.deps import bcrypt_context
from app.api.deps import create_access_token, authenticate_user




async def register_user(user_info: UserSignUp, db: AsyncSession):
    try:
        validate_password_strength(user_info.password)
        existing_user= await db.scalar(select(User).where(User.email == user_info.email))
        if existing_user:
            raise ValueError("Email has only been used to create account!")
    except ValueError as e:
        logger.error(str(e))
        raise
    except Exception as e:
        logger.error(str(e))
        raise

    user_credential= User(
        first_name= user_info.first_name,
        last_name= user_info.last_name,
        email= user_info.email,
        hashed_password= bcrypt_context.hash(user_info.password)
    )
    db.add(user_credential)
    db.commit()
    db.refresh(user_credential)
    access_token= create_access_token(user_credential.email, user_credential.id, "access", timedelta(minutes=20))
    refresh_token= create_access_token(user_credential.email, user_credential.id, "refresh", timedelta(days=30))

    return {
            {"access_token": access_token, "token_type": "bearer"},  
            {"access_token": refresh_token, "token_type": "bearer"}

        }



async def login_service(user_info: LoginInfo, db: AsyncSession):
    user= await authenticate_user(user_info, db)
    if not user:
        logger.error("either the email or the password is Wrong!")
        raise ValueError("Incorrect credential")
    access_token= create_access_token(user.email, user.id, "access", timedelta(minutes=20))
    refresh_token= create_access_token(user.email, user.id, "refresh", timedelta(days=30))

    return {
        {"access_token": access_token, "token_type": "bearer"},  
        {"access_token": refresh_token, "token_type": "bearer"}

    }



async def promote_user_service(user_id: uuid.UUID, new_role: Role, db: AsyncSession):
    user= await db.scalar(select(User).where(User.id == user_id))
    if not user:
        logger.error("User with that id not found for role promotion")
        raise ValueError("User with that id not found for role promotion")
    user.role= new_role
    await db.commit()
    logger.info("successfully promoted the user to {new_role} role")
    db.refresh(user)
    return user






async def refresh_token_service(refresh_token: str, db: AsyncSession):
    payload= jwt.decode(refresh_token, settings.SECRET_KEY, settings.ALGORITHM)
    if payload.get("token_type") != "refresh":
        logger.error("The token type is not refresh_token")
        raise False
    email= payload.get("email")
    user_id= payload.get("id")
    role= payload.get("role")


    new_access_token= create_access_token(email, user_id, role, "access", timedelta(minutes=20))

    return {"access_type": new_access_token, "token_type": "bearer"}






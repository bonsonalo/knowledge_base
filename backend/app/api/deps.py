from passlib.context import CryptContext
from sqlalchemy import select
from pydantic import EmailStr
from app.core.logger import logger
from app.model.user import User
from app.schema.auth_schema import LoginInfo
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
from datetime import timezone
from app.core.config import settings
from jose import jwt, JWTError
import uuid
from typing import Annotated, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.database import get_db
from uuid import UUID

bcrypt_context= CryptContext(schemes=["bcrypt"], deprecated= "auto")

oauth_bearer= OAuth2PasswordBearer(tokenUrl= "/api/v1/auth/login")


async def authenticate_user(user_credential: LoginInfo, db: AsyncSession):
    try:
        user= await db.scalar(select(User).where(User.email == user_credential.email))
        if not user:
            return False
        if not bcrypt_context.verify(user_credential.password, user.hashed_password):
            return False
        return user
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))


async def create_access_token(email: EmailStr, id: uuid.UUID, role: str, token_purpose: str, expires_delta: timedelta):
    encode= {"sub": email, "id": str(id), "role": role, "token_type": token_purpose}
    expires= datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})

    return jwt.encode(encode, settings.SECRET_KEY, algorithm= settings.ALGORITHM)




db_dependency= Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(token: Annotated[str, Depends(oauth_bearer)]):
    try:
        payload= jwt.decode(token, settings.SECRET_KEY, algorithms= [settings.ALGORITHM])
        email: str= payload.get("sub")
        id: UUID= UUID(payload.get("id"))
        role: str= payload.get("role")
        
        if email is None or id is None or role is None:
            logger.error("the endpoint is not authenticated")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail= "the endpoint is not authenticated")
        return {"email": email, "role": role, "id": id}

    except JWTError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail= str(e))

user_authentication_dependency= Annotated[dict, Depends(get_current_user)]


def role_required(allowed_roles: List[str]):
    def wrapper(current_user: user_authentication_dependency):
        user_role= current_user.get("role")
        if not user_role:
            logger.error("there is no role assigned")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail= "user has no roles assigned")
        if user_role not in allowed_roles:
            logger.error("you are not authorized to access")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail= "you are not authorized to access")
        return current_user
    return wrapper

user_dependency= Annotated[dict, Depends(role_required("user", "editor", "admin"))]
editor_dependency= Annotated[dict, Depends(role_required("admin", "editor"))]
admin_dependency= Annotated[dict, Depends(role_required("admin"))]
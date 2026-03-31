from fastapi import HTTPException, APIRouter, Request, status, Response
from app.api.deps import db_dependency
from app.schema.auth_schema import LoginInfo, UserSignUp
from app.service.auth_service import login_service, logout_service, promote_user_service, refresh_token_service, register_user
from app.core.logger import logger
from uuid import UUID
from app.api.deps import admin_dependency
from jose import ExpiredSignatureError, JWTError


router= APIRouter(
    prefix= "/api/v1/auth",
    tags= ["auth"]
)


#sign up

@router.post("/signup")
async def sign_up(user_info: UserSignUp, db: db_dependency, res: Response):
    try:
        return await register_user(user_info, db, res)
    except ValueError as e:
        logger.error("Couldnot sign up")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail= str(e))


# login

@router.post("/login")
async def login_user(user_info: LoginInfo, db: db_dependency, res: Response):
    try:
        return await login_service(user_info, db, res)
    except Exception as e:
        logger.error("couldnot validate user")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail= str(e))
    
#promote user

@router.patch("/promote_user/{user_id}")
async def promote_user(user_id: UUID, new_role: str, db: db_dependency, current_user: admin_dependency):
        try:
            updated= await promote_user_service(user_id, new_role, db)
            return updated
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= str(e))
             



#refresh token

@router.post("/refresh")
async def refresh_access_token(res: Response, request: Request):
     try:
          return await refresh_token_service(res, request)
     except ValueError as e:
          logger.error("the token type is not refrehs")
          raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail= str(e))
     except ExpiredSignatureError:
          logger.error("couldnot no provide refresh token")
          raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail= "refresh token Expired")
     except JWTError:
          raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail= "invalid refresh token")
     


# logout 

@router.post("/logout")
async def logout(response: Response):
     try:
          return await logout_service(response)
     except ValueError as e:
          logger.error(str(e))
          raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail= str(e))
     
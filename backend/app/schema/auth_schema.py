from pydantic import BaseModel, EmailStr
from enum import Enum


class UserSignUp(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


class LoginInfo(BaseModel):
    email: EmailStr
    password: str

class Role(str, Enum):
    user= "user"
    editor= "editor"
    admin = "admin"

# class RefreshTokenRequest(BaseModel):
#     refresh_token: str
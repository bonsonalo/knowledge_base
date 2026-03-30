from pydantic import BaseModel



class UserProfile(BaseModel):
    first_name: str
    last_name: str
    email: str
    avatar: str | None

# class ProfileUpdate(BaseModel):
#     first_name: str | None
#     last_name: str | None
#     avatar: str | None
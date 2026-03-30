from fastapi import APIRouter
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.article import router as article_router
from app.api.v1.endpoints.notification import router as notification_router
from app.api.v1.endpoints.user import router as user_router



routers= APIRouter()

router_list= [auth_router, article_router, notification_router, user_router]

for router in router_list:
    routers.include_router(router)
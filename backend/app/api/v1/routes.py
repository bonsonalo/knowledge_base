from fastapi import APIRouter
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.article import router as article_router




routers= APIRouter()

router_list= [auth_router, article_router]

for router in router_list:
    routers.include_router(router)
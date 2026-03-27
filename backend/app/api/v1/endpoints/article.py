from uuid import UUID

from fastapi import FastAPI, HTTPException, APIRouter, UploadFile, status

from app.schema.article_schema import Category, CreateArticle, ToUpdate
from app.api.deps import editor_dependency, db_dependency
from app.service.article_service import create_article_draft_service, create_article_publish_service, delete_article_service, delete_article_service_admin, get_all_articles_self_all_service, get_all_articles_self_draft_service, get_all_articles_self_published_service, get_all_articles_service, get_article_editor_service, get_article_service, patch_article_service
from app.core.logger import logger


router= APIRouter(
    prefix= "/api/v1/article",
    tags= ["article"]
)



# create and publish article    Editor Role
@router.post("/publish_article")
async def create_article_publish(to_add: CreateArticle, current_user: editor_dependency, db: db_dependency, file: UploadFile):
    try:
        await create_article_publish_service(to_add, current_user, db, file)
    except ValueError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail= str(e))
    

# create and draft artcile           Editor Role

router.post("/draft_article")
async def create_article_draft(to_add: CreateArticle, current_user: editor_dependency, db: db_dependency):
    try:
        await create_article_draft_service(to_add, current_user, db)
    except ValueError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail= str(e))
    

# # update article    Editor Role
@router.patch("/update_article/{article_id}")
async def patch_article(to_update: ToUpdate, article_id: UUID, current_user: editor_dependency, db: db_dependency):
    try:
        await patch_article_service(to_update, article_id, current_user, db)
    except ValueError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail= str(e))
    

# get all articles that YOU published or drafted       Editor Role
@router.get("/self_articles")
async def get_all_articles_self_all(current_user: editor_dependency, db: db_dependency):
    try:
        await get_all_articles_self_all_service(current_user, db)
    except ValueError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= str(e))
    

# continues from the above. it is for Published
@router.get("/published_self_articles")
async def get_all_articles_self_published(current_user: editor_dependency, db: db_dependency):
    try:
        await get_all_articles_self_published_service(current_user, db)
    except ValueError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= str(e))
    

# continues from the above. it is for draft
@router.get("/draft_self_articles")
async def get_all_articles_self_draft(current_user: editor_dependency, db: db_dependency):
    try:
        await get_all_articles_self_draft_service(current_user, db)
    except ValueError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= str(e))
    

# get all articles     # no need to login

@router.get("/all_articles")
async def get_all_articles(db: db_dependency, 
                           title: str | None,
                           category: Category | None,
                           author_id: UUID | None,
                           sort_by: str = "created_at",
                           order: str = "desc"
                           ):
    try:
        await get_all_articles_service(db, title, category, author_id, sort_by, order)

    except ValueError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= str(e))
    


#get single article     # no need to log in
@router.get("single_article/{article_id}")
async def get_article(article_id: UUID, db: db_dependency):
    try:
        await get_article_service(article_id, db)
    except ValueError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= str(e))
    

#get single article     # EDITOR ROLE

@router.get("single_article_editor/{article_id}")
async def get_article_editor(article_id: UUID, current_user: editor_dependency, db: db_dependency):
    try:
        await get_article_editor_service(article_id, current_user, db)
    except ValueError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= str(e))
    


# delete article Editor Role

@router.delete("delete_article_editor/{article_id}")
async def delete_article(article_id: UUID, current_user: editor_dependency, db: db_dependency):
    try:
        await delete_article_service(article_id, current_user, db)
    except ValueError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= str(e))
    



# delete article for admin role
@router.delete("delete_article_admin/{article_id}")
async def delete_article(article_id: UUID, db: db_dependency):
    try:
        await delete_article_service_admin(article_id, db)
    except ValueError as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= str(e))
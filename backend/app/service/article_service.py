from app.schema.article_schema import Category, CreateArticle, ToUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from app.model.article import Article
from app.core.logger import logger
from sqlalchemy import select
from uuid import UUID
from fastapi import UploadFile
from app.service.upload_service import upload_file
from app.service.notification_service import create_notification




# create and publish article    Editor Role

async def create_article_publish_service(to_add: CreateArticle, current_user, db: AsyncSession, file: UploadFile):
    current_id= current_user.get("id")
    try:

        cover_img_url =  await upload_file(file, folder= "cover_image")


        created= Article(
            title = to_add.title,
            content= to_add.content,
            cover_image= cover_img_url,
            status= "published",
            author_id= current_id,
            category= to_add.category
        )


        db.add(created)
        logger.info("added the created article successfully")
        await db.commit()
        logger.info("commited to db successfully")
        await db.refresh(created)
        logger.info("refreshed successfully")


        # add notification
        await create_notification(
            user_id= current_id,
            message= "You have published an article",
            db= db
        )

        return {"message": "Article created and published successfully"}

    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))
    

# create and draft artcile           Editor Role

async def create_article_draft_service(to_add: CreateArticle, current_user, db: AsyncSession, file: UploadFile):
    current_id= current_user.get("id")
    try:
        cover_img_url =  await upload_file(file, folder= "cover_image")

        created= Article(
            title = to_add.title,
            content= to_add.content,
            cover_image= cover_img_url,
            status= "draft",
            author_id= current_id,
            category= to_add.category
        )

        db.add(created)
        logger.info("added the created article successfully")
        await db.commit()
        logger.info("commited to db successfully")
        await db.refresh(created)
        logger.info("refreshed successfully")

        return {"message": "Article saved as draftsuccessfully"}

    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))
    

# update article    Editor Role

async def patch_article_service(to_update: ToUpdate, article_id: UUID, current_user, db: AsyncSession):
    current_id= current_user.get("id")
    try:
        article= await db.scalar(select(Article).where(Article.author_id == current_id).where(Article.id == article_id))
        if not article:
            raise ValueError("article not found")
        if to_update.title is not None:
            article.title = to_update.title
        if to_update.category is not None:
            article.category = to_update.category
        if to_update.content is not None:
            article.content = to_update.content
        if to_update.cover_image is not None:
            article.cover_image = to_update.cover_image

        await db.commit()
        await db.refresh(article)
        return article
    except ValueError as e:
        raise ValueError(str(e))
    

    
# get all articles that YOU published or drafted       Editor Role

async def get_all_articles_self_all_service(current_user, db: AsyncSession):
    current_id= current_user["id"]
    try:
        articles= await db.execute(select(Article).where(Article.author_id == current_id))
        return articles.scalars().all()
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))
    

# continues from the above. it is for Published

async def get_all_articles_self_published_service(current_user, db: AsyncSession):
    current_id= current_user["id"]
    try:
        articles= await db.execute(select(Article).where(Article.author_id == current_id).where(Article.status == "published"))
        return articles.scalars().all()
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))
    

# continues from the above. it is for draft

async def get_all_articles_self_draft_service(current_user, db: AsyncSession):
    current_id= current_user["id"]
    try:
        articles= await db.execute(select(Article).where(Article.author_id == current_id).where(Article.status == "draft"))
        return articles.scalars().all()
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))


# get all articles     # no need to login

async def get_all_articles_service(db: AsyncSession, 
                           title: str | None,
                           category: Category | None,
                           author_id: UUID | None,
                           sort_by: str = "created_at",
                           order: str = "desc"
                           ):
    
    allowed_sort= {"title", "created_at"}
    allowed_orders= {"asc", "desc"}
    try:
        query= select(Article).where(Article.status == "published")
        if title is not None:
            query= query.where(Article.title.ilike(f"%{title}%"))
        if category is not None:
            query= query.where(Article.category == category)
        if author_id is not None:
            query= query.where(Article.author_id == author_id)
        if sort_by not in allowed_sort:
            raise  ValueError(f"Invalid sort field: {sort_by}")
        if order.lower() not in allowed_orders:
            raise f"Invalid sort field: {sort_by}"
        column= getattr(Article, sort_by)
        query= query.order_by(
            column.desc() if order.lower() == "desc" else column.asc()
        )
        articles= await db.execute(query)
        return articles.scalars().all()
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))



#get single article     # no need to log in

async def get_article_service(article_id: UUID, db: AsyncSession):
    try:
        article= await db.scalar(select(Article).where((Article.id == article_id)).where(Article.status == "published"))
        return article
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))






#get single article     # EDITOR ROLE

async def get_article_editor_service(article_id: UUID, current_user, db: AsyncSession):
    current_id= current_user["id"]
    try:
        article= await db.scalar(select(Article).where(Article.author_id == current_id).where((Article.id == article_id)))
        return article
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))
    

# delete article Editor Role

async def delete_article_service(article_id: UUID, current_user, db: AsyncSession):
    current_id= current_user["id"]
    try:
        article= await db.scalar(select(Article).where(Article.author_id == current_id).where((Article.id == article_id)))
        if not article:
            raise ValueError("article doesnt exist")
        await db.delete(article)
        await db.commit()
        return {"message": "Article deleted successfully"}
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))
    

# delete article for admin role

async def delete_article_service_admin(article_id: UUID, db: AsyncSession):
    try:
        article= await db.scalar(select(Article).where((Article.id == article_id)))

        if not article:
            raise ValueError("article doesnt exist")

        author_id= article.author_id
        await db.delete(article)
        await db.commit()

        # add notification
        await create_notification(
            user_id= author_id,
            message= "article deleted by Admin",
            db= db
        )
        return {"message": "Article deleted successfully"}
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))



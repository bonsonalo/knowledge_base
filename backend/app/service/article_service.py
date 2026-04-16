from typing import Optional

from app.schema.article_schema import ArticleResponse, Category
from app.schema.user_schema import PublicAuthor
from sqlalchemy.ext.asyncio import AsyncSession
from app.model.article import Article
from app.core.logger import logger
from sqlalchemy import or_, select
from uuid import UUID
from fastapi import File, Form, UploadFile
from app.service.upload_service import upload_file
from app.service.notification_service import create_notification
from app.model.user import User




# create and publish article    Editor Role

async def create_article_publish_service(file: UploadFile,
                                       db: AsyncSession,
                                       current_user,
                                       title: str= Form(...),
                                       content: str= Form(...),
                                       category: str= Form(...)):
    current_id= current_user.get("id")
    logger.info("got the current id from the current_user")
    try:

        cover_img_url =  await upload_file(file, folder= "cover_image")


        created= Article(
            title = title,
            content= content,
            cover_image= cover_img_url,
            status= "published",
            author_id= current_id,
            category= category
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
        logger.info("created_notification")

        return {"message": "Article created and published successfully"}

    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))
    

# create and draft artcile           Editor Role

async def create_article_draft_service(file: UploadFile,
                                       db: AsyncSession,
                                       current_user,
                                       title: str= Form(...),
                                       content: str= Form(...),
                                       category: str= Form(...)
                                       ):
    logger.info("to get the current id from the current_user")

    current_id= current_user.get("id")
    try:
        cover_img_url =  await upload_file(file, folder= "cover_image")

        created= Article(
            title = title,
            content= content,
            cover_image= cover_img_url,
            status= "draft",
            author_id= current_id,
            category= category
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

async def patch_article_service(article_id: UUID, current_user, db: AsyncSession, title: str | None= Form(None), content: str | None= Form(None), cover_image: Optional[UploadFile] | None= File(None), category: Category | None= Form(None)):
    current_id= current_user.get("id")
    try:
        article= await db.scalar(select(Article).where(Article.author_id == current_id).where(Article.id == article_id))
        if not article:
            raise ValueError("article not found")
        if title is not None:
            article.title = title
        if category is not None:
            article.category = category
        if content is not None:
            article.content = content
        if cover_image is not None:
            print("cover image received:", cover_image.filename)
            article.cover_image = await upload_file(cover_image ,folder="cover_image")

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
                           title: str | None= None,
                           category: Category | None= None,
                           author_name: str | None= None,
                           sort_by: str = "created_at",
                           order: str = "desc"
                           ):
    
    allowed_sort= {"title", "created_at"}
    allowed_orders= {"asc", "desc"}
    try:
        query= select(Article).where(Article.status == "published")
        if title is not None or author_name is not None:
            query= query.join(Article.user).where(
                or_(
                    Article.title.ilike(f"%{title}%") if title else False,
                    User.first_name.ilike(f"%{author_name}%") if author_name else False
                )
            )
            query= query.where(Article.title.ilike(f"%{title}%"))
        if category is not None:
            query= query.where(Article.category == category)
        if sort_by not in allowed_sort:
            raise  ValueError(f"Invalid sort field: {sort_by}")
        if order.lower() not in allowed_orders:
            raise f"Invalid sort field: {sort_by}"
        column= getattr(Article, sort_by)
        query= query.order_by(
            column.desc() if order.lower() == "desc" else column.asc()
        )
        articles= await db.execute(query)
        return [
            ArticleResponse(
                id= article.id,
                title= article.title,
                content= article.content,
                category= article.category,
                cover_image= article.cover_image,
                created_at= article.created_at,
                author= PublicAuthor(
                    first_name= article.user.first_name,
                    last_name= article.user.last_name,
                    avatar= article.user.avatar
                )
            )
            for article in articles.scalars().all()
        ]
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))



#get single article     # no need to log in

async def get_article_service(article_id: UUID, db: AsyncSession):
    try:
        article= await db.scalar(select(Article).where((Article.id == article_id)).where(Article.status == "published"))
        if not article:
            raise ValueError("Article not found")
        return ArticleResponse(
            id= article.id,
            title= article.title,
            content= article.content,
            category= article.category,
            cover_image= article.cover_image,
            created_at= article.created_at,
            author= PublicAuthor(
                first_name= article.user.first_name,
                last_name= article.user.last_name,
                avatar= article.user.avatar
            )
        )
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



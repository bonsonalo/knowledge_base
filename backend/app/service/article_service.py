from app.schema.article_schema import CreateArticle, ToUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from app.model.article import Article
from app.core.logger import logger
from sqlalchemy import select
from uuid import UUID



# create and publish article    Editor Role

async def create_article_publish(to_add: CreateArticle, current_user, db: AsyncSession):
    current_id= current_user.get("id")
    try:
        created= Article(
            title = to_add.title,
            content= to_add.content,
            cover_image= to_add.cover_image,
            status= "published",
            author_id= current_id,
            category_id= to_add.category_id
        )

        db.add(created)
        logger.info("added the created article successfully")
        await db.commit()
        logger.info("commited to db successfully")
        await db.refresh(created)
        logger.info("refreshed successfully")

        return {"message": "Article created and published successfully"}

    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))
    

# create and draft artcile           Editor Role

async def create_article_draft(to_add: CreateArticle, current_user, db: AsyncSession):
    current_id= current_user.get("id")
    try:
        created= Article(
            title = to_add.title,
            content= to_add.content,
            cover_image= to_add.cover_image,
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

async def patch_article(to_update: ToUpdate, current_user, db: AsyncSession):
    current_id= current_user.get("id")
    article= await db.scalar(select(Article).where(Article.author_id == current_id))
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

# get all articles that YOU published or drafted       Editor Role

async def get_all_articles(current_user, db: AsyncSession):
    current_id= current_user["id"]
    try:
        articles= await db.execute(select(Article).where(Article.author_id == current_id))
        return articles.scalars().all()
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))
    

# continues from the above. it is for Published

async def get_all_articles(current_user, db: AsyncSession):
    current_id= current_user["id"]
    try:
        articles= await db.execute(select(Article).where(Article.author_id == current_id).where(Article.status == "published"))
        return articles.scalars().all()
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))
    

# continues from the above. it is for draft

async def get_all_articles(current_user, db: AsyncSession):
    current_id= current_user["id"]
    try:
        articles= await db.execute(select(Article).where(Article.author_id == current_id).where(Article.status == "draft"))
        return articles.scalars().all()
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))


# get all articles     # no need to login

async def get_all_articles( db: AsyncSession):
    try:
        articles= await db.execute(select(Article).where(Article.status == "published"))
        return articles.scalars().all()
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))

#get single article     # no need to log in

async def get_article(article_id: UUID, db: AsyncSession):
    try:
        article= await db.scalar(select(Article).where((Article.id == article_id)).where(Article.status == "published"))
        return article
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))






#get single article     # EDITOR ROLE

async def get_article(article_id: UUID, current_user, db: AsyncSession):
    current_id= current_user["id"]
    try:
        article= await db.scalar(select(Article).where(Article.author_id == current_id).where((Article.id == article_id)))
        return article
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))
    

# delete article Editor Role

async def delete_article(article_id: UUID, current_user, db: AsyncSession):
    current_id= current_user["id"]
    try:
        article= await db.scalar(select(Article).where(Article.author_id == current_id).where((Article.id == article_id)))
        await db.delete(article)
        await db.commit()
        return {"message": "Article deleted successfully"}
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))
    

# delete article for admin role

async def delete_article(article_id: UUID, db: AsyncSession):
    try:
        article= await db.scalar(select(Article).where((Article.id == article_id)))
        await db.delete(article)
        await db.commit()
        return {"message": "Article deleted successfully"}
    except ValueError as e:
        logger.error(str(e))
        raise ValueError(str(e))



from app.core.config import settings
import cloudinary



cloudinary.config(
    CLOUD_NAME= settings.CLOUD_NAME,
    API_KEY= settings.API_KEY,
    API_SECRET= settings.API_SECRET
)
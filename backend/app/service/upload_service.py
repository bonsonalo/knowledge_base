
from fastapi import UploadFile
import cloudinary.uploader
import app.core.cloudinary 



async def upload_file(file: UploadFile, folder: str):
    allowed_types= ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise ValueError("Invalid file type")
    # validate size (2MB)
    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:
        raise ValueError("File too large")
    
    # upload to cloudinary
    result = cloudinary.uploader.upload(
        contents,
        folder=folder        # e.g "cover_images" or "avatars"
    )

    # returns the URL
    return result["secure_url"]
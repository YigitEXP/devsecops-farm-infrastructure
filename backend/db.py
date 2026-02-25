import os
from motor.motor_asyncio import AsyncIOMotorClient

# .env'den bilgileri çekiyoruz
MONGO_URI = os.getenv("MONGO_URI", "mongodb://sec-mongodb:27017")
DB_NAME = os.getenv("DB_NAME", "bulletproof_db")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
users_collection = db["users"]
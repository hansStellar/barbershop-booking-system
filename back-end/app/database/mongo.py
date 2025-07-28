from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)

db = client["book_barker"]  # use your actual database name
bookings_collection = db["bookings"]  # use your desired collection name
users_collection = db["users"]  # use your desired collection name
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://hanschris96:Hcts.8000@clusterhans.w9d0bwn.mongodb.net/?retryWrites=true&w=majority&appName=ClusterHans")
client = AsyncIOMotorClient(MONGO_URI)

db = client["book_barker"]  # use your actual database name
bookings_collection = db["bookings"]  # use your desired collection name
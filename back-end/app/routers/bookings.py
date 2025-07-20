from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

# Database
from app.database.mongo import bookings_collection

# Models
from app.models.bookings import Booking

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)

@router.get("/", response_model=List[Booking])
async def get_all_bookings():
    bookings = []
    cursor = bookings_collection.find({})
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        bookings.append(Booking(**doc))
    return bookings

@router.post("/send_book", response_model=Booking)
async def create_booking(booking: Booking):
    booking_dict = booking.dict()
    result = await bookings_collection.insert_one(booking_dict)
    booking_dict["id"] = str(result.inserted_id)
    return booking_dict
from fastapi import APIRouter, HTTPException, WebSocket
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

# Routes

# 1 - Get All Bookings
@router.get("/get_bookings", response_model=List[Booking])
async def get_all_bookings():
    bookings = []
    bookings_database = bookings_collection.find({})
    async for booking in bookings_database:
        booking["id"] = str(booking["_id"])
        bookings.append(Booking(**booking))
    return bookings


# 2 - Post a Booking
@router.post("/send_book", response_model=Booking)
async def create_booking(booking: Booking):
    booking_dict = booking.dict()
    result = await bookings_collection.insert_one(booking_dict)
    booking_dict["id"] = str(result.inserted_id)
    return booking_dict


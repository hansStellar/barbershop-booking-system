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
@router.get('/get_bookings', response_model=List[Booking])
async def get_all_bookings():
    bookings = []
    bookings_database = bookings_collection.find({})
    async for booking in bookings_database:
        booking["id"] = str(booking["_id"])  # ✅ Convierte el ObjectId a string
        del booking["_id"]  # Opcional: eliminar el campo _id original
        bookings.append(Booking(**booking)) # The ** breaks the booking in pieces like: Booking(id="123", name="Hans", service="Shave", date="2025-07-29", time="03:33") because Booking it's expecting it that way
    return bookings


# 2 - Post a Booking
@router.post("/send_book", response_model=Booking)
async def create_booking(booking: Booking): # The parameter included here is a validation expecting from the front end
    booking_dict = booking.dict() # Converts the booking object into a python dictionary
    result = await bookings_collection.insert_one(booking_dict)
    booking_dict["id"] = str(result.inserted_id)
    return booking_dict


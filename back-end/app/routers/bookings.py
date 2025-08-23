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
        bookings.append(Booking(**booking))
    return bookings


# 2 - Post a Booking
@router.post("/send_book", response_model=Booking)
async def create_booking(booking: dict):
    booking_dict = dict(booking) 
    await bookings_collection.insert_one(booking_dict)
    return booking_dict

# 3 - Delete a Booking
@router.post("/delete_book")
async def delete_booking(booking: dict):
    print(booking)
    order_ref = booking.get("order_ref")
    if not order_ref:
        raise HTTPException(status_code=400, detail="Order reference is required to delete a booking")

    result = await bookings_collection.find_one_and_delete({"order_ref": order_ref})
    if not result:
        raise HTTPException(status_code=404, detail="Booking not found")

    return Booking(**result)
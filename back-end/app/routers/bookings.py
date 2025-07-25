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
connected_clients: List[WebSocket] = []
import asyncio

@router.get("/get_bookings", response_model=List[Booking])
async def get_all_bookings():
    bookings = []
    bookings_database = bookings_collection.find({})
    async for booking in bookings_database:
        booking["id"] = str(booking["_id"])
        bookings.append(Booking(**booking))
    return bookings


@router.post("/send_book", response_model=Booking)
async def create_booking(booking: Booking):
    booking_dict = booking.dict()
    result = await bookings_collection.insert_one(booking_dict)
    booking_dict["id"] = str(result.inserted_id)
    return booking_dict




# 1 - WebSocket endpoint for live booking updates, this is key that starts the engine of the car
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket): # Variable injected as websocket
    await websocket.accept() # Wait for the clients in the browser to be accepted
    connected_clients.append(websocket) # Add clients to the connected clients array
    try:
        while True:
            await websocket.receive_text() # Receive info from the front-end or client
    except:
        connected_clients.remove(websocket)


# 2 - Broadcast function to notify all connected websocket clients, this is where it sends signals to the front-end, sends update because in the front-end there's a conditional where if update is received, then it will update the app
async def broadcast_booking_update():
    for ws in connected_clients[:]:
        try:
            await ws.send_text("update")
        except:
            connected_clients.remove(ws)


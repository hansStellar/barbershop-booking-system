from fastapi import APIRouter, HTTPException, WebSocket
from typing import List
import asyncio

# Database
from app.database.mongo import bookings_collection

router = APIRouter(
    prefix="/ws",
    tags=["ws"]
)

# Connected clients it's an array of the clients connected on the application at the current time
connected_clients: List[WebSocket] = []

# ! WebSockets Router

# 1 - WebSocket endpoint for live booking updates, this is key that starts the engine of the car
@router.websocket("/")
async def websocket_endpoint(websocket: WebSocket): # Variable injected as websocket
    await websocket.accept() # Wait for the clients in the browser to be accepted
    connected_clients.append(websocket) # Add clients to the connected clients array
    try:
        while True:
            await websocket.receive_text() # Receive info from the front-end or client
    except:
        connected_clients.remove(websocket)

# ! WebSockets Events

# 1 - This is the engine of the car, where all the mechanism is, where watches (event) any changes made in the database, like a long lasting hook
@router.on_event("startup")
async def start_booking_watcher():
    async def watch_bookings():
        async with bookings_collection.watch() as stream: # watch it's an integration from MongoDB and stream is ther actual connection to the MongoDB change Stream
            async for change in stream: # Loop any change in the stream
                if change["operationType"] == "insert":
                    await broadcast_booking_update()
                if change["operationType"] == "delete":
                    await broadcast_booking_update()
    asyncio.create_task(watch_bookings())
    # Asyncio Runs multiple things at the same time, Keep the server fast and responsive, Handle long-running operations like WebSocket connections, file IO, or watching a MongoDB change stream


# ! WebSockets Function 

# 1 - Broadcast function to notify all connected websocket clients, this is where it sends signals to the front-end, sends update because in the front-end there's a conditional where if update is received, then it will update the app
async def broadcast_booking_update():
    for client in connected_clients[:]:
        try:
            await client.send_text("update")
        except:
            connected_clients.remove(client)
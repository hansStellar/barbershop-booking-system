from fastapi import FastAPI
from app.routers import bookings
from fastapi.middleware.cors import CORSMiddleware
from app.routers.bookings import broadcast_booking_update, bookings_collection
import asyncio

app = FastAPI()

app.include_router(bookings.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or "*" for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3 - This is the engine of the car, where all the mechanism is, where watches any changes made in the database
@app.on_event("startup")
async def start_booking_watcher():
    async def watch_bookings():
        async with bookings_collection.watch() as stream:
            async for change in stream:
                if change["operationType"] == "insert":
                    await broadcast_booking_update()
                if change["operationType"] == "delete":
                    await broadcast_booking_update()
    asyncio.create_task(watch_bookings())
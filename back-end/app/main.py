from fastapi import FastAPI
from app.routers import bookings, websocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(bookings.router)
app.include_router(websocket.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or "*" for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


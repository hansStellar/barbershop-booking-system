from fastapi import FastAPI
from app.routers import bookings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(bookings.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or "*" for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
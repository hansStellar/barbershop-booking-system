from fastapi import FastAPI
from app.routers import bookings, websocket, users, employers, services, customers, store
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(bookings.router)
app.include_router(websocket.router)
app.include_router(users.router)
app.include_router(employers.router)
app.include_router(services.router)
app.include_router(customers.router)
app.include_router(store.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or "*" for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from fastapi import APIRouter, status, HTTPException
from passlib.hash import bcrypt
from bson import ObjectId

# Models
from app.models.users import UserLogin

# Database
from app.database.mongo import users_collection

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

# Routes

# 1 - Login
@router.post("/login")
async def login_user(user: UserLogin):
    existing = await users_collection.find_one({"email": user.email})
    if not existing:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not bcrypt.verify(user.password, existing["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "user_id": str(existing["_id"]),
        "email": existing["email"]
    }
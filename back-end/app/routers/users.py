from fastapi import APIRouter, status, HTTPException, Request
from passlib.hash import bcrypt
from bson import ObjectId
from fastapi import Response, Request, Depends
from jose import jwt, JWTError
import datetime
import os
from dotenv import load_dotenv
from fastapi.responses import JSONResponse

load_dotenv()

SECRET_KEY = os.getenv("SECRET_JWT_KEY")
ALGORITHM = "HS256"

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
async def login_user(user: UserLogin, response: Response):
    existing = await users_collection.find_one({"email": user.email})
    if not existing:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not bcrypt.verify(user.password, existing["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    payload = {
        "user_id": str(existing["_id"]),
        "email": existing["email"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {"message": "Login successful", "token": token}


# 2 - JWT Verify Token
@router.get("/verify-token")
async def verify_token(request: Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"message": "Token valid", "user": payload}
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid or expired token")
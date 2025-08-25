from pydantic import BaseModel, EmailStr
from typing import Optional, List

class Customers(BaseModel):
    name: str
    email: EmailStr
    number: Optional[str] = None
    customer_id: str
    orders: int = 0
    its_registered: bool = False

import uuid
from pydantic import BaseModel, Field
from typing import Optional

class Booking(BaseModel):
    id: Optional[str]
    name: str
    service: str
    date: str
    time: str
    price: str

import uuid
from pydantic import BaseModel, Field
from typing import Optional

class Booking(BaseModel):
    name: str
    service: str
    order_ref: str
    date: str
    time: str
    price: str
    barber_id: Optional[str] = None
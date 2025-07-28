
import uuid
from pydantic import BaseModel, Field

class Booking(BaseModel):
    name: str
    service: str
    date: str
    time: str
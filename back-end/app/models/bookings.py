
import uuid
from pydantic import BaseModel, Field

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    service: str
    date: str
    time: str
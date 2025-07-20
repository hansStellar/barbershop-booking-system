
import uuid
from pydantic import BaseModel, Field

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    service: str
    time: str
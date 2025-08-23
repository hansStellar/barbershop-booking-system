from pydantic import BaseModel
from typing import Optional

class Service(BaseModel):
    name: str
    duration: str
    price: str

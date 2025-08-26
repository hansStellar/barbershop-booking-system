from pydantic import BaseModel
from typing import Optional, List

class Store(BaseModel):
    store_name: str
    opening_time: str
    closing_time: str
    holidays: List[str]
from pydantic import BaseModel, EmailStr
from typing import Optional, List

class Employers(BaseModel):
    name: str
    email: EmailStr
    phone: str
    working_days: List[str]
    working_hours: List[str]
    profile_picture: Optional[str]
    services: List[str]  # Aquí podrías guardar los IDs de los servicios
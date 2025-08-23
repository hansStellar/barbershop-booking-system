from fastapi import APIRouter, HTTPException
from app.models.services import Service
from app.database.mongo import services_collection

router = APIRouter(
    prefix="/services",
    tags=["services"]
)

@router.get("/get_services", response_model=list[Service])
async def get_services():
    services = []
    services_database = services_collection.find({})
    async for service in services_database:
        services.append(Service(**service)) # The ** breaks the booking in pieces like: Booking(id="123", name="Hans", service="Shave", date="2025-07-29", time="03:33") because Booking it's expecting it that way
    return services

@router.post("/create_service", response_model=Service)
async def create_service(service: dict):
    service_dict = dict(service)
    await services_collection.insert_one(service_dict)
    return service_dict

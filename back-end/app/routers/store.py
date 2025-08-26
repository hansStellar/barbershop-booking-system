


from fastapi import APIRouter, Body, HTTPException
from app.database.mongo import store_collection
from bson import ObjectId

router = APIRouter(
    prefix="/store",
    tags=["store"]
)

@router.get("/get_settings")
async def get_store_settings():
    settings = await store_collection.find_one({})

    if not settings:
        return {}

    # Convert ObjectId to string
    settings["_id"] = str(settings["_id"])
    return settings

@router.put("/update_hours")
async def update_store_hours(data: dict = Body(...)):
    opening_time = data.get("opening_time")
    closing_time = data.get("closing_time")

    if not opening_time or not closing_time:
        raise HTTPException(status_code=400, detail="Missing opening or closing time")

    await store_collection.update_one(
        {},
        {"$set": {"opening_time": opening_time, "closing_time": closing_time}},
        upsert=True
    )
    return {"message": "Opening hours updated successfully"}

@router.put("/add_holiday")
async def add_holiday(data: dict = Body(...)):
    date = data.get("date")
    if not date:
        raise HTTPException(status_code=400, detail="Missing holiday date")

    await store_collection.update_one(
        {},
        {"$addToSet": {"holidays": date}},
        upsert=True
    )
    return {"message": "Holiday added"}

@router.put("/remove_holiday")
async def remove_holiday(data: dict = Body(...)):
    date = data.get("date")
    if not date:
        raise HTTPException(status_code=400, detail="Missing holiday date")

    result = await store_collection.update_one(
        {},
        {"$pull": {"holidays": date}},
        upsert=True
    )

    if result.modified_count == 0:
        return {"message": f"No holiday matched '{date}'"}
    
    return {"message": f"Holiday '{date}' removed"}
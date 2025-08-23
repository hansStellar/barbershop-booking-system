from fastapi import APIRouter, HTTPException
from app.models.employers import Employers
from app.database.mongo import employers_collection

router = APIRouter(
    prefix="/employers",
    tags=["employers"]
)

@router.post("/create_employer")
async def create_employer(employer: Employers):
    try:
        result = await employers_collection.insert_one(employer.dict())
        return {"message": "Employer created successfully", "employer_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
@router.get("/get_employers", response_model=list[Employers])
async def get_employers():
    employers = []
    employers_database = employers_collection.find({})
    async for employer in employers_database:
        employers.append(Employers(**employer))
    return employers
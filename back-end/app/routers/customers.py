from fastapi import Query, APIRouter, HTTPException, Body
from typing import Union
from app.models.customers import Customers
from app.database.mongo import customers_collection

router = APIRouter(
    prefix="/customers",
    tags=["customers"]
)

@router.post("/create_customer")
async def create_customer(customer: Customers):
    try:
        result = await customers_collection.insert_one(customer.dict())
        return {"message": "Customer has been created successfully", "customer_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error ocurred: {str(e)}")
    
@router.get("/get_customers")
async def get_customers():
    customers = []
    customers_database = customers_collection.find({})
    async for customer in customers_database:
        customers.append(Customers(**customer))
    return customers

    
@router.post("/get_customer")
async def get_customer(data: dict = Body(...)):
    customer_email = data.get("customer_email")

    if not customer_email:
        return {"error": "Missing email"}

    customer_data = await customers_collection.find_one({"email": customer_email})

    if not customer_data:
        return {"customer_found": False}

    return Customers(**customer_data)

@router.put("/update_customer")
async def update_customer(data: dict = Body(...)):
    email = data.get("email")
    orders = data.get("orders")

    if not email or orders is None:
        return {"error": "Missing email or orders"}

    result = await customers_collection.update_one(
        {"email": email},
        {"$set": {"orders": orders}}
    )

    if result.modified_count == 1:
        return {"message": "Customer orders updated successfully"}
    else:
        return {"message": "No customer found or data unchanged"}
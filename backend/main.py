from fastapi import FastAPI
from routers.event_offer import router as event_offer_router

app = FastAPI(
    title="Event-Offer Management API",
    description="A FastAPI application for managing Events, Offers, and their associations",
    version="1.0.0"
)

# Include routers
app.include_router(event_offer_router)

@app.get("/")
async def root():
    return {"message": "Event-Offer Management API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
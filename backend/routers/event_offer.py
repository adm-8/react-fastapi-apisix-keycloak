from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal, engine, Base
from models.event_offer import Event, Offer
from schemas.event_offer import EventCreate, EventUpdate, Event, OfferCreate, OfferUpdate, Offer, EventOfferCreate, EventOfferUpdate
from crud.event_offer import (
    get_event, get_event_by_code, get_events, create_event, update_event, delete_event,
    get_offer, get_offer_by_code, get_offers, create_offer, update_offer, delete_offer,
    create_event_offer_association, update_event_offer_association, delete_event_offer_association,
    get_event_offer_association
)

# Create tables
Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/api", tags=["events-offers"])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Event routes
@router.post("/events/", response_model=Event, status_code=status.HTTP_201_CREATED)
def create_new_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = get_event_by_code(db, code=event.code)
    if db_event:
        raise HTTPException(status_code=400, detail="Event with this code already exists")
    return create_event(db=db, event=event)

@router.get("/events/", response_model=List[Event])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = get_events(db, skip=skip, limit=limit)
    return events

@router.get("/events/{event_id}", response_model=Event)
def read_event(event_id: str, db: Session = Depends(get_db)):
    db_event = get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@router.put("/events/{event_id}", response_model=Event)
def update_existing_event(event_id: str, event: EventUpdate, db: Session = Depends(get_db)):
    db_event = update_event(db, event_id=event_id, event_update=event)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_event(event_id: str, db: Session = Depends(get_db)):
    success = delete_event(db, event_id=event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    return None

# Offer routes
@router.post("/offers/", response_model=Offer, status_code=status.HTTP_201_CREATED)
def create_new_offer(offer: OfferCreate, db: Session = Depends(get_db)):
    db_offer = get_offer_by_code(db, code=offer.code)
    if db_offer:
        raise HTTPException(status_code=400, detail="Offer with this code already exists")
    return create_offer(db=db, offer=offer)

@router.get("/offers/", response_model=List[Offer])
def read_offers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    offers = get_offers(db, skip=skip, limit=limit)
    return offers

@router.get("/offers/{offer_id}", response_model=Offer)
def read_offer(offer_id: str, db: Session = Depends(get_db)):
    db_offer = get_offer(db, offer_id=offer_id)
    if db_offer is None:
        raise HTTPException(status_code=404, detail="Offer not found")
    return db_offer

@router.put("/offers/{offer_id}", response_model=Offer)
def update_existing_offer(offer_id: str, offer: OfferUpdate, db: Session = Depends(get_db)):
    db_offer = update_offer(db, offer_id=offer_id, offer_update=offer)
    if db_offer is None:
        raise HTTPException(status_code=404, detail="Offer not found")
    return db_offer

@router.delete("/offers/{offer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_offer(offer_id: str, db: Session = Depends(get_db)):
    success = delete_offer(db, offer_id=offer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Offer not found")
    return None

# Event-Offer association routes
@router.post("/event-offers/", response_model=EventOfferCreate, status_code=status.HTTP_201_CREATED)
def create_event_offer_link(association: EventOfferCreate, db: Session = Depends(get_db)):
    # Check if event exists
    db_event = get_event(db, event_id=association.event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if offer exists
    db_offer = get_offer(db, offer_id=association.offer_id)
    if db_offer is None:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    return create_event_offer_association(db=db, association=association)

@router.put("/event-offers/{event_id}/{offer_id}", response_model=EventOfferUpdate)
def update_event_offer_link(event_id: str, offer_id: str, association_update: EventOfferUpdate, db: Session = Depends(get_db)):
    # Check if association exists
    existing_assoc = get_event_offer_association(db, event_id, offer_id)
    if existing_assoc is None:
        raise HTTPException(status_code=404, detail="Event-Offer association not found")
    
    return update_event_offer_association(db, event_id, offer_id, association_update)

@router.delete("/event-offers/{event_id}/{offer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event_offer_link(event_id: str, offer_id: str, db: Session = Depends(get_db)):
    success = delete_event_offer_association(db, event_id, offer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event-Offer association not found")
    return None
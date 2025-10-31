from sqlalchemy.orm import Session
from sqlalchemy import select, update, delete
from typing import List, Optional
from models.event_offer import Event, Offer, event_offer_association
from schemas.event_offer import EventCreate, EventUpdate, OfferCreate, OfferUpdate, EventOfferCreate, EventOfferUpdate
import uuid

# Event CRUD operations
def get_event(db: Session, event_id: str) -> Optional[Event]:
    return db.execute(select(Event).where(Event.id == event_id)).scalar_one_or_none()

def get_event_by_code(db: Session, code: str) -> Optional[Event]:
    return db.execute(select(Event).where(Event.code == code)).scalar_one_or_none()

def get_events(db: Session, skip: int = 0, limit: int = 100) -> List[Event]:
    return db.execute(select(Event).offset(skip).limit(limit)).scalars().all()

def create_event(db: Session, event: EventCreate) -> Event:
    db_event = Event(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def update_event(db: Session, event_id: str, event_update: EventUpdate) -> Optional[Event]:
    db_event = get_event(db, event_id)
    if db_event is None:
        return None
    
    update_data = event_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_event, key, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: str) -> bool:
    db_event = get_event(db, event_id)
    if db_event is None:
        return False
    
    db.delete(db_event)
    db.commit()
    return True

# Offer CRUD operations
def get_offer(db: Session, offer_id: str) -> Optional[Offer]:
    return db.execute(select(Offer).where(Offer.id == offer_id)).scalar_one_or_none()

def get_offer_by_code(db: Session, code: str) -> Optional[Offer]:
    return db.execute(select(Offer).where(Offer.code == code)).scalar_one_or_none()

def get_offers(db: Session, skip: int = 0, limit: int = 100) -> List[Offer]:
    return db.execute(select(Offer).offset(skip).limit(limit)).scalars().all()

def create_offer(db: Session, offer: OfferCreate) -> Offer:
    db_offer = Offer(**offer.model_dump())
    db.add(db_offer)
    db.commit()
    db.refresh(db_offer)
    return db_offer

def update_offer(db: Session, offer_id: str, offer_update: OfferUpdate) -> Optional[Offer]:
    db_offer = get_offer(db, offer_id)
    if db_offer is None:
        return None
    
    update_data = offer_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_offer, key, value)
    
    db.commit()
    db.refresh(db_offer)
    return db_offer

def delete_offer(db: Session, offer_id: str) -> bool:
    db_offer = get_offer(db, offer_id)
    if db_offer is None:
        return False
    
    db.delete(db_offer)
    db.commit()
    return True

# Event-Offer association CRUD operations
def create_event_offer_association(db: Session, association: EventOfferCreate):
    # Insert into association table
    stmt = event_offer_association.insert().values(
        event_id=association.event_id,
        offer_id=association.offer_id,
        delay_minutes=association.delay_minutes,
        action_type=association.action_type
    )
    db.execute(stmt)
    db.commit()
    return association

def update_event_offer_association(db: Session, event_id: str, offer_id: str, association_update: EventOfferUpdate):
    update_data = association_update.model_dump(exclude_unset=True)
    if update_data:
        stmt = update(event_offer_association).where(
            event_offer_association.c.event_id == event_id and 
            event_offer_association.c.offer_id == offer_id
        ).values(**update_data)
        db.execute(stmt)
        db.commit()
    return get_event_offer_association(db, event_id, offer_id)

def delete_event_offer_association(db: Session, event_id: str, offer_id: str) -> bool:
    stmt = delete(event_offer_association).where(
        event_offer_association.c.event_id == event_id and 
        event_offer_association.c.offer_id == offer_id
    )
    result = db.execute(stmt)
    db.commit()
    return result.rowcount > 0

def get_event_offer_association(db: Session, event_id: str, offer_id: str):
    stmt = select(event_offer_association).where(
        event_offer_association.c.event_id == event_id and 
        event_offer_association.c.offer_id == offer_id
    )
    return db.execute(stmt).first()
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

# Event schemas
class EventBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    lifetime_hours: Optional[int] = 0
    disable_all_campaigns: Optional[bool] = False
    queue_name: Optional[str] = "default_queue"

class EventCreate(EventBase):
    id: str

class EventUpdate(EventBase):
    pass

class EventInDBBase(EventBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Event(EventInDBBase):
    pass

class EventWithOffers(Event):
    offers: List['Offer'] = []

# Offer schemas
class OfferBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    priority: Optional[int] = 1
    target_system: Optional[str] = "default_system"

class OfferCreate(OfferBase):
    id: str

class OfferUpdate(OfferBase):
    pass

class OfferInDBBase(OfferBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Offer(OfferInDBBase):
    pass

class OfferWithEvents(Offer):
    events: List['Event'] = []

# EventOffer association schemas
class EventOfferBase(BaseModel):
    event_id: str
    offer_id: str
    delay_minutes: Optional[int] = 0
    action_type: Optional[str] = "enable"

class EventOfferCreate(EventOfferBase):
    pass

class EventOfferUpdate(BaseModel):
    delay_minutes: Optional[int] = None
    action_type: Optional[str] = None

class EventOfferInDB(EventOfferBase):
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class EventOffer(EventOfferInDB):
    pass
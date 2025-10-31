from sqlalchemy import Column, String, Text, Boolean, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
from .base import BaseModel

# Association table for many-to-many relationship
event_offer_association = Table(
    'event_offer',
    BaseModel.metadata,
    Column('event_id', String, ForeignKey('events.id'), primary_key=True),
    Column('offer_id', String, ForeignKey('offers.id'), primary_key=True),
    Column('delay_minutes', Integer, default=0),
    Column('action_type', String, default='enable')  # enable or disable
)

class Event(BaseModel):
    __tablename__ = "events"
    
    id = Column(String, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    lifetime_hours = Column(Integer, default=0)
    disable_all_campaigns = Column(Boolean, default=False)
    queue_name = Column(String, default="default_queue")
    
    # Relationship with offers
    offers = relationship(
        "Offer",
        secondary=event_offer_association,
        back_populates="events"
    )

class Offer(BaseModel):
    __tablename__ = "offers"
    
    id = Column(String, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    priority = Column(Integer, default=1)
    target_system = Column(String, default="default_system")
    
    # Relationship with events
    events = relationship(
        "Event",
        secondary=event_offer_association,
        back_populates="offers"
    )
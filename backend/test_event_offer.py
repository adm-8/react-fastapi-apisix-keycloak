import unittest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models.event_offer import Event, Offer, event_offer_association
from main import app
import os

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Override the database dependency for testing
from routers.event_offer import get_db
app.dependency_overrides[get_db] = override_get_db

class TestEventOfferAPI(unittest.TestCase):
    def setUp(self):
        # Create tables for testing
        Base.metadata.create_all(bind=engine)
        self.client = TestClient(app)
        
    def tearDown(self):
        # Drop tables after each test
        Base.metadata.drop_all(bind=engine)
        
    def test_create_event(self):
        event_data = {
            "id": "event1",
            "code": "EVENT001",
            "name": "Test Event",
            "description": "A test event",
            "lifetime_hours": 24,
            "disable_all_campaigns": False,
            "queue_name": "test_queue"
        }
        
        response = self.client.post("/api/events/", json=event_data)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["code"], "EVENT001")
        self.assertEqual(data["name"], "Test Event")
        
    def test_create_offer(self):
        offer_data = {
            "id": "offer1",
            "code": "OFFER001",
            "name": "Test Offer",
            "description": "A test offer",
            "priority": 1,
            "target_system": "test_system"
        }
        
        response = self.client.post("/api/offers/", json=offer_data)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["code"], "OFFER001")
        self.assertEqual(data["name"], "Test Offer")
        
    def test_get_events(self):
        response = self.client.get("/api/events/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        
    def test_get_offers(self):
        response = self.client.get("/api/offers/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)

if __name__ == "__main__":
    unittest.main()
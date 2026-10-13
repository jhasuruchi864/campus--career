from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class EventBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    event_type: str = "Hackathon"
    location: str
    start_time: datetime
    end_time: Optional[datetime] = None
    registration_url: Optional[str] = None
    banner_url: Optional[str] = None


class EventCreate(EventBase):
    pass


class EventOut(EventBase):
    id: int
    creator_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

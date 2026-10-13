from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.repositories.event_repo import EventRepository
from app.models.event import Event
from app.schemas.event import EventCreate, EventOut


class EventService:
    def __init__(self, db: Session):
        self.db = db
        self.event_repo = EventRepository(db)

    def create_event(self, creator_id: int, event_in: EventCreate) -> EventOut:
        end_time = event_in.end_time or event_in.start_time
        new_event = Event(
            creator_id=creator_id,
            title=event_in.title.strip(),
            description=event_in.description.strip(),
            event_type=event_in.event_type.strip(),
            location=event_in.location.strip(),
            start_time=event_in.start_time,
            end_time=end_time,
            registration_url=event_in.registration_url,
            banner_url=event_in.banner_url
        )
        created = self.event_repo.create(new_event)
        return EventOut.model_validate(created)

    def list_events(self, event_type: Optional[str] = None, search: Optional[str] = None) -> List[EventOut]:
        events = self.event_repo.get_all(event_type=event_type, search=search)
        return [EventOut.model_validate(e) for e in events]

    def get_event(self, event_id: int) -> EventOut:
        event = self.event_repo.get_by_id(event_id)
        if not event:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found.")
        return EventOut.model_validate(event)

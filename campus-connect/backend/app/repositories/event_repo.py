from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.event import Event


class EventRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, event_id: int) -> Optional[Event]:
        return self.db.query(Event).filter(Event.id == event_id).first()

    def get_all(self, event_type: Optional[str] = None, search: Optional[str] = None) -> List[Event]:
        query = self.db.query(Event).order_by(Event.start_time.asc())

        if event_type and event_type != "All":
            query = query.filter(Event.event_type.ilike(event_type.strip()))

        if search:
            pattern = f"%{search.strip()}%"
            query = query.filter(
                (Event.title.ilike(pattern)) |
                (Event.description.ilike(pattern)) |
                (Event.location.ilike(pattern))
            )

        return query.all()

    def create(self, event: Event) -> Event:
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

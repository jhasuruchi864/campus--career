from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.event_service import EventService
from app.schemas.event import EventCreate, EventOut
from app.api.v1.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/events", tags=["Campus Events"])


@router.get("", response_model=List[EventOut])
def list_events(
    type: Optional[str] = Query(None, description="Event type (Hackathon, Workshop, Pitch Night)"),
    search: Optional[str] = Query(None, description="Search keyword in title, location, description"),
    db: Session = Depends(get_db)
):
    """Retrieves upcoming campus hackathons and workshops."""
    service = EventService(db)
    return service.list_events(event_type=type, search=search)


@router.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(
    event_in: EventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Publishes a new campus event or hackathon listing."""
    service = EventService(db)
    return service.create_event(current_user.id, event_in)


@router.get("/{event_id}", response_model=EventOut)
def get_event_detail(event_id: int, db: Session = Depends(get_db)):
    """Fetches details for a single campus event."""
    service = EventService(db)
    return service.get_event(event_id)

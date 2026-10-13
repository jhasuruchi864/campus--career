from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.project_service import ProjectService
from app.schemas.project import ProjectCreate, JoinRequestCreate, JoinRequestUpdate
from app.api.v1.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/projects", tags=["Projects & Teams"])


@router.get("")
def list_projects(
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status (Recruiting, In Progress, etc.)"),
    search: Optional[str] = Query(None, description="Search keyword in title, tagline, or description"),
    db: Session = Depends(get_db)
):
    """Lists campus projects matching search and category filters."""
    service = ProjectService(db)
    return service.list_projects(category=category, status=status, search=search)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a new project and designates the creator as Project Lead."""
    service = ProjectService(db)
    return service.create_project(current_user.id, project_in)


@router.get("/{project_id}")
def get_project_detail(project_id: int, db: Session = Depends(get_db)):
    """Retrieves full project details, team roster, and pending join requests."""
    service = ProjectService(db)
    return service.get_project_detail(project_id)


@router.post("/{project_id}/join", status_code=status.HTTP_201_CREATED)
def submit_join_request(
    project_id: int,
    request_in: JoinRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submits an application pitch from a student to join an active project."""
    service = ProjectService(db)
    return service.submit_join_request(project_id, current_user.id, request_in)


@router.put("/{project_id}/requests/{request_id}")
def respond_to_join_request(
    project_id: int,
    request_id: int,
    status_update: JoinRequestUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Allows project leads to Accept or Reject pending student join requests."""
    service = ProjectService(db)
    return service.respond_join_request(
        project_id=project_id,
        request_id=request_id,
        current_user_id=current_user.id,
        status_str=status_update.status
    )

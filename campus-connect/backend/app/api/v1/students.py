from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.student_service import StudentService
from app.schemas.profile import ProfileUpdate, SkillOut
from app.api.v1.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/students", tags=["Students & Profiles"])


@router.get("")
def list_students(
    search: Optional[str] = Query(None, description="Search by name, university, or major"),
    skill: Optional[str] = Query(None, description="Filter by technical skill"),
    db: Session = Depends(get_db)
):
    """Lists student profiles across campus with optional skill and name filters."""
    service = StudentService(db)
    return service.list_students(search=search, skill=skill)


@router.get("/profile/{user_id}")
def get_student_profile(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches a specific student profile or current user if 'me'."""
    target_id = current_user.id if user_id == "me" else int(user_id)
    service = StudentService(db)
    return service.get_profile_by_user_id(target_id)


@router.put("/profile")
def update_own_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates the logged-in student's bio, graduation year, links, and technical skills."""
    service = StudentService(db)
    return service.update_profile(current_user.id, profile_in)


@router.get("/skills", response_model=List[SkillOut])
def get_skills_catalog(db: Session = Depends(get_db)):
    """Fetches global skills catalog for autocomplete."""
    service = StudentService(db)
    return service.list_skills()

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.auth_service import AuthService
from app.services.student_service import StudentService
from app.schemas.auth import Token, LoginRequest
from app.schemas.user import UserCreate
from app.api.v1.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_student(user_in: UserCreate, db: Session = Depends(get_db)):
    """Registers a new student user and returns access credentials with initial profile."""
    auth_service = AuthService(db)
    return auth_service.register(user_in)


@router.post("/login", response_model=Token)
def login_student(login_in: LoginRequest, db: Session = Depends(get_db)):
    """Authenticates a student and issues a signed JWT token."""
    auth_service = AuthService(db)
    return auth_service.login(login_in)


@router.get("/me")
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches currently authenticated student user details and full profile."""
    student_service = StudentService(db)
    return student_service.get_profile_by_user_id(current_user.id)

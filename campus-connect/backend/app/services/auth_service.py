from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.user_repo import UserRepository
from app.repositories.student_repo import StudentRepository
from app.models.user import User
from app.models.profile import StudentProfile
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.user import UserCreate
from app.schemas.auth import LoginRequest, Token


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.student_repo = StudentRepository(db)

    def register(self, user_in: UserCreate) -> Token:
        # Check if user already exists
        existing = self.user_repo.get_by_email(user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this university email already exists."
            )

        # Hash password securely using bcrypt
        hashed_pw = get_password_hash(user_in.password)

        new_user = User(
            email=user_in.email.strip().lower(),
            hashed_password=hashed_pw,
            full_name=user_in.full_name.strip(),
            avatar_url=user_in.avatar_url
        )
        created_user = self.user_repo.create(new_user)

        # Create associated student profile
        new_profile = StudentProfile(
            user_id=created_user.id,
            university=user_in.university or "University Campus",
            major=user_in.major or "Computer Science",
            graduation_year=user_in.graduation_year or 2026,
            preferred_role=user_in.preferred_role or "Student Builder",
            bio=f"Student at {user_in.university or 'University Campus'} passionate about technology collaboration."
        )
        self.student_repo.create_profile(new_profile)

        # Issue JWT token
        token_str = create_access_token(subject=created_user.id)

        user_data = {
            "id": created_user.id,
            "email": created_user.email,
            "full_name": created_user.full_name,
            "university": new_profile.university,
            "major": new_profile.major,
            "graduation_year": new_profile.graduation_year,
            "preferred_role": new_profile.preferred_role,
            "avatar_url": created_user.avatar_url
        }

        return Token(access_token=token_str, user=user_data)

    def login(self, login_in: LoginRequest) -> Token:
        user = self.user_repo.get_by_email(login_in.email)
        if not user or not verify_password(login_in.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid university email or password."
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User account is deactivated."
            )

        token_str = create_access_token(subject=user.id)

        profile = self.student_repo.get_profile_by_user_id(user.id)
        user_data = {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "avatar_url": user.avatar_url,
            "university": profile.university if profile else "University Campus",
            "major": profile.major if profile else "Computer Science",
            "graduation_year": profile.graduation_year if profile else 2026,
            "preferred_role": profile.preferred_role if profile else "Student Builder"
        }

        return Token(access_token=token_str, user=user_data)

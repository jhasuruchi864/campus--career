from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    university: Optional[str] = "University Campus"
    major: Optional[str] = "Computer Science"
    graduation_year: Optional[int] = 2026
    preferred_role: Optional[str] = "Student Builder"


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

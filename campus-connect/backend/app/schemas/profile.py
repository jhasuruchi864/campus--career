from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class SkillBase(BaseModel):
    name: str
    category: str = "General"


class SkillCreate(SkillBase):
    pass


class SkillOut(SkillBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class StudentSkillInput(BaseModel):
    name: str
    level: Optional[str] = "Intermediate"


class StudentSkillOut(BaseModel):
    id: int
    name: str
    category: str
    proficiency_level: str
    years_experience: float
    model_config = ConfigDict(from_attributes=True)


class ProfileBase(BaseModel):
    university: str
    major: str
    graduation_year: int
    bio: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    preferred_role: Optional[str] = None
    interests: Optional[str] = None
    availability_hours_per_week: int = 10


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(BaseModel):
    university: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[int] = None
    bio: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    preferred_role: Optional[str] = None
    interests: Optional[str] = None
    availability_hours_per_week: Optional[int] = None
    skills: Optional[List[StudentSkillInput]] = None


class ProfileOut(ProfileBase):
    id: int
    user_id: int
    skills: List[StudentSkillOut] = []
    model_config = ConfigDict(from_attributes=True)


class StudentDirectoryOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    avatar_url: Optional[str] = None
    university: str
    major: str
    graduation_year: int
    bio: Optional[str] = None
    preferred_role: Optional[str] = None
    availability_hours_per_week: int
    skills: List[str] = []

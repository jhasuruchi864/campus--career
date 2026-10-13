from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, ConfigDict


class ProjectSkillOut(BaseModel):
    name: str
    required_level: str
    model_config = ConfigDict(from_attributes=True)


class TeamMemberOut(BaseModel):
    id: int
    user_id: int
    name: str
    role: str
    avatar_url: Optional[str] = None
    joined_at: datetime


class JoinRequestCreate(BaseModel):
    pitch_message: str = Field(..., min_length=10, description="Pitch must be at least 10 characters")


class JoinRequestUpdate(BaseModel):
    status: str = Field(..., pattern="^(Accepted|Rejected)$")


class JoinRequestOut(BaseModel):
    id: int
    project_id: int
    applicant_id: int
    applicant_name: str
    applicant_avatar: Optional[str] = None
    pitch_message: str
    status: str
    created_at: datetime


class ProjectBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    tagline: str = Field(..., min_length=5, max_length=300)
    description: str = Field(..., min_length=10)
    category: str = "Web Development"
    max_team_size: int = Field(default=4, ge=2, le=12)
    github_repo: Optional[str] = None
    demo_url: Optional[str] = None


class ProjectCreate(ProjectBase):
    required_skills: List[str] = []


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    max_team_size: Optional[int] = None
    github_repo: Optional[str] = None
    demo_url: Optional[str] = None
    required_skills: Optional[List[str]] = None


class ProjectOut(ProjectBase):
    id: int
    owner_id: int
    status: str
    created_at: datetime
    team_members_count: int = 1
    required_skills: List[str] = []
    model_config = ConfigDict(from_attributes=True)


class ProjectDetailOut(ProjectOut):
    team_members: List[TeamMemberOut] = []
    join_requests: List[JoinRequestOut] = []

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


# ===================== TASK SCHEMAS =====================
class TaskCreate(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    status: str = Field(default="todo")  # todo, in_progress, review, done
    priority: str = Field(default="medium")  # low, medium, high
    assigned_to: Optional[int] = None
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[int] = None
    due_date: Optional[datetime] = None


class TaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    assigned_to: Optional[int]
    assignee_name: Optional[str] = None
    assignee_avatar: Optional[str] = None
    due_date: Optional[datetime]
    created_at: datetime


# ===================== CHAT SCHEMAS =====================
class ChatMessageCreate(BaseModel):
    project_id: Optional[int] = None
    receiver_id: Optional[int] = None
    message: str = Field(..., min_length=1)


class ChatMessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: Optional[int]
    sender_id: int
    sender_name: str
    sender_avatar: Optional[str] = None
    receiver_id: Optional[int]
    message: str
    created_at: datetime


# ===================== INTERNSHIP SCHEMAS =====================
class InternshipCreate(BaseModel):
    company_name: str
    logo_url: Optional[str] = None
    title: str
    role_type: str = "Internship"
    location: str = "Remote"
    stipend: Optional[str] = None
    deadline: Optional[datetime] = None
    description: str
    required_skills: Optional[str] = None
    apply_url: Optional[str] = None


class InternshipOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_name: str
    logo_url: Optional[str]
    title: str
    role_type: str
    location: str
    stipend: Optional[str]
    deadline: Optional[datetime]
    description: str
    required_skills: Optional[str]
    apply_url: Optional[str]
    created_at: datetime
    application_count: int = 0
    has_applied: bool = False


class InternshipApplyRequest(BaseModel):
    pitch_note: Optional[str] = None


# ===================== MENTOR SCHEMAS =====================
class MentorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    company: str
    role: str
    university: str
    graduation_year: int
    expertise: str
    avatar_url: Optional[str]
    linkedin_url: Optional[str]
    bio: Optional[str]
    available_slots: int


class MentorBookingRequest(BaseModel):
    topic: str
    scheduled_at: datetime
    notes: Optional[str] = None


# ===================== NOTIFICATION SCHEMAS =====================
class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    title: str
    message: str
    type: str
    link_url: Optional[str]
    is_read: bool
    created_at: datetime

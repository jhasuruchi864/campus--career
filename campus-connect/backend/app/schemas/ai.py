from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class MatchBreakdown(BaseModel):
    skill_score: float
    interest_score: float
    role_score: float


class MatchedStudentInfo(BaseModel):
    id: int
    user_id: int
    full_name: str
    avatar_url: Optional[str] = None
    university: str
    graduation_year: int
    preferred_role: Optional[str] = None
    bio: Optional[str] = None
    availability_hours_per_week: int
    skills: List[str] = []


class TeammateMatchOut(BaseModel):
    id: int
    student: MatchedStudentInfo
    match_score: float
    score_breakdown: MatchBreakdown
    match_reasons: List[str] = []


class SkillGapOut(BaseModel):
    project_id: int
    missing_skills: List[str] = []
    recommendations: List[str] = []

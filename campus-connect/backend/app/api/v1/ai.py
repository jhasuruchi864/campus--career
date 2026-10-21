from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.project_service import ProjectService
from app.services.student_service import StudentService
from app.ai.matching import matching_engine
from app.ai.recommendations import analyze_skill_gaps
from app.ai.intelligence import analyze_resume_ats, build_hackathon_team, generate_project_spec

router = APIRouter(prefix="/ai", tags=["AI Matching & Recommendations"])


class ResumeAnalyzeRequest(BaseModel):
    resume_text: str = Field(..., min_length=20, description="Raw or parsed resume text")
    target_role: Optional[str] = None


class HackathonTeamRequest(BaseModel):
    theme: str = Field(..., description="Theme of hackathon e.g. Healthcare AI, Web3, Climate")
    hackathon_name: Optional[str] = "Campus Hack 2026"


class ProjectGeneratorRequest(BaseModel):
    domain: str = Field(..., description="Domain like Fintech, HealthTech, AI Agents, Education")
    difficulty: str = Field(default="Intermediate")
    preferred_stack: Optional[str] = None


@router.get("/match-teammates")
def get_teammate_recommendations(
    project_id: Optional[int] = Query(None, description="Target project to optimize matches for"),
    db: Session = Depends(get_db)
):
    """
    Computes explainable AI teammate match scores using TF-IDF skill cosine similarity,
    complementary role synergy, and mutual availability.
    """
    proj_service = ProjectService(db)
    student_service = StudentService(db)

    # 1. Determine target requirements
    if project_id:
        target_project = proj_service.get_project_detail(project_id)
    else:
        # If no project specified, choose first active recruiting project or default profile
        all_projs = proj_service.list_projects()
        target_project = all_projs[0] if all_projs else {
            "title": "General College Project",
            "required_skills": ["React", "Python", "FastAPI", "Machine Learning"],
            "category": "AI & Machine Learning"
        }

    # 2. Get all candidate students
    all_students = student_service.list_students()

    # Exclude students who are already on this team if project exists
    existing_member_ids = set()
    if "team_members" in target_project:
        existing_member_ids = {m["user_id"] for m in target_project["team_members"]}

    candidates = [s for s in all_students if s["user_id"] not in existing_member_ids]

    # 3. Execute Scikit-learn Vectorizer & Match Engine
    ranked_matches = matching_engine.match_candidates_for_project(
        project_dict=target_project,
        students_list=candidates,
        top_k=8
    )

    return ranked_matches


@router.get("/skill-gaps/{project_id}")
def get_project_skill_gaps(project_id: int, db: Session = Depends(get_db)):
    """
    Identifies unfulfilled skill requirements in an active project team and returns actionable suggestions.
    """
    proj_service = ProjectService(db)
    student_service = StudentService(db)

    project = proj_service.get_project_detail(project_id)
    required_skills = project.get("required_skills", [])

    # Collect team members' validated skills
    current_team_skills = []
    for member in project.get("team_members", []):
        try:
            profile = student_service.get_profile_by_user_id(member["user_id"])
            current_team_skills.extend([s["name"] for s in profile.get("skills", [])])
        except Exception:
            pass

    return analyze_skill_gaps(
        required_skills=required_skills,
        current_team_skills=current_team_skills,
        category=project.get("category", "")
    )


@router.post("/resume-analyzer")
def analyze_resume(
    payload: ResumeAnalyzeRequest,
    db: Session = Depends(get_db)
):
    """
    Analyzes resume text using NLP keyword extraction, calculates ATS compatibility score,
    identifies skill strengths/gaps, and surfaces top matching campus capstones.
    """
    proj_service = ProjectService(db)
    all_projs = proj_service.list_projects()

    return analyze_resume_ats(
        resume_text=payload.resume_text,
        target_role=payload.target_role,
        projects_list=all_projs
    )


@router.post("/hackathon-team-builder")
def form_hackathon_team(
    payload: HackathonTeamRequest,
    db: Session = Depends(get_db)
):
    """
    Synthesizes an optimal 4-person dream hackathon squad with high role complementarity
    (Architect, AI Engineer, Frontend Dev, Product Designer).
    """
    student_service = StudentService(db)
    all_students = student_service.list_students()

    return build_hackathon_team(
        theme=payload.theme,
        candidates=all_students
    )


@router.post("/project-generator")
def generate_project_idea(
    payload: ProjectGeneratorRequest
):
    """
    Generates innovative capstone project proposals, system architecture, tech stacks,
    and 4-week roadmaps based on domain criteria.
    """
    return generate_project_spec(
        domain=payload.domain,
        difficulty=payload.difficulty,
        preferred_stack=payload.preferred_stack
    )


class MockInterviewRequest(BaseModel):
    skill: str = Field(..., description="Target skill e.g. React, Python, FastAPI, Machine Learning")
    difficulty: str = Field(default="Intermediate")


@router.post("/mock-interview")
def get_mock_interview(
    payload: MockInterviewRequest
):
    """
    Generates targeted technical interview questions, hints, and model answers based on chosen skill.
    """
    from app.ai.intelligence import generate_mock_interview
    return generate_mock_interview(
        skill=payload.skill,
        difficulty=payload.difficulty
    )


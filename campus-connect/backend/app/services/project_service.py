from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.project_repo import ProjectRepository
from app.repositories.user_repo import UserRepository
from app.models.project import Project, TeamMember, JoinRequest
from app.schemas.project import ProjectCreate, ProjectUpdate, JoinRequestCreate


class ProjectService:
    def __init__(self, db: Session):
        self.db = db
        self.project_repo = ProjectRepository(db)
        self.user_repo = UserRepository(db)

    def create_project(self, owner_id: int, project_in: ProjectCreate) -> Dict[str, Any]:
        new_project = Project(
            owner_id=owner_id,
            title=project_in.title.strip(),
            tagline=project_in.tagline.strip(),
            description=project_in.description.strip(),
            category=project_in.category.strip(),
            max_team_size=project_in.max_team_size,
            github_repo=project_in.github_repo,
            demo_url=project_in.demo_url,
            status="Recruiting"
        )
        created = self.project_repo.create(new_project)

        # Associate required skills
        if project_in.required_skills:
            self.project_repo.add_project_skills(created.id, project_in.required_skills)

        # Auto add owner as Project Lead
        self.project_repo.add_team_member(created.id, owner_id, role="Project Lead")

        return self.get_project_detail(created.id)

    def list_projects(
        self,
        category: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        projects = self.project_repo.get_all(category=category, status=status, search=search)
        results = []
        for p in projects:
            skills = [ps.skill.name for ps in p.required_skills]
            results.append({
                "id": p.id,
                "owner_id": p.owner_id,
                "title": p.title,
                "tagline": p.tagline,
                "description": p.description,
                "category": p.category,
                "status": p.status,
                "max_team_size": p.max_team_size,
                "team_members_count": len(p.team_members),
                "github_repo": p.github_repo,
                "demo_url": p.demo_url,
                "created_at": p.created_at,
                "required_skills": skills
            })
        return results

    def get_project_detail(self, project_id: int) -> Dict[str, Any]:
        p = self.project_repo.get_by_id(project_id)
        if not p:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

        skills = [ps.skill.name for ps in p.required_skills]
        members = [
            {
                "id": m.id,
                "user_id": m.user_id,
                "name": m.user.full_name,
                "role": m.role,
                "avatar_url": m.user.avatar_url,
                "joined_at": m.joined_at
            }
            for m in p.team_members
        ]
        requests = [
            {
                "id": req.id,
                "project_id": req.project_id,
                "applicant_id": req.applicant_id,
                "applicant_name": req.applicant.full_name,
                "applicant_avatar": req.applicant.avatar_url,
                "pitch_message": req.pitch_message,
                "status": req.status,
                "created_at": req.created_at
            }
            for req in p.join_requests
        ]

        return {
            "id": p.id,
            "owner_id": p.owner_id,
            "title": p.title,
            "tagline": p.tagline,
            "description": p.description,
            "category": p.category,
            "status": p.status,
            "max_team_size": p.max_team_size,
            "team_members_count": len(members),
            "github_repo": p.github_repo,
            "demo_url": p.demo_url,
            "created_at": p.created_at,
            "required_skills": skills,
            "team_members": members,
            "join_requests": requests
        }

    def submit_join_request(self, project_id: int, applicant_id: int, request_in: JoinRequestCreate) -> Dict[str, Any]:
        p = self.project_repo.get_by_id(project_id)
        if not p:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

        # Check if already a member
        for m in p.team_members:
            if m.user_id == applicant_id:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You are already a member of this project.")

        # Check capacity
        if len(p.team_members) >= p.max_team_size:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Project team is already full.")

        # Check existing request
        for req in p.join_requests:
            if req.applicant_id == applicant_id:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already submitted an application.")

        created_req = self.project_repo.create_join_request(project_id, applicant_id, request_in.pitch_message)
        applicant = self.user_repo.get_by_id(applicant_id)

        return {
            "id": created_req.id,
            "project_id": created_req.project_id,
            "applicant_id": created_req.applicant_id,
            "applicant_name": applicant.full_name if applicant else "Student",
            "pitch_message": created_req.pitch_message,
            "status": created_req.status,
            "created_at": created_req.created_at
        }

    def respond_join_request(self, project_id: int, request_id: int, current_user_id: int, status_str: str) -> Dict[str, Any]:
        p = self.project_repo.get_by_id(project_id)
        if not p:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

        if p.owner_id != current_user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the project owner can review join requests.")

        req = self.project_repo.get_join_request(project_id, request_id)
        if not req:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Join request not found.")

        req.status = status_str
        self.project_repo.update_join_request(req)

        if status_str == "Accepted":
            if len(p.team_members) < p.max_team_size:
                self.project_repo.add_team_member(project_id, req.applicant_id, role="Team Collaborator")
                if len(p.team_members) + 1 >= p.max_team_size:
                    p.status = "In Progress"
                    self.project_repo.update(p)

        return {"message": f"Join request has been {status_str.lower()}.", "status": status_str}

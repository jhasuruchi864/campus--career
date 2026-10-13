from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from app.models.project import Project, ProjectSkill, TeamMember, JoinRequest
from app.models.profile import Skill


class ProjectRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, project_id: int) -> Optional[Project]:
        return (
            self.db.query(Project)
            .filter(Project.id == project_id)
            .options(
                joinedload(Project.owner),
                joinedload(Project.required_skills).joinedload(ProjectSkill.skill),
                joinedload(Project.team_members).joinedload(TeamMember.user),
                joinedload(Project.join_requests).joinedload(JoinRequest.applicant)
            )
            .first()
        )

    def get_all(
        self,
        category: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Project]:
        query = (
            self.db.query(Project)
            .options(
                joinedload(Project.owner),
                joinedload(Project.required_skills).joinedload(ProjectSkill.skill),
                joinedload(Project.team_members)
            )
            .order_by(Project.created_at.desc())
        )

        if category and category != "All":
            query = query.filter(Project.category.ilike(category.strip()))

        if status:
            query = query.filter(Project.status == status.strip())

        if search:
            pattern = f"%{search.strip()}%"
            query = query.filter(
                (Project.title.ilike(pattern)) |
                (Project.tagline.ilike(pattern)) |
                (Project.description.ilike(pattern))
            )

        return query.all()

    def create(self, project: Project) -> Project:
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        return project

    def update(self, project: Project) -> Project:
        self.db.commit()
        self.db.refresh(project)
        return project

    def add_project_skills(self, project_id: int, skill_names: List[str]):
        self.db.query(ProjectSkill).filter(ProjectSkill.project_id == project_id).delete()
        for name in skill_names:
            clean = name.strip()
            if not clean:
                continue
            skill = self.db.query(Skill).filter(Skill.name.ilike(clean)).first()
            if not skill:
                skill = Skill(name=clean, category="General")
                self.db.add(skill)
                self.db.commit()
                self.db.refresh(skill)

            ps = ProjectSkill(project_id=project_id, skill_id=skill.id)
            self.db.add(ps)
        self.db.commit()

    def add_team_member(self, project_id: int, user_id: int, role: str) -> TeamMember:
        member = TeamMember(project_id=project_id, user_id=user_id, role=role)
        self.db.add(member)
        self.db.commit()
        self.db.refresh(member)
        return member

    def create_join_request(self, project_id: int, applicant_id: int, pitch: str) -> JoinRequest:
        req = JoinRequest(project_id=project_id, applicant_id=applicant_id, pitch_message=pitch, status="Pending")
        self.db.add(req)
        self.db.commit()
        self.db.refresh(req)
        return req

    def get_join_request(self, project_id: int, request_id: int) -> Optional[JoinRequest]:
        return (
            self.db.query(JoinRequest)
            .filter(JoinRequest.id == request_id, JoinRequest.project_id == project_id)
            .first()
        )

    def update_join_request(self, req: JoinRequest) -> JoinRequest:
        self.db.commit()
        self.db.refresh(req)
        return req

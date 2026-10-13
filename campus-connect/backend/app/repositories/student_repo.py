from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from app.models.profile import StudentProfile, Skill, StudentSkill
from app.models.user import User


class StudentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_profile_by_user_id(self, user_id: int) -> Optional[StudentProfile]:
        return (
            self.db.query(StudentProfile)
            .filter(StudentProfile.user_id == user_id)
            .options(joinedload(StudentProfile.skills).joinedload(StudentSkill.skill))
            .first()
        )

    def get_profile_by_id(self, profile_id: int) -> Optional[StudentProfile]:
        return (
            self.db.query(StudentProfile)
            .filter(StudentProfile.id == profile_id)
            .options(joinedload(StudentProfile.skills).joinedload(StudentSkill.skill))
            .first()
        )

    def get_all_students(self, search: Optional[str] = None, skill_name: Optional[str] = None) -> List[StudentProfile]:
        query = (
            self.db.query(StudentProfile)
            .join(StudentProfile.user)
            .options(
                joinedload(StudentProfile.user),
                joinedload(StudentProfile.skills).joinedload(StudentSkill.skill)
            )
        )

        if search:
            pattern = f"%{search.strip()}%"
            query = query.filter(
                (User.full_name.ilike(pattern)) |
                (StudentProfile.university.ilike(pattern)) |
                (StudentProfile.major.ilike(pattern)) |
                (StudentProfile.preferred_role.ilike(pattern))
            )

        if skill_name:
            query = query.join(StudentProfile.skills).join(StudentSkill.skill).filter(
                Skill.name.ilike(f"%{skill_name.strip()}%")
            )

        return query.all()

    def create_profile(self, profile: StudentProfile) -> StudentProfile:
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def update_profile(self, profile: StudentProfile) -> StudentProfile:
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def get_or_create_skill(self, name: str, category: str = "General") -> Skill:
        clean_name = name.strip()
        skill = self.db.query(Skill).filter(Skill.name.ilike(clean_name)).first()
        if not skill:
            skill = Skill(name=clean_name, category=category)
            self.db.add(skill)
            self.db.commit()
            self.db.refresh(skill)
        return skill

    def get_all_skills(self) -> List[Skill]:
        return self.db.query(Skill).order_by(Skill.name.asc()).all()

    def set_student_skills(self, profile_id: int, skills_data: List[dict]):
        # Clear existing
        self.db.query(StudentSkill).filter(StudentSkill.profile_id == profile_id).delete()
        for item in skills_data:
            skill_obj = self.get_or_create_skill(item["name"])
            student_skill = StudentSkill(
                profile_id=profile_id,
                skill_id=skill_obj.id,
                proficiency_level=item.get("level", "Intermediate"),
                years_experience=item.get("years", 1.0)
            )
            self.db.add(student_skill)
        self.db.commit()

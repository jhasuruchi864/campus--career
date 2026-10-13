from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.student_repo import StudentRepository
from app.repositories.user_repo import UserRepository
from app.schemas.profile import ProfileUpdate, StudentDirectoryOut, ProfileOut, SkillOut


class StudentService:
    def __init__(self, db: Session):
        self.db = db
        self.student_repo = StudentRepository(db)
        self.user_repo = UserRepository(db)

    def get_profile_by_user_id(self, user_id: int) -> Dict[str, Any]:
        profile = self.student_repo.get_profile_by_user_id(user_id)
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found.")

        user = profile.user
        skills_formatted = [
            {"name": ss.skill.name, "level": ss.proficiency_level, "category": ss.skill.category}
            for ss in profile.skills
        ]

        return {
            "id": profile.id,
            "user_id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "avatar_url": user.avatar_url,
            "university": profile.university,
            "major": profile.major,
            "graduation_year": profile.graduation_year,
            "bio": profile.bio,
            "preferred_role": profile.preferred_role,
            "interests": profile.interests,
            "availability_hours_per_week": profile.availability_hours_per_week,
            "github_url": profile.github_url,
            "linkedin_url": profile.linkedin_url,
            "portfolio_url": profile.portfolio_url,
            "skills": skills_formatted
        }

    def update_profile(self, user_id: int, update_data: ProfileUpdate) -> Dict[str, Any]:
        profile = self.student_repo.get_profile_by_user_id(user_id)
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found.")

        update_dict = update_data.model_dump(exclude_unset=True)
        skills_input = update_dict.pop("skills", None)

        for key, val in update_dict.items():
            setattr(profile, key, val)

        self.student_repo.update_profile(profile)

        if skills_input is not None:
            self.student_repo.set_student_skills(profile.id, skills_input)

        return self.get_profile_by_user_id(user_id)

    def list_students(self, search: Optional[str] = None, skill: Optional[str] = None) -> List[Dict[str, Any]]:
        profiles = self.student_repo.get_all_students(search=search, skill_name=skill)
        results = []
        for p in profiles:
            skill_names = [ss.skill.name for ss in p.skills]
            results.append({
                "id": p.id,
                "user_id": p.user.id,
                "full_name": p.user.full_name,
                "email": p.user.email,
                "avatar_url": p.user.avatar_url,
                "university": p.university,
                "major": p.major,
                "graduation_year": p.graduation_year,
                "bio": p.bio,
                "preferred_role": p.preferred_role,
                "availability_hours_per_week": p.availability_hours_per_week,
                "skills": skill_names
            })
        return results

    def list_skills(self) -> List[SkillOut]:
        skills = self.student_repo.get_all_skills()
        return [SkillOut.model_validate(s) for s in skills]

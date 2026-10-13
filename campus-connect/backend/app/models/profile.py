from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False)

    # Relationships
    student_skills = relationship("StudentSkill", back_populates="skill", cascade="all, delete-orphan")
    project_skills = relationship("ProjectSkill", back_populates="skill", cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    university = Column(String(255), nullable=False)
    major = Column(String(150), nullable=False)
    graduation_year = Column(Integer, nullable=False)
    bio = Column(Text, nullable=True)
    github_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    portfolio_url = Column(String(255), nullable=True)
    preferred_role = Column(String(100), nullable=True)
    interests = Column(Text, nullable=True)  # Comma-separated or JSON string
    availability_hours_per_week = Column(Integer, default=10, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="profile")
    skills = relationship("StudentSkill", back_populates="profile", cascade="all, delete-orphan")


class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    proficiency_level = Column(String(50), default="Intermediate", nullable=False)  # Beginner, Intermediate, Advanced, Expert
    years_experience = Column(Numeric(3, 1), default=1.0, nullable=False)

    __table_args__ = (UniqueConstraint("profile_id", "skill_id", name="uq_profile_skill"),)

    # Relationships
    profile = relationship("StudentProfile", back_populates="skills")
    skill = relationship("Skill", back_populates="student_skills")

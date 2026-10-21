from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base


class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(150), nullable=False)
    logo_url = Column(String(500), nullable=True)
    title = Column(String(200), nullable=False)
    role_type = Column(String(50), default="Internship", nullable=False)  # Internship, Full-time, Research RA
    location = Column(String(100), default="Remote", nullable=False)  # Remote, On-Campus, Hybrid
    stipend = Column(String(100), nullable=True)  # e.g., "$35/hr" or "Unpaid (Academic Credit)"
    deadline = Column(DateTime, nullable=True)
    description = Column(Text, nullable=False)
    required_skills = Column(Text, nullable=True)  # Comma-separated list of skills
    apply_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    applications = relationship("InternshipApplication", back_populates="internship", cascade="all, delete-orphan")


class InternshipApplication(Base):
    __tablename__ = "internship_applications"

    id = Column(Integer, primary_key=True, index=True)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="Applied", nullable=False)  # Applied, Under Review, Interview, Selected
    pitch_note = Column(Text, nullable=True)
    applied_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    internship = relationship("Internship", back_populates="applications")
    applicant = relationship("User")

    __table_args__ = (
        UniqueConstraint("internship_id", "user_id", name="uq_internship_applicant"),
    )

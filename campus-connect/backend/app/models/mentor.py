from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base


class AlumniMentor(Base):
    __tablename__ = "alumni_mentors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    company = Column(String(150), nullable=False)
    role = Column(String(150), nullable=False)
    university = Column(String(150), nullable=False)
    graduation_year = Column(Integer, nullable=False)
    expertise = Column(String(255), nullable=False)  # Comma-separated domains
    avatar_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    available_slots = Column(Integer, default=3, nullable=False)

    # Relationships
    bookings = relationship("MentorshipBooking", back_populates="mentor", cascade="all, delete-orphan")


class MentorshipBooking(Base):
    __tablename__ = "mentorship_bookings"

    id = Column(Integer, primary_key=True, index=True)
    mentor_id = Column(Integer, ForeignKey("alumni_mentors.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    topic = Column(String(200), nullable=False)  # Resume Review, Tech Stack Advice, Mock Interview
    scheduled_at = Column(DateTime, nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String(50), default="Confirmed", nullable=False)  # Confirmed, Completed, Cancelled
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    mentor = relationship("AlumniMentor", back_populates="bookings")
    student = relationship("User")

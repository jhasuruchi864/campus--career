from typing import List, Optional
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.v1.deps import get_current_user, get_current_user_optional
from app.models.user import User
from app.models.mentor import AlumniMentor, MentorshipBooking
from app.schemas.features import MentorOut, MentorBookingRequest

router = APIRouter(prefix="/mentors", tags=["Alumni Mentorship Network"])


@router.get("", response_model=List[MentorOut])
def list_alumni_mentors(
    company: Optional[str] = Query(None),
    expertise: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """List alumni mentors available for 1:1 sessions."""
    query = db.query(AlumniMentor)
    if company:
        query = query.filter(AlumniMentor.company.ilike(f"%{company}%"))
    if expertise:
        query = query.filter(AlumniMentor.expertise.ilike(f"%{expertise}%"))

    mentors = query.all()
    # If table is empty, auto-seed top alumni mentors
    if not mentors:
        seed_data = [
            AlumniMentor(
                name="Sarah Chen",
                company="Google",
                role="Staff Software Engineer (AI Infra)",
                university="Stanford University",
                graduation_year=2021,
                expertise="Distributed Systems, LLM Serving, System Design",
                avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                linkedin_url="https://linkedin.com/in/sarahchen",
                bio="Former TreeHacks winner. Leading GPU infrastructure optimization at Google Cloud. Happy to do 1:1 resume reviews and tech prep.",
                available_slots=4
            ),
            AlumniMentor(
                name="Devin Miller",
                company="Anthropic",
                role="Research Scientist",
                university="MIT / Stanford Affiliate",
                graduation_year=2022,
                expertise="NLP, Reinforcement Learning, PyTorch",
                avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                linkedin_url="https://linkedin.com/in/devinmiller",
                bio="Passionate about AI alignment and scalable inference architectures. Mentoring college teams on research publications and YC pitches.",
                available_slots=2
            ),
            AlumniMentor(
                name="Priya Patel",
                company="Stripe",
                role="Lead Product Designer",
                university="UC Berkeley",
                graduation_year=2020,
                expertise="Design Systems, Micro-interactions, Fintech UX",
                avatar_url="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
                linkedin_url="https://linkedin.com/in/priyapatel",
                bio="Led payments design overhaul. Helping students build high-fidelity interactive portfolios and pitch decks that get noticed by top VC recruiters.",
                available_slots=3
            ),
            AlumniMentor(
                name="Marcus Vance",
                company="Microsoft",
                role="Senior Cloud Architect (Azure)",
                university="Stanford University",
                graduation_year=2019,
                expertise="Kubernetes, Go, DevOps, Cloud Architecture",
                avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                linkedin_url="https://linkedin.com/in/marcusvance",
                bio="Passionate mentor with 6+ years in cloud native ecosystems. Available for architecture critiques and mock behavioral interviews.",
                available_slots=5
            )
        ]
        db.add_all(seed_data)
        db.commit()
        mentors = db.query(AlumniMentor).all()

    return mentors


@router.post("/{mentor_id}/book")
def book_mentorship_slot(
    mentor_id: int,
    booking_in: MentorBookingRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Book a 1:1 mentorship consultation session with an alumnus."""
    mentor = db.query(AlumniMentor).filter(AlumniMentor.id == mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")

    if mentor.available_slots <= 0:
        raise HTTPException(status_code=400, detail="This mentor has no available slots this week")

    booking = MentorshipBooking(
        mentor_id=mentor_id,
        user_id=current_user.id,
        topic=booking_in.topic,
        scheduled_at=booking_in.scheduled_at,
        notes=booking_in.notes,
        status="Confirmed"
    )
    mentor.available_slots -= 1
    db.add(booking)
    db.commit()
    return {
        "message": f"Session successfully booked with {mentor.name}!",
        "scheduled_at": booking.scheduled_at,
        "mentor": mentor.name,
        "company": mentor.company,
        "topic": booking.topic
    }


@router.get("/my-bookings")
def get_user_mentorship_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """View current student's scheduled mentorship sessions."""
    bookings = db.query(MentorshipBooking).filter(MentorshipBooking.user_id == current_user.id).order_by(MentorshipBooking.scheduled_at.desc()).all()
    results = []
    for b in bookings:
        results.append({
            "id": b.id,
            "mentor_name": b.mentor.name if b.mentor else "Alumnus",
            "mentor_company": b.mentor.company if b.mentor else "",
            "mentor_role": b.mentor.role if b.mentor else "",
            "mentor_avatar": b.mentor.avatar_url if b.mentor else None,
            "topic": b.topic,
            "scheduled_at": b.scheduled_at,
            "notes": b.notes,
            "status": b.status
        })
    return results

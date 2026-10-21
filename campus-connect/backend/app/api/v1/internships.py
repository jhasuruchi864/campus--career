from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.v1.deps import get_current_user, get_current_user_optional
from app.models.user import User
from app.models.internship import Internship, InternshipApplication
from app.schemas.features import InternshipCreate, InternshipOut, InternshipApplyRequest

router = APIRouter(prefix="/internships", tags=["Campus Internships & Placement"])


@router.get("", response_model=List[InternshipOut])
def list_internships(
    role_type: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """List available internships and research opportunities."""
    query = db.query(Internship)
    if role_type:
        query = query.filter(Internship.role_type == role_type)
    if location:
        query = query.filter(Internship.location == location)
    if search:
        term = f"%{search}%"
        query = query.filter((Internship.title.ilike(term)) | (Internship.company_name.ilike(term)) | (Internship.required_skills.ilike(term)))

    internships = query.order_by(Internship.created_at.desc()).all()

    applied_ids = set()
    if current_user:
        apps = db.query(InternshipApplication.internship_id).filter(InternshipApplication.user_id == current_user.id).all()
        applied_ids = {a[0] for a in apps}

    results = []
    for item in internships:
        app_count = db.query(InternshipApplication).filter(InternshipApplication.internship_id == item.id).count()
        results.append(InternshipOut(
            id=item.id,
            company_name=item.company_name,
            logo_url=item.logo_url,
            title=item.title,
            role_type=item.role_type,
            location=item.location,
            stipend=item.stipend,
            deadline=item.deadline,
            description=item.description,
            required_skills=item.required_skills,
            apply_url=item.apply_url,
            created_at=item.created_at,
            application_count=app_count,
            has_applied=item.id in applied_ids
        ))
    return results


@router.post("", response_model=InternshipOut, status_code=status.HTTP_201_CREATED)
def create_internship(
    item_in: InternshipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Post an internship listing."""
    item = Internship(
        company_name=item_in.company_name,
        logo_url=item_in.logo_url,
        title=item_in.title,
        role_type=item_in.role_type,
        location=item_in.location,
        stipend=item_in.stipend,
        deadline=item_in.deadline,
        description=item_in.description,
        required_skills=item_in.required_skills,
        apply_url=item_in.apply_url
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    return InternshipOut(
        id=item.id,
        company_name=item.company_name,
        logo_url=item.logo_url,
        title=item.title,
        role_type=item.role_type,
        location=item.location,
        stipend=item.stipend,
        deadline=item.deadline,
        description=item.description,
        required_skills=item.required_skills,
        apply_url=item.apply_url,
        created_at=item.created_at,
        application_count=0,
        has_applied=False
    )


@router.post("/{internship_id}/apply")
def apply_to_internship(
    internship_id: int,
    apply_in: InternshipApplyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """1-Click apply to an internship using your student profile."""
    item = db.query(Internship).filter(Internship.id == internship_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Internship opportunity not found")

    existing = db.query(InternshipApplication).filter(
        InternshipApplication.internship_id == internship_id,
        InternshipApplication.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this internship")

    app = InternshipApplication(
        internship_id=internship_id,
        user_id=current_user.id,
        status="Applied",
        pitch_note=apply_in.pitch_note
    )
    db.add(app)
    db.commit()
    return {"message": "Application submitted successfully! Recruiter notified.", "status": "Applied"}

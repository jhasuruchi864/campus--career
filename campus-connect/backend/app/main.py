import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.api.v1.router import api_router
from app.models.profile import Skill
from app.models.user import User
from app.models.project import Project, TeamMember, ProjectSkill
from app.models.event import Event
from app.core.security import get_password_hash
from datetime import datetime, timezone, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("campus_connect")


def init_database_seed():
    """Initializes tables and seeds default university skills and demo data if database is empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Skills catalog
        existing_skills = db.query(Skill).count()
        if existing_skills == 0:
            logger.info("Seeding initial skills catalog...")
            skills_data = [
                ("React", "Frontend"),
                ("JavaScript", "Frontend"),
                ("TypeScript", "Frontend"),
                ("HTML/CSS", "Frontend"),
                ("Python", "Backend"),
                ("FastAPI", "Backend"),
                ("Node.js", "Backend"),
                ("PostgreSQL", "Database"),
                ("Machine Learning", "AI/ML"),
                ("PyTorch", "AI/ML"),
                ("Computer Vision", "AI/ML"),
                ("Natural Language Processing", "AI/ML"),
                ("UI/UX Design", "Design"),
                ("Figma", "Design"),
                ("Docker", "DevOps"),
                ("AWS", "Cloud")
            ]
            for name, cat in skills_data:
                db.add(Skill(name=name, category=cat))
            db.commit()

        # 2. Seed Default Student User if none exists
        demo_user = db.query(User).filter(User.email == "alex.rivera@stanford.edu").first()
        if not demo_user:
            logger.info("Seeding demo student Alex Rivera...")
            user = User(
                email="alex.rivera@stanford.edu",
                hashed_password=get_password_hash("Campus@2026!"),
                full_name="Alex Rivera",
                avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            # Profile
            from app.models.profile import StudentProfile, StudentSkill
            profile = StudentProfile(
                user_id=user.id,
                university="Stanford University",
                major="Computer Science & AI",
                graduation_year=2026,
                preferred_role="Full Stack / ML Engineer",
                bio="Junior CS major passionate about autonomous systems, full-stack architectures, and ML teammate pairing.",
                availability_hours_per_week=15
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)

            # Associate skills
            for s_name in ["React", "FastAPI", "Python", "Machine Learning"]:
                s_obj = db.query(Skill).filter(Skill.name == s_name).first()
                if s_obj:
                    db.add(StudentSkill(profile_id=profile.id, skill_id=s_obj.id, proficiency_level="Advanced"))
            db.commit()

            # Seed Demo Project
            proj = Project(
                owner_id=user.id,
                title="MediVision: Real-Time Diagnostic Assistance",
                tagline="Edge AI inference for pathology image segmentation and physician triage in clinical settings.",
                description="We are engineering an offline-first computer vision pipeline that runs on lightweight edge devices to analyze microscopy slides. Seeking backend and ML students.",
                category="AI & Machine Learning",
                status="Recruiting",
                max_team_size=4
            )
            db.add(proj)
            db.commit()
            db.refresh(proj)

            # Team member & required skills
            db.add(TeamMember(project_id=proj.id, user_id=user.id, role="Project Lead"))
            for req in ["Python", "FastAPI", "PyTorch", "Computer Vision"]:
                sk = db.query(Skill).filter(Skill.name == req).first()
                if sk:
                    db.add(ProjectSkill(project_id=proj.id, skill_id=sk.id))
            db.commit()

            # Seed Demo Event
            event = Event(
                creator_id=user.id,
                title="Stanford TreeHacks 2026: AI & Spatial Computing",
                description="Northern California's premier collegiate hackathon with over $75,000 in sponsor prizes.",
                event_type="Hackathon",
                location="Arrillaga Alumni Center, Stanford Campus",
                start_time=datetime.now(timezone.utc) + timedelta(days=20),
                end_time=datetime.now(timezone.utc) + timedelta(days=22),
                registration_url="https://treehacks.com",
                banner_url="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80"
            )
            db.add(event)
            db.commit()

    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database schema is initialized and seeded
    init_database_seed()
    yield
    # Shutdown logic if needed


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Campus Connect: High-performance AI-driven college student collaboration API.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "docs_url": "/docs"
    }

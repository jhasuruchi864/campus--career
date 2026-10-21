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

            # Seed Demo Tasks for Kanban
            from app.models.task import ProjectTask
            tasks_data = [
                ProjectTask(project_id=proj.id, title="Setup PyTorch Edge Quantization Pipeline", description="Benchmark ONNX runtime vs TensorRT on Raspberry Pi 5", status="in_progress", priority="high", assigned_to=user.id),
                ProjectTask(project_id=proj.id, title="Design Medical Triage UI in Figma", description="High-fidelity wireframes for clinician pathology dashboard", status="done", priority="medium", assigned_to=user.id),
                ProjectTask(project_id=proj.id, title="Build FastAPI Microservice for Inference", description="REST endpoint accepting multipart image files with <50ms response", status="todo", priority="high", assigned_to=user.id),
                ProjectTask(project_id=proj.id, title="Prepare TreeHacks 3-Minute Pitch Video", description="Record live microscope slide segmentation demo with slide deck", status="review", priority="low", assigned_to=user.id),
            ]
            db.add_all(tasks_data)
            db.commit()

            # Seed Demo Chat Message
            from app.models.chat import ChatMessage
            chat_msg = ChatMessage(
                project_id=proj.id,
                sender_id=user.id,
                message="Welcome to MediVision! Let's build the edge inference pipeline for TreeHacks 2026."
            )
            db.add(chat_msg)
            db.commit()

            # Seed Demo Internships
            from app.models.internship import Internship
            internships = [
                Internship(
                    company_name="OpenAI Labs (Campus Fellow)",
                    logo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
                    title="Student Research Fellow - Foundation Models",
                    role_type="Research RA",
                    location="Hybrid / San Francisco",
                    stipend="$52/hr + Housing Stipend",
                    deadline=datetime.now(timezone.utc) + timedelta(days=30),
                    description="Work directly with leading research scientists evaluating multimodal alignment, reasoning benchmarks, and efficient attention mechanisms.",
                    required_skills="Python, PyTorch, Transformers, Mathematics",
                    apply_url="https://openai.com/careers"
                ),
                Internship(
                    company_name="Vercel",
                    logo_url="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80",
                    title="Frontend Engineering Intern - Next.js Core",
                    role_type="Internship",
                    location="Remote (Global)",
                    stipend="$45/hr",
                    deadline=datetime.now(timezone.utc) + timedelta(days=45),
                    description="Contribute to Next.js compiler, Turbopack optimizations, and modern developer tooling used by millions of web developers.",
                    required_skills="TypeScript, React, Rust, Next.js, Web Performance",
                    apply_url="https://vercel.com/careers"
                ),
                Internship(
                    company_name="Stanford Autonomous Systems Lab",
                    logo_url="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80",
                    title="Undergraduate Research Assistant - Robotics",
                    role_type="Research RA",
                    location="On-Campus",
                    stipend="$28/hr (Academic Credit Eligible)",
                    deadline=datetime.now(timezone.utc) + timedelta(days=14),
                    description="Assist PhD candidates in reinforcement learning simulations for quadcopter trajectory optimization in wind-tunnel environments.",
                    required_skills="ROS, C++, Python, Control Theory",
                    apply_url="https://asl.stanford.edu"
                )
            ]
            db.add_all(internships)
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

import os
import sys

# Ensure backend directory is in Python path for test execution
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.profile import Skill, StudentProfile, StudentSkill
from app.models.user import User
from app.models.project import Project, TeamMember, ProjectSkill
from app.models.event import Event
from app.core.security import get_password_hash

# Isolated SQLite test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_campus_connect.db"
test_engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def seed_test_database(db):
    """Seeds test database with demo data."""
    # 1. Skills
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

    # 2. Demo User Alex Rivera
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
    profile = StudentProfile(
        user_id=user.id,
        university="Stanford University",
        major="Computer Science & AI",
        graduation_year=2026,
        preferred_role="Full Stack / ML Engineer",
        bio="Junior CS major passionate about autonomous systems.",
        availability_hours_per_week=15
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)

    # Skills for Alex
    for s_name in ["React", "FastAPI", "Python", "Machine Learning"]:
        sk = db.query(Skill).filter(Skill.name == s_name).first()
        if sk:
            db.add(StudentSkill(profile_id=profile.id, skill_id=sk.id, proficiency_level="Advanced"))
    db.commit()

    # 3. Demo Project MediVision
    proj = Project(
        owner_id=user.id,
        title="MediVision: Real-Time Diagnostic Assistance",
        tagline="Edge AI inference for pathology image segmentation.",
        description="We are engineering an offline-first computer vision pipeline for microscopy.",
        category="AI & Machine Learning",
        status="Recruiting",
        max_team_size=4
    )
    db.add(proj)
    db.commit()
    db.refresh(proj)

    db.add(TeamMember(project_id=proj.id, user_id=user.id, role="Project Lead"))
    for req in ["Python", "FastAPI", "PyTorch", "Computer Vision"]:
        sk = db.query(Skill).filter(Skill.name == req).first()
        if sk:
            db.add(ProjectSkill(project_id=proj.id, skill_id=sk.id))
    db.commit()

    # 4. Demo Event TreeHacks
    event = Event(
        creator_id=user.id,
        title="Stanford TreeHacks 2026: AI & Spatial Computing",
        description="Northern California premier collegiate hackathon.",
        event_type="Hackathon",
        location="Arrillaga Alumni Center, Stanford Campus",
        start_time=datetime.now(timezone.utc) + timedelta(days=20),
        end_time=datetime.now(timezone.utc) + timedelta(days=22),
        registration_url="https://treehacks.com"
    )
    db.add(event)
    db.commit()


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    seed_test_database(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db():
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def auth_headers(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "alex.rivera@stanford.edu", "password": "Campus@2026!"}
    )
    assert response.status_code == 200, f"Login failed: {response.text}"
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

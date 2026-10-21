import pytest
from fastapi.testclient import TestClient


def test_list_internships(client: TestClient):
    response = client.get("/api/v1/internships")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_list_mentors(client: TestClient):
    response = client.get("/api/v1/mentors")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert any(m["company"] == "Google" for m in data)


def test_campus_analytics_summary(client: TestClient):
    response = client.get("/api/v1/analytics/campus-summary")
    assert response.status_code == 200
    data = response.json()
    assert "overview" in data
    assert "trending_skills" in data
    assert "placement_stats" in data
    assert data["placement_stats"]["placement_rate_pct"] > 80


def test_ai_resume_analyzer(client: TestClient):
    sample_resume = (
        "Experienced student developer skilled in React, TypeScript, FastAPI, and Python. "
        "Engineered distributed microservices with 99.9% uptime and reduced latency by 35%. "
        "Deployed Docker containerized workloads on AWS."
    )
    response = client.post("/api/v1/ai/resume-analyzer", json={"resume_text": sample_resume})
    assert response.status_code == 200
    data = response.json()
    assert data["ats_score"] > 50
    assert "detected_skills" in data
    assert "breakdown" in data


def test_ai_hackathon_team_builder(client: TestClient):
    response = client.post("/api/v1/ai/hackathon-team-builder", json={"theme": "Healthcare AI Edge Inference"})
    assert response.status_code == 200
    data = response.json()
    assert "squad" in data
    assert "team_synergy_score" in data
    assert len(data["squad"]) >= 1


def test_ai_project_generator(client: TestClient):
    response = client.post("/api/v1/ai/project-generator", json={"domain": "fintech", "difficulty": "Intermediate"})
    assert response.status_code == 200
    data = response.json()
    assert "title" in data
    assert "architecture" in data
    assert "recommended_stack" in data
    assert "roadmap" in data


def test_ai_mock_interview(client: TestClient):
    response = client.post("/api/v1/ai/mock-interview", json={"skill": "react", "difficulty": "Advanced"})
    assert response.status_code == 200
    data = response.json()
    assert data["skill"] == "react"
    assert len(data["questions"]) >= 1
    assert "hint" in data["questions"][0]
    assert "expected_answer" in data["questions"][0]

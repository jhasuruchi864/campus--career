import pytest
from app.ai.matching import matching_engine
from app.ai.recommendations import analyze_skill_gaps


def test_ai_matching_engine_computation():
    target_project = {
        "title": "BioAI Whole Slide Analyzer",
        "category": "AI & Machine Learning",
        "required_skills": ["Python", "PyTorch", "Computer Vision"]
    }

    candidates = [
        {
            "id": 1,
            "user_id": 10,
            "full_name": "Elena Rostova",
            "preferred_role": "Computer Vision & ML",
            "skills": ["PyTorch", "Computer Vision", "Python"],
            "availability_hours_per_week": 16,
            "interests": "AI, Healthcare"
        },
        {
            "id": 2,
            "user_id": 11,
            "full_name": "Marcus Chen",
            "preferred_role": "UI/UX Designer",
            "skills": ["Figma", "UI/UX Design"],
            "availability_hours_per_week": 10,
            "interests": "Design"
        }
    ]

    matches = matching_engine.match_candidates_for_project(target_project, candidates)
    assert len(matches) == 2
    # Elena should rank higher due to PyTorch, Python, Computer Vision overlap
    assert matches[0]["student"]["full_name"] == "Elena Rostova"
    assert matches[0]["match_score"] > matches[1]["match_score"]
    assert "score_breakdown" in matches[0]
    assert "match_reasons" in matches[0]
    assert len(matches[0]["match_reasons"]) > 0


def test_ai_skill_gap_analysis():
    required = ["React", "FastAPI", "Docker", "PostgreSQL"]
    current_team = ["React", "FastAPI"]

    gap_analysis = analyze_skill_gaps(required, current_team, category="Web Development")
    assert "Docker" in gap_analysis["missing_skills"]
    assert "PostgreSQL" in gap_analysis["missing_skills"]
    assert len(gap_analysis["recommendations"]) > 0


def test_api_ai_match_teammates_endpoint(client):
    response = client.get("/api/v1/ai/match-teammates")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_api_ai_skill_gaps_endpoint(client):
    # Get a project
    projs = client.get("/api/v1/projects").json()
    proj_id = projs[0]["id"]

    response = client.get(f"/api/v1/ai/skill-gaps/{proj_id}")
    assert response.status_code == 200
    data = response.json()
    assert "missing_skills" in data
    assert "recommendations" in data

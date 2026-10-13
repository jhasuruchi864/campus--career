import pytest


def test_list_students(client):
    response = client.get("/api/v1/students")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert any(s["email"] == "alex.rivera@stanford.edu" for s in data)


def test_get_student_profile(client, auth_headers):
    response = client.get("/api/v1/students/profile/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Alex Rivera"
    assert data["major"] == "Computer Science & AI"


def test_update_student_profile(client, auth_headers):
    payload = {
        "bio": "Updated bio via automated test suite.",
        "availability_hours_per_week": 18,
        "skills": [
            {"name": "React", "level": "Expert"},
            {"name": "FastAPI", "level": "Expert"},
            {"name": "Docker", "level": "Intermediate"}
        ]
    }
    response = client.put("/api/v1/students/profile", json=payload, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["bio"] == "Updated bio via automated test suite."
    assert data["availability_hours_per_week"] == 18
    skill_names = [s["name"] for s in data["skills"]]
    assert "Docker" in skill_names


def test_list_skills_catalog(client):
    response = client.get("/api/v1/students/skills")
    assert response.status_code == 200
    skills = response.json()
    assert len(skills) >= 10
    assert any(s["name"] == "React" for s in skills)

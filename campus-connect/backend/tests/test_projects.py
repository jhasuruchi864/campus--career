import pytest


def test_list_projects(client):
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    projects = response.json()
    assert isinstance(projects, list)
    assert len(projects) >= 1
    assert any(p["title"] == "MediVision: Real-Time Diagnostic Assistance" for p in projects)


def test_create_project(client, auth_headers):
    payload = {
        "title": "QuantumSim: Qubit Quantum Simulator",
        "tagline": "Browser-based quantum circuit visualizer and quantum state vector runner.",
        "description": "We are assembling a team of physics and computer science undergraduates to build a lightweight quantum gate simulator with WebGL visualization.",
        "category": "Web Development",
        "max_team_size": 4,
        "required_skills": ["Python", "JavaScript", "Linear Algebra", "WebGL"]
    }
    response = client.post("/api/v1/projects", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "QuantumSim: Qubit Quantum Simulator"
    assert data["category"] == "Web Development"
    assert len(data["required_skills"]) == 4
    assert len(data["team_members"]) == 1
    assert data["team_members"][0]["role"] == "Project Lead"


def test_filter_projects_by_category(client):
    response = client.get("/api/v1/projects?category=AI+%26+Machine+Learning")
    assert response.status_code == 200
    projects = response.json()
    assert all("ai" in p["category"].lower() for p in projects)


def test_project_join_request_flow(client, auth_headers):
    # 1. Register a second student to apply
    applier_email = f"applicant_{client.get('/api/v1/projects').json()[0]['id']}@univ.edu"
    reg_resp = client.post("/api/v1/auth/register", json={
        "email": applier_email,
        "full_name": "Applicant Student",
        "password": "Password123!",
        "university": "UC Berkeley",
        "major": "Data Science",
        "graduation_year": 2026
    })
    applier_token = reg_resp.json()["access_token"]
    applier_headers = {"Authorization": f"Bearer {applier_token}"}

    # 2. Get the MediVision project
    projs = client.get("/api/v1/projects").json()
    medivision = [p for p in projs if "medivision" in p["title"].lower()][0]
    proj_id = medivision["id"]

    # 3. Submit Join Request
    join_resp = client.post(
        f"/api/v1/projects/{proj_id}/join",
        json={"pitch_message": "I would love to contribute to the medical computer vision pipeline and dataset validation."},
        headers=applier_headers
    )
    assert join_resp.status_code == 201
    req_data = join_resp.json()
    assert req_data["status"] == "Pending"
    request_id = req_data["id"]

    # 4. Project Lead reviews and accepts request
    review_resp = client.put(
        f"/api/v1/projects/{proj_id}/requests/{request_id}",
        json={"status": "Accepted"},
        headers=auth_headers
    )
    assert review_resp.status_code == 200
    assert review_resp.json()["status"] == "Accepted"

    # 5. Verify the applicant is now in team_members
    detail_resp = client.get(f"/api/v1/projects/{proj_id}")
    assert detail_resp.status_code == 200
    member_names = [m["name"] for m in detail_resp.json()["team_members"]]
    assert "Applicant Student" in member_names

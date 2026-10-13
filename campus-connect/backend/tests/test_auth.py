import pytest


def test_register_new_student(client):
    payload = {
        "email": "sarah.connor@mit.edu",
        "full_name": "Sarah Connor",
        "password": "Password123!",
        "university": "MIT",
        "major": "Mechanical Engineering",
        "graduation_year": 2026,
        "preferred_role": "Robotics Engineer"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "sarah.connor@mit.edu"
    assert data["user"]["full_name"] == "Sarah Connor"


def test_register_duplicate_email(client):
    payload = {
        "email": "alex.rivera@stanford.edu",
        "full_name": "Duplicate Alex",
        "password": "Password123!"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()


def test_login_success(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "alex.rivera@stanford.edu", "password": "Campus@2026!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["full_name"] == "Alex Rivera"


def test_login_invalid_password(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "alex.rivera@stanford.edu", "password": "WrongPassword!"}
    )
    assert response.status_code == 401
    assert "invalid" in response.json()["detail"].lower()


def test_get_current_user_me(client, auth_headers):
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "alex.rivera@stanford.edu"
    assert data["university"] == "Stanford University"
    assert len(data["skills"]) > 0

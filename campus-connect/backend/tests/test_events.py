from datetime import datetime, timezone, timedelta
import pytest


def test_list_events(client):
    response = client.get("/api/v1/events")
    assert response.status_code == 200
    events = response.json()
    assert isinstance(events, list)
    assert len(events) >= 1
    assert any("treehacks" in e["title"].lower() for e in events)


def test_create_event(client, auth_headers):
    payload = {
        "title": "Autonomous Robotics Sprint",
        "description": "A 24-hour hands-on hardware hacking sprint with ROS 2 and turtlebots.",
        "event_type": "Hackathon",
        "location": "Robotics Building Lab 101",
        "start_time": (datetime.now(timezone.utc) + timedelta(days=14)).isoformat(),
        "end_time": (datetime.now(timezone.utc) + timedelta(days=15)).isoformat(),
        "registration_url": "https://robotics-sprint.edu"
    }
    response = client.post("/api/v1/events", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Autonomous Robotics Sprint"
    assert data["event_type"] == "Hackathon"


def test_filter_events_by_type(client):
    response = client.get("/api/v1/events?type=Hackathon")
    assert response.status_code == 200
    events = response.json()
    assert all(e["event_type"] == "Hackathon" for e in events)

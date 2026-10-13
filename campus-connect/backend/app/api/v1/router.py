from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.students import router as students_router
from app.api.v1.projects import router as projects_router
from app.api.v1.events import router as events_router
from app.api.v1.ai import router as ai_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(students_router)
api_router.include_router(projects_router)
api_router.include_router(events_router)
api_router.include_router(ai_router)

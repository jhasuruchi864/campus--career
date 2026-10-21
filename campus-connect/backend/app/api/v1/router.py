from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.students import router as students_router
from app.api.v1.projects import router as projects_router
from app.api.v1.events import router as events_router
from app.api.v1.ai import router as ai_router
from app.api.v1.tasks import router as tasks_router
from app.api.v1.chat import router as chat_router
from app.api.v1.internships import router as internships_router
from app.api.v1.mentors import router as mentors_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.analytics import router as analytics_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(students_router)
api_router.include_router(projects_router)
api_router.include_router(events_router)
api_router.include_router(ai_router)
api_router.include_router(tasks_router)
api_router.include_router(chat_router)
api_router.include_router(internships_router)
api_router.include_router(mentors_router)
api_router.include_router(notifications_router)
api_router.include_router(analytics_router)

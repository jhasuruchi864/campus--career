from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.v1.deps import get_current_user
from app.models.user import User
from app.models.task import ProjectTask
from app.models.project import Project
from app.schemas.features import TaskCreate, TaskUpdate, TaskOut

router = APIRouter(prefix="/tasks", tags=["Project Tasks & Kanban"])


@router.get("/project/{project_id}", response_model=List[TaskOut])
def list_project_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all kanban tasks for a project."""
    tasks = db.query(ProjectTask).filter(ProjectTask.project_id == project_id).all()
    results = []
    for t in tasks:
        assignee_name = t.assignee.full_name if t.assignee else None
        assignee_avatar = t.assignee.avatar_url if t.assignee else None
        results.append(TaskOut(
            id=t.id,
            project_id=t.project_id,
            title=t.title,
            description=t.description,
            status=t.status,
            priority=t.priority,
            assigned_to=t.assigned_to,
            assignee_name=assignee_name,
            assignee_avatar=assignee_avatar,
            due_date=t.due_date,
            created_at=t.created_at
        ))
    return results


@router.post("/project/{project_id}", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_project_task(
    project_id: int,
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new task in a project kanban board."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    task = ProjectTask(
        project_id=project_id,
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        priority=task_in.priority,
        assigned_to=task_in.assigned_to,
        due_date=task_in.due_date
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    assignee_name = task.assignee.full_name if task.assignee else None
    assignee_avatar = task.assignee.avatar_url if task.assignee else None

    return TaskOut(
        id=task.id,
        project_id=task.project_id,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        assigned_to=task.assigned_to,
        assignee_name=assignee_name,
        assignee_avatar=assignee_avatar,
        due_date=task.due_date,
        created_at=task.created_at
    )


@router.patch("/{task_id}", response_model=TaskOut)
def update_task_status(
    task_id: int,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update task status (e.g. dragging between Kanban columns) or task details."""
    task = db.query(ProjectTask).filter(ProjectTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task_in.status is not None:
        task.status = task_in.status
    if task_in.priority is not None:
        task.priority = task_in.priority
    if task_in.title is not None:
        task.title = task_in.title
    if task_in.description is not None:
        task.description = task_in.description
    if task_in.assigned_to is not None:
        task.assigned_to = task_in.assigned_to
    if task_in.due_date is not None:
        task.due_date = task_in.due_date

    db.commit()
    db.refresh(task)

    assignee_name = task.assignee.full_name if task.assignee else None
    assignee_avatar = task.assignee.avatar_url if task.assignee else None

    return TaskOut(
        id=task.id,
        project_id=task.project_id,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        assigned_to=task.assigned_to,
        assignee_name=assignee_name,
        assignee_avatar=assignee_avatar,
        due_date=task.due_date,
        created_at=task.created_at
    )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a kanban task."""
    task = db.query(ProjectTask).filter(ProjectTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return None

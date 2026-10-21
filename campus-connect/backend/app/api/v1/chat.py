from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.db.session import get_db
from app.api.v1.deps import get_current_user
from app.models.user import User
from app.models.chat import ChatMessage
from app.schemas.features import ChatMessageCreate, ChatMessageOut

router = APIRouter(prefix="/chat", tags=["Real-Time Team & Direct Chat"])


@router.get("/project/{project_id}", response_model=List[ChatMessageOut])
def get_project_chat(
    project_id: int,
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve chat history for a specific project team room."""
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.project_id == project_id)
        .order_by(ChatMessage.created_at.asc())
        .limit(limit)
        .all()
    )
    return [
        ChatMessageOut(
            id=m.id,
            project_id=m.project_id,
            sender_id=m.sender_id,
            sender_name=m.sender.full_name if m.sender else "Anonymous",
            sender_avatar=m.sender.avatar_url if m.sender else None,
            receiver_id=m.receiver_id,
            message=m.message,
            created_at=m.created_at
        )
        for m in messages
    ]


@router.post("/project/{project_id}", response_model=ChatMessageOut, status_code=status.HTTP_201_CREATED)
def post_project_message(
    project_id: int,
    msg_in: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Post a new message in project team chat."""
    msg = ChatMessage(
        project_id=project_id,
        sender_id=current_user.id,
        receiver_id=None,
        message=msg_in.message.strip()
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    return ChatMessageOut(
        id=msg.id,
        project_id=msg.project_id,
        sender_id=msg.sender_id,
        sender_name=current_user.full_name,
        sender_avatar=current_user.avatar_url,
        receiver_id=msg.receiver_id,
        message=msg.message,
        created_at=msg.created_at
    )


@router.get("/direct/{other_user_id}", response_model=List[ChatMessageOut])
def get_direct_messages(
    other_user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get 1-on-1 direct conversation between current user and another student."""
    messages = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.project_id.is_(None),
            or_(
                and_(ChatMessage.sender_id == current_user.id, ChatMessage.receiver_id == other_user_id),
                and_(ChatMessage.sender_id == other_user_id, ChatMessage.receiver_id == current_user.id)
            )
        )
        .order_by(ChatMessage.created_at.asc())
        .limit(50)
        .all()
    )
    return [
        ChatMessageOut(
            id=m.id,
            project_id=m.project_id,
            sender_id=m.sender_id,
            sender_name=m.sender.full_name if m.sender else "Anonymous",
            sender_avatar=m.sender.avatar_url if m.sender else None,
            receiver_id=m.receiver_id,
            message=m.message,
            created_at=m.created_at
        )
        for m in messages
    ]


@router.post("/direct/{other_user_id}", response_model=ChatMessageOut, status_code=status.HTTP_201_CREATED)
def send_direct_message(
    other_user_id: int,
    msg_in: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a 1-on-1 direct message."""
    target_user = db.query(User).filter(User.id == other_user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Recipient user not found")

    msg = ChatMessage(
        project_id=None,
        sender_id=current_user.id,
        receiver_id=other_user_id,
        message=msg_in.message.strip()
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    return ChatMessageOut(
        id=msg.id,
        project_id=None,
        sender_id=msg.sender_id,
        sender_name=current_user.full_name,
        sender_avatar=current_user.avatar_url,
        receiver_id=msg.receiver_id,
        message=msg.message,
        created_at=msg.created_at
    )

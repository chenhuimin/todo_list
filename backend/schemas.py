from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Team Member Schemas
class TeamMemberBase(BaseModel):
    name: str
    avatar: Optional[str] = None

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(TeamMemberBase):
    pass

class TeamMemberInDB(TeamMemberBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Todo Schemas
class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    color: str = "blue"
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    date: Optional[str] = None
    assigned_to_id: Optional[int] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    color: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    date: Optional[str] = None
    assigned_to_id: Optional[int] = None

class TodoInDB(TodoBase):
    id: int
    created_at: datetime
    updated_at: datetime
    assigned_to: Optional[TeamMemberInDB] = None

    class Config:
        from_attributes = True

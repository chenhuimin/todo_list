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

# User Schemas
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class UserPasswordUpdate(BaseModel):
    old_password: str
    new_password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


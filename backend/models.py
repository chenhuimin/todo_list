from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    avatar = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    color = Column(String, default="blue")  # blue, purple, yellow, pink, green
    start_time = Column(String, nullable=True)  # 格式: "10:30 AM"
    end_time = Column(String, nullable=True)    # 格式: "12:00 PM"
    date = Column(String, nullable=True)        # 格式: "2025-02-21"
    assigned_to_id = Column(Integer, ForeignKey("team_members.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    assigned_to = relationship("TeamMember", backref="todos")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

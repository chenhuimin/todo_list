from sqlalchemy.orm import Session
from models import Todo, TeamMember, User
from schemas import TodoCreate, TodoUpdate, TeamMemberCreate, TeamMemberUpdate, UserCreate
from logger import setup_logger
from typing import Optional
from auth import get_password_hash

logger = setup_logger(__name__)

# Todo CRUD
def get_todo(db: Session, todo_id: int):
    logger.debug(f"CRUD: 查询单个任务, id={todo_id}")
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    logger.debug(f"CRUD: 查询结果: {todo.title if todo else None}")
    return todo

def get_todos(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    completed: Optional[bool] = None,
    date: Optional[str] = None,
    assigned_to_id: Optional[int] = None,
    search: Optional[str] = None
):
    logger.debug(f"CRUD: 查询任务列表, skip={skip}, limit={limit}, completed={completed}, date={date}")
    query = db.query(Todo)
    
    if completed is not None:
        query = query.filter(Todo.completed == completed)
    
    if date:
        query = query.filter(Todo.date == date)
    
    if assigned_to_id:
        query = query.filter(Todo.assigned_to_id == assigned_to_id)
    
    if search:
        query = query.filter(Todo.title.contains(search))
    
    todos = query.offset(skip).limit(limit).all()
    logger.debug(f"CRUD: 返回 {len(todos)} 个任务")
    return todos

def create_todo(db: Session, todo: TodoCreate):
    logger.debug(f"CRUD: 创建任务, data={todo.model_dump()}")
    db_todo = Todo(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    logger.info(f"CRUD: 任务已创建, id={db_todo.id}")
    return db_todo

def update_todo(db: Session, todo_id: int, todo_update: TodoUpdate):
    logger.debug(f"CRUD: 更新任务, id={todo_id}, data={todo_update.model_dump(exclude_unset=True)}")
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo:
        for key, value in todo_update.model_dump(exclude_unset=True).items():
            setattr(db_todo, key, value)
        db.commit()
        db.refresh(db_todo)
        logger.info(f"CRUD: 任务已更新, id={todo_id}")
    else:
        logger.warning(f"CRUD: 更新失败，任务不存在, id={todo_id}")
    return db_todo

def delete_todo(db: Session, todo_id: int):
    logger.debug(f"CRUD: 删除任务, id={todo_id}")
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo:
        title = db_todo.title
        db.delete(db_todo)
        db.commit()
        logger.info(f"CRUD: 任务已删除, id={todo_id}, title={title}")
    else:
        logger.warning(f"CRUD: 删除失败，任务不存在, id={todo_id}")
    return db_todo

# Team Member CRUD
def get_team_member(db: Session, member_id: int):
    logger.debug(f"CRUD: 查询团队成员, id={member_id}")
    return db.query(TeamMember).filter(TeamMember.id == member_id).first()

def get_team_members(db: Session, skip: int = 0, limit: int = 100):
    logger.debug(f"CRUD: 查询团队成员列表, skip={skip}, limit={limit}")
    members = db.query(TeamMember).offset(skip).limit(limit).all()
    logger.debug(f"CRUD: 返回 {len(members)} 个成员")
    return members

def create_team_member(db: Session, member: TeamMemberCreate):
    logger.debug(f"CRUD: 创建团队成员, data={member.model_dump()}")
    db_member = TeamMember(**member.model_dump())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    logger.info(f"CRUD: 团队成员已创建, id={db_member.id}")
    return db_member

def update_team_member(db: Session, member_id: int, member_update: TeamMemberUpdate):
    logger.debug(f"CRUD: 更新团队成员, id={member_id}")
    db_member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if db_member:
        for key, value in member_update.model_dump().items():
            setattr(db_member, key, value)
        db.commit()
        db.refresh(db_member)
        logger.info(f"CRUD: 团队成员已更新, id={member_id}")
    return db_member

def delete_team_member(db: Session, member_id: int):
    logger.debug(f"CRUD: 删除团队成员, id={member_id}")
    db_member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if db_member:
        name = db_member.name
        db.delete(db_member)
        db.commit()
        logger.info(f"CRUD: 团队成员已删除, id={member_id}, name={name}")
    return db_member

# User CRUD
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

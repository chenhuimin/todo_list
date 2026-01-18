from fastapi import FastAPI, Depends, HTTPException, Request, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime
import models
import schemas
import crud
import auth
from jose import jwt, JWTError
from database import engine, SessionLocal
from logger import setup_logger

logger = setup_logger(__name__)

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.datetime.now()
    
    logger.debug(f"请求: {request.method} {request.url.path}")
    logger.debug(f"客户端: {request.client.host if request.client else 'unknown'}")
    
    response = await call_next(request)
    
    process_time = (datetime.datetime.now() - start_time).total_seconds()
    logger.debug(f"响应: {response.status_code} - 耗时: {process_time:.3f}s")
    
    return response

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = datetime.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@app.put("/users/me/password")
def update_password(password_update: schemas.UserPasswordUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    user = crud.get_user(db, current_user.id)
    if not auth.verify_password(password_update.old_password, user.hashed_password):
         raise HTTPException(status_code=400, detail="Incorrect old password")
    
    user.hashed_password = auth.get_password_hash(password_update.new_password)
    db.commit()
    return {"detail": "Password updated successfully"}

@app.get("/todos", response_model=List[schemas.TodoInDB])
def read_todos(
    skip: int = 0, 
    limit: int = 100, 
    completed: Optional[bool] = Query(None),
    date: Optional[str] = Query(None),
    assigned_to_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    logger.debug(f"获取任务列表: skip={skip}, limit={limit}, completed={completed}, date={date}, search={search}")
    todos = crud.get_todos(
        db, 
        skip=skip, 
        limit=limit, 
        completed=completed, 
        date=date, 
        assigned_to_id=assigned_to_id,
        search=search
    )
    logger.debug(f"返回 {len(todos)} 个任务")
    return todos

@app.get("/todos/{todo_id}", response_model=schemas.TodoInDB)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    logger.debug(f"获取单个任务: id={todo_id}")
    todo = crud.get_todo(db, todo_id=todo_id)
    if todo is None:
        logger.warning(f"任务不存在: id={todo_id}")
        raise HTTPException(status_code=404, detail="Todo not found")
    logger.debug(f"成功获取任务: {todo.title}")
    return todo

@app.post("/todos", response_model=schemas.TodoInDB)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    logger.debug(f"创建任务: title={todo.title}, description={todo.description}")
    created_todo = crud.create_todo(db=db, todo=todo)
    logger.info(f"任务创建成功: id={created_todo.id}, title={created_todo.title}")
    return created_todo

@app.put("/todos/{todo_id}", response_model=schemas.TodoInDB)
def update_todo(todo_id: int, todo_update: schemas.TodoUpdate, db: Session = Depends(get_db)):
    logger.debug(f"更新任务: id={todo_id}, data={todo_update.model_dump(exclude_unset=True)}")
    updated_todo = crud.update_todo(db, todo_id, todo_update)
    if updated_todo is None:
        logger.warning(f"更新失败，任务不存在: id={todo_id}")
        raise HTTPException(status_code=404, detail="Todo not found")
    logger.info(f"任务更新成功: id={todo_id}")
    return updated_todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    logger.debug(f"删除任务: id={todo_id}")
    deleted_todo = crud.delete_todo(db, todo_id)
    if deleted_todo is None:
        logger.warning(f"删除失败，任务不存在: id={todo_id}")
        raise HTTPException(status_code=404, detail="Todo not found")
    logger.info(f"任务删除成功: id={todo_id}")
    return {"detail": "Todo deleted"}

# Team Member endpoints
@app.get("/team-members", response_model=List[schemas.TeamMemberInDB])
def read_team_members(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logger.debug(f"获取团队成员列表: skip={skip}, limit={limit}")
    members = crud.get_team_members(db, skip=skip, limit=limit)
    logger.debug(f"返回 {len(members)} 个成员")
    return members

@app.get("/team-members/{member_id}", response_model=schemas.TeamMemberInDB)
def read_team_member(member_id: int, db: Session = Depends(get_db)):
    logger.debug(f"获取团队成员: id={member_id}")
    member = crud.get_team_member(db, member_id=member_id)
    if member is None:
        logger.warning(f"团队成员不存在: id={member_id}")
        raise HTTPException(status_code=404, detail="Team member not found")
    logger.debug(f"成功获取团队成员: {member.name}")
    return member

@app.post("/team-members", response_model=schemas.TeamMemberInDB)
def create_team_member(member: schemas.TeamMemberCreate, db: Session = Depends(get_db)):
    logger.debug(f"创建团队成员: name={member.name}")
    created_member = crud.create_team_member(db=db, member=member)
    logger.info(f"团队成员创建成功: id={created_member.id}, name={created_member.name}")
    return created_member

@app.put("/team-members/{member_id}", response_model=schemas.TeamMemberInDB)
def update_team_member(member_id: int, member_update: schemas.TeamMemberUpdate, db: Session = Depends(get_db)):
    logger.debug(f"更新团队成员: id={member_id}")
    updated_member = crud.update_team_member(db, member_id, member_update)
    if updated_member is None:
        logger.warning(f"更新失败，团队成员不存在: id={member_id}")
        raise HTTPException(status_code=404, detail="Team member not found")
    logger.info(f"团队成员更新成功: id={member_id}")
    return updated_member

@app.delete("/team-members/{member_id}")
def delete_team_member(member_id: int, db: Session = Depends(get_db)):
    logger.debug(f"删除团队成员: id={member_id}")
    deleted_member = crud.delete_team_member(db, member_id)
    if deleted_member is None:
        logger.warning(f"删除失败，团队成员不存在: id={member_id}")
        raise HTTPException(status_code=404, detail="Team member not found")
    logger.info(f"团队成员删除成功: id={member_id}")
    return {"detail": "Team member deleted"}

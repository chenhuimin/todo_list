from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from logger import setup_logger

logger = setup_logger(__name__)

SQLALCHEMY_DATABASE_URL = "sqlite:///./todos.db"

logger.info(f"初始化数据库连接: {SQLALCHEMY_DATABASE_URL}")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

logger.info("数据库连接配置完成")

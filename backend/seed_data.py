"""
种子数据脚本 - 初始化团队成员和任务数据
"""
from database import SessionLocal, engine, Base
from models import TeamMember, Todo
from logger import setup_logger

logger = setup_logger(__name__)

def seed_data():
    # 首先创建所有表
    logger.info("创建数据库表...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # 检查是否已有数据
        existing_members = db.query(TeamMember).count()
        if existing_members > 0:
            logger.info("数据库已有数据，跳过初始化")
            return
        
        logger.info("开始初始化种子数据...")
        
        # 创建团队成员
        members = [
            TeamMember(name="Akash Singh"),
            TeamMember(name="Vaibhav Kumar"),
            TeamMember(name="Piyush Raj"),
            TeamMember(name="Nitesh Rajput"),
        ]
        
        for member in members:
            db.add(member)
        
        db.commit()
        logger.info(f"已创建 {len(members)} 个团队成员")
        
        # 刷新以获取 ID
        for member in members:
            db.refresh(member)
        
        # 创建示例任务
        today = "2025-02-21"
        todos = [
            Todo(
                title="Team Meeting",
                description="Lorem ipsum dolor sit amet, consectetur elit iddy nlorem idjsfjfj.",
                color="blue",
                start_time="10:30 AM",
                end_time="12:00 PM",
                date=today,
                assigned_to_id=members[0].id,
                completed=False
            ),
            Todo(
                title="Work on Branding",
                description="Lorem ipsum dolor sit amet, consectetur elit iddy nlorem idjsfjfj.",
                color="purple",
                start_time="10:30 AM",
                end_time="12:00 PM",
                date=today,
                assigned_to_id=members[1].id,
                completed=False
            ),
            Todo(
                title="Make a Report for client",
                description="Lorem ipsum dolor sit amet, consectetur elit iddy nlorem idjsfjfj.",
                color="yellow",
                start_time="10:30 AM",
                end_time="12:00 PM",
                date=today,
                assigned_to_id=members[2].id,
                completed=False
            ),
            Todo(
                title="Create a planer",
                description="Lorem ipsum dolor sit amet, consectetur elit iddy nlorem idjsfjfj.",
                color="pink",
                start_time="10:30 AM",
                end_time="12:00 PM",
                date=today,
                assigned_to_id=members[3].id,
                completed=False
            ),
            Todo(
                title="Create Treatment Plan",
                description="Lorem ipsum dolor sit amet, consectetur elit iddy nlorem idjsfjfj.",
                color="green",
                start_time="10:30 AM",
                end_time="12:00 PM",
                date=today,
                assigned_to_id=members[0].id,
                completed=False
            ),
        ]
        
        for todo in todos:
            db.add(todo)
        
        db.commit()
        logger.info(f"已创建 {len(todos)} 个示例任务")
        logger.info("种子数据初始化完成！")
        
    except Exception as e:
        logger.error(f"初始化种子数据失败: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()

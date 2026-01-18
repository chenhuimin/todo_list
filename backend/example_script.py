"""
示例：如何在其他 Python 脚本中使用 logger
"""
from logger import setup_logger

logger = setup_logger(__name__)

def example_function():
    logger.debug("这是 DEBUG 级别的日志")
    logger.info("这是 INFO 级别的日志")
    logger.warning("这是 WARNING 级别的日志")
    logger.error("这是 ERROR 级别的日志")
    logger.critical("这是 CRITICAL 级别的日志")

class ExampleClass:
    def __init__(self):
        self.logger = setup_logger(self.__class__.__name__)
        self.logger.info(f"ExampleClass 初始化")
    
    def do_something(self):
        self.logger.debug("执行某项操作")
        self.logger.info("操作完成")

if __name__ == "__main__":
    logger.info("启动示例脚本")
    
    example_function()
    
    example_obj = ExampleClass()
    example_obj.do_something()
    
    logger.info("示例脚本执行完成")

# 日志功能说明

## 概述

项目使用统一的日志系统，所有模块都可以通过 `logger.py` 模块获取 logger 实例。

## 使用方法

### 1. 导入 logger

```python
from logger import setup_logger

logger = setup_logger(__name__)
```

### 2. 在函数中使用

```python
def my_function():
    logger.debug("调试信息")
    logger.info("普通信息")
    logger.warning("警告信息")
    logger.error("错误信息")
    logger.critical("严重错误")
```

### 3. 在类中使用

```python
class MyClass:
    def __init__(self):
        self.logger = setup_logger(self.__class__.__name__)
        self.logger.info(f"{self.__class__.__name__} 初始化")
    
    def do_something(self):
        self.logger.debug("执行操作")
        self.logger.info("操作完成")
```

## 日志级别

- **DEBUG**: 详细的调试信息
- **INFO**: 一般信息
- **WARNING**: 警告信息
- **ERROR**: 错误信息
- **CRITICAL**: 严重错误

## 日志输出

日志会同时输出到：
- **控制台**: 实时显示
- **文件**: 保存在 `app.log` 中

## 日志格式

```
时间 - 模块名 - 级别 - 消息
```

示例：
```
2026-01-15 15:50:05,676 - database - INFO - 初始化数据库连接: sqlite:///./todos.db
```

## 已集成的模块

以下模块已集成日志功能：

1. **main.py** - API 请求和响应日志
2. **database.py** - 数据库连接日志
3. **crud.py** - 数据库操作日志
4. **logger.py** - 日志配置模块
5. **example_script.py** - 使用示例

## 示例

参考 `example_script.py` 查看完整的使用示例：

```bash
python example_script.py
```

## 注意事项

1. 不要在 logger.py 中直接使用 logger，会导致循环导入
2. 每个模块只应创建一个 logger 实例
3. 使用 `__name__` 作为 logger 名称，便于追踪日志来源
4. 类中可以使用 `self.__class__.__name__` 作为 logger 名称

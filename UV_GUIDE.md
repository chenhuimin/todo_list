# 使用 uv 管理 Python 依赖

本项目的后端使用 [uv](https://github.com/astral-sh/uv) 作为 Python 包管理器，它是一个极快的 Python 包和项目管理工具。

## 为什么使用 uv？

- ⚡ **极速** - 比 pip 快 10-100 倍
- 📦 **可靠** - 支持锁文件 (`uv.lock`)
- 🔒 **安全** - 依赖解析更准确
- 🎯 **简单** - 命令简洁易用
- 🔄 **兼容** - 完全兼容 pip 和 PyPI

## 安装 uv

### macOS / Linux

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Windows

```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 使用 pip 安装

```bash
pip install uv
```

## 常用命令

### 项目初始化

```bash
# 同步项目依赖（首次运行或更新依赖后）
uv sync

# 这会：
# 1. 读取 pyproject.toml
# 2. 解析依赖关系
# 3. 创建/更新 .venv 虚拟环境
# 4. 安装所有依赖
```

### 运行命令

```bash
# 在虚拟环境中运行 Python 脚本
uv run python script.py

# 运行 uvicorn 服务器
uv run uvicorn main:app --reload

# 运行任何命令
uv run <command>
```

### 管理依赖

```bash
# 添加新依赖
uv add <package-name>

# 添加开发依赖
uv add --dev <package-name>

# 删除依赖
uv remove <package-name>

# 列出已安装的包
uv pip list

# 查看依赖树
uv tree
```

### 虚拟环境管理

```bash
# 创建虚拟环境
uv venv

# 激活虚拟环境（可选，uv run 会自动使用）
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows

# 停用虚拟环境
deactivate
```

## 项目文件说明

### pyproject.toml

定义项目元数据和依赖：

```toml
[project]
name = "todo-backend"
version = "1.0.0"
description = "FastAPI backend for Todo List"
requires-python = ">=3.8"
dependencies = [
    "fastapi",
    "uvicorn[standard]",
    "sqlalchemy",
    "pydantic",
    "python-multipart",
    "pyjwt",
    "passlib[bcrypt]",
    "python-jose[cryptography]",
]

[tool.uv]
dev-dependencies = []
```

### uv.lock

锁定依赖版本，确保可重现的构建：

- 📌 锁定所有依赖的精确版本
- 🔒 包括传递依赖
- 🔄 自动生成和更新
- 📝 应该提交到版本控制

## 本项目的工作流

### 首次设置

```bash
cd backend
uv sync                              # 安装所有依赖
uv run python seed_data.py           # 初始化数据库
uv run uvicorn main:app --reload     # 启动服务器
```

### 日常开发

```bash
# 启动开发服务器
uv run uvicorn main:app --reload

# 运行脚本
uv run python seed_data.py

# 添加新依赖
uv add requests
```

### 更新依赖

```bash
# 更新所有依赖到最新兼容版本
uv sync --upgrade

# 更新特定包
uv add <package-name>@latest
```

## 迁移说明

### 从 pip 迁移到 uv

如果你之前使用 pip，迁移步骤：

1. 安装 uv（见上文）
2. 删除旧的虚拟环境：`rm -rf .venv`
3. 运行 `uv sync` 重新创建环境

### 从 requirements.txt 迁移

```bash
# uv 可以直接读取 requirements.txt
uv pip install -r requirements.txt

# 或者转换为 pyproject.toml 格式（推荐）
# 手动将依赖添加到 pyproject.toml
```

## 常见问题

### Q: 为什么运行命令时不需要激活虚拟环境？

A: `uv run` 会自动检测并使用项目的虚拟环境，不需要手动激活。

### Q: uv.lock 文件很大，需要提交吗？

A: 是的！这个文件锁定了所有依赖版本，确保团队成员和 CI/CD 环境的一致性。

### Q: 如何在 CI/CD 中使用 uv？

A: 

```yaml
# GitHub Actions 示例
- name: Install uv
  run: curl -LsSf https://astral.sh/uv/install.sh | sh

- name: Install dependencies
  run: uv sync

- name: Run tests
  run: uv run pytest
```

### Q: uv 与 pip/poetry/pipenv 相比如何？

A: 

- 比 pip 快 10-100 倍
- 比 poetry 快 10-15 倍
- 支持完整的项目管理（类似 poetry）
- 更简单的 API（类似 pip）

## 更多资源

- 📖 [uv 官方文档](https://github.com/astral-sh/uv)
- 💬 [uv Discord 社区](https://discord.gg/astral-sh)
- 🐛 [报告问题](https://github.com/astral-sh/uv/issues)

## 性能对比

```
安装 50 个包的时间对比：

pip:     45.2s
poetry:  38.5s
uv:      1.3s  ⚡️

(实际速度取决于网络和系统配置)
```

---

使用 uv 让 Python 依赖管理变得更快、更简单、更可靠！🚀

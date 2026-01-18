# Todo List - HealDocs Style

一个现代化的看板风格 Todo List 应用，使用 React + TypeScript + Tailwind CSS 前端和 FastAPI + SQLite 后端。

![Todo List Preview](设计图片链接)

## ✨ 特性

- 🎨 **现代化 UI 设计** - 仿照 HealDocs 风格的看板界面
- 🎯 **任务管理** - 创建、编辑、删除和标记任务完成
- 👥 **团队协作** - 管理团队成员，分配任务
- 🎨 **彩色标签** - 5 种颜色标签（蓝色、紫色、黄色、粉色、绿色）
- ⏰ **时间管理** - 设置任务开始和结束时间
- 📅 **日期筛选** - 按日期查看任务
- 🔍 **搜索功能** - 快速搜索任务
- 📱 **响应式设计** - 支持桌面和移动设备
- ⚡ **实时更新** - 前后端实时数据同步

## 技术栈

**前端:**
- ⚛️ React 18 + TypeScript
- ⚡ Vite - 极速开发服务器
- 🎨 Tailwind CSS - 原子化 CSS
- 🧩 Radix UI - 无障碍组件库
- 🎯 Lucide React - 图标库
- 📡 Axios - HTTP 客户端

**后端:**
- 🚀 FastAPI - 现代异步 Web 框架
- 💾 SQLite + SQLAlchemy - 数据库
- ✅ Pydantic - 数据验证
- 📦 uv - 极速 Python 包管理器 ([使用指南](UV_GUIDE.md))
- 🔐 CORS 支持
- 📝 完整日志记录

## 项目结构

```
todo_list/
├── backend/
│   ├── main.py          # FastAPI 主应用
│   ├── models.py        # SQLAlchemy 数据库模型
│   ├── schemas.py       # Pydantic 数据模型
│   ├── crud.py          # CRUD 数据库操作
│   ├── database.py      # 数据库配置
│   ├── logger.py        # 日志配置
│   ├── seed_data.py     # 初始化示例数据
│   └── pyproject.toml   # Python 依赖配置
└── frontend/
    ├── src/
    │   ├── App.tsx            # 主应用组件
    │   ├── main.tsx           # 应用入口
    │   ├── index.css          # 全局样式
    │   ├── types/
    │   │   └── index.ts       # TypeScript 类型定义
    │   ├── services/
    │   │   └── api.ts         # API 服务封装
    │   ├── components/
    │   │   ├── Sidebar.tsx         # 侧边栏导航
    │   │   ├── Header.tsx          # 顶部导航栏
    │   │   ├── TaskCard.tsx        # 任务卡片
    │   │   ├── TaskBoard.tsx       # 任务看板
    │   │   ├── TaskDialog.tsx      # 任务编辑对话框
    │   │   └── ui/                 # UI 基础组件
    │   └── lib/
    │       └── utils.ts       # 工具函数
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    └── tsconfig.json
```

## 快速开始

### 方法一：使用启动脚本（推荐）

```bash
# 一键启动前后端服务
./start.sh

# 停止所有服务
./stop.sh
```

启动脚本会自动：
- ✅ 检查依赖是否安装
- ✅ 初始化数据库（如果不存在）
- ✅ 安装前端依赖（如果需要）
- ✅ 启动后端和前端服务
- ✅ 在后台运行，并保存日志

### 方法二：手动启动

#### 前置要求

- Node.js 18+ 
- Python 3.8+
- [uv](https://github.com/astral-sh/uv) - Python 包管理器（推荐）
- npm 或 yarn

#### 1. 克隆项目

```bash
git clone <repository-url>
cd todo_list
```

#### 2. 启动后端（使用 uv）

```bash
# 进入后端目录
cd backend

# 使用 uv 同步依赖（会自动创建虚拟环境）
uv sync

# 初始化数据库和示例数据
uv run python seed_data.py

# 启动后端服务
uv run uvicorn main:app --reload --port 8000
```

**或者使用传统方式（不推荐）：**

```bash
# 进入后端目录
cd backend

# 创建并激活虚拟环境
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 安装依赖
pip install fastapi uvicorn sqlalchemy pydantic python-multipart pyjwt passlib python-jose

# 初始化数据库和示例数据
python seed_data.py

# 启动后端服务
uvicorn main:app --reload --port 8000
```

后端服务运行在 http://localhost:8000

📚 访问 API 文档: http://localhost:8000/docs

#### 3. 启动前端

```bash
# 打开新终端，进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务运行在 http://localhost:3000

## API 端点

### 任务管理

| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| GET | `/todos` | 获取任务列表 | `completed`, `date`, `assigned_to_id`, `search` |
| GET | `/todos/{id}` | 获取单个任务 | - |
| POST | `/todos` | 创建新任务 | `TodoCreate` |
| PUT | `/todos/{id}` | 更新任务 | `TodoUpdate` |
| DELETE | `/todos/{id}` | 删除任务 | - |

### 团队成员管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/team-members` | 获取团队成员列表 |
| GET | `/team-members/{id}` | 获取单个成员 |
| POST | `/team-members` | 创建团队成员 |
| PUT | `/team-members/{id}` | 更新成员信息 |
| DELETE | `/team-members/{id}` | 删除成员 |

## 数据模型

### Todo (任务)

```typescript
{
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  color: 'blue' | 'purple' | 'yellow' | 'pink' | 'green';
  start_time?: string;  // "10:30 AM"
  end_time?: string;    // "12:00 PM"
  date?: string;        // "2025-02-21"
  assigned_to_id?: number;
  assigned_to?: TeamMember;
  created_at: string;
  updated_at: string;
}
```

### TeamMember (团队成员)

```typescript
{
  id: number;
  name: string;
  avatar?: string;
  created_at: string;
}
```

## 功能说明

### 侧边栏导航
- **Overview** - 概览视图
- **Team Mates** - 团队成员管理，可展开查看成员列表
- **Todo List** - 任务列表，可展开查看任务分类

### 任务看板
- **Active Task** - 显示未完成的任务
- **Completed** - 显示已完成的任务
- 网格布局展示任务卡片
- 彩色背景区分不同类型的任务

### 任务卡片
- 复选框 - 快速标记完成状态
- 标题和描述 - 显示任务详情
- 时间范围 - 显示任务时间
- 分配信息 - 显示负责人
- 三点菜单 - 编辑和删除操作

### 顶部控制栏
- 日期选择器 - 切换查看不同日期的任务
- 搜索框 - 实时搜索任务标题
- 添加按钮 - 创建新任务

## 开发命令

### 后端（推荐使用 uv）

```bash
# 同步依赖（首次运行）
uv sync

# 运行开发服务器
uv run uvicorn main:app --reload

# 初始化示例数据
uv run python seed_data.py

# 查看已安装的包
uv pip list

# 添加新依赖
uv add <package-name>
```

### 前端

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 日志功能

后端包含完整的日志记录系统：

- ✅ 控制台实时输出（DEBUG 级别）
- ✅ 文件持久化存储 (`app.log`)
- ✅ 请求/响应详细记录
- ✅ 操作时间统计

日志格式：
```
2026-01-15 20:12:47 - main - DEBUG - 请求: GET /todos
2026-01-15 20:12:47 - main - DEBUG - 客户端: 127.0.0.1
2026-01-15 20:12:47 - crud - DEBUG - CRUD: 查询任务列表, skip=0, limit=100
2026-01-15 20:12:47 - main - DEBUG - 响应: 200 - 耗时: 0.003s
```

## 示例数据

首次运行 `seed_data.py` 会自动创建：

**团队成员：**
- Akash Singh
- Vaibhav Kumar
- Piyush Raj
- Nitesh Rajput

**示例任务：**
- Team Meeting (蓝色)
- Work on Branding (紫色)
- Make a Report for client (黄色)
- Create a planer (粉色)
- Create Treatment Plan (绿色)

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

#!/bin/bash

# 启动脚本 - Todo List 应用

echo "🚀 启动 Todo List 应用..."
echo ""

# 检查 uv 是否安装
if ! command -v uv &> /dev/null; then
    echo "❌ 错误: uv 未安装"
    echo "请先安装 uv: curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: npm 未安装"
    echo "请先安装 Node.js 和 npm"
    exit 1
fi

# 启动后端
echo "📦 启动后端服务..."
cd backend

# 检查是否需要初始化数据库
if [ ! -f "todos.db" ]; then
    echo "🔧 初始化数据库..."
    uv run python seed_data.py
fi

# 启动后端服务（后台运行）
uv run uvicorn main:app --reload --port 8000 > /tmp/todo_backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ 后端服务已启动 (PID: $BACKEND_PID) - http://localhost:8000"

cd ..

# 启动前端
echo "📦 启动前端服务..."
cd frontend

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "🔧 安装前端依赖..."
    npm install
fi

# 启动前端服务（后台运行）
npm run dev > /tmp/todo_frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ 前端服务已启动 (PID: $FRONTEND_PID) - http://localhost:3000"

cd ..

echo ""
echo "🎉 应用启动完成！"
echo ""
echo "📌 访问地址:"
echo "   前端: http://localhost:3000"
echo "   后端 API: http://localhost:8000/docs"
echo ""
echo "📝 日志文件:"
echo "   后端: /tmp/todo_backend.log"
echo "   前端: /tmp/todo_frontend.log"
echo ""
echo "🛑 停止服务:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# 保存 PID 到文件
echo "$BACKEND_PID" > /tmp/todo_backend.pid
echo "$FRONTEND_PID" > /tmp/todo_frontend.pid

echo "💡 提示: 使用 ./stop.sh 停止所有服务"

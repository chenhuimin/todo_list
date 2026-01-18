#!/bin/bash

# 停止脚本 - Todo List 应用

echo "🛑 停止 Todo List 应用..."

# 读取 PID 文件
if [ -f "/tmp/todo_backend.pid" ]; then
    BACKEND_PID=$(cat /tmp/todo_backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo "✅ 后端服务已停止 (PID: $BACKEND_PID)"
    else
        echo "⚠️  后端服务未运行"
    fi
    rm /tmp/todo_backend.pid
fi

if [ -f "/tmp/todo_frontend.pid" ]; then
    FRONTEND_PID=$(cat /tmp/todo_frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo "✅ 前端服务已停止 (PID: $FRONTEND_PID)"
    else
        echo "⚠️  前端服务未运行"
    fi
    rm /tmp/todo_frontend.pid
fi

# 清理其他可能的进程
pkill -f "uvicorn main:app"
pkill -f "vite"

echo ""
echo "🎉 所有服务已停止！"

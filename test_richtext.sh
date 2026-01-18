#!/bin/bash

# 富文本编辑器功能测试脚本

echo "=== 富文本编辑器功能测试 ==="
echo ""

# 1. 测试后端 API
echo "1. 测试后端 API..."
curl -s http://localhost:8000/todos | head -20
echo ""
echo ""

# 2. 创建带富文本的任务
echo "2. 创建带富文本描述的任务..."
curl -s -X POST http://localhost:8000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "富文本测试任务",
    "description": "<p>这是一段<strong>粗体</strong>文本</p><p>这是一个<em>斜体</em>段落</p>",
    "completed": false
  }'
echo ""
echo ""

# 3. 获取任务列表
echo "3. 获取任务列表（查看富文本内容）..."
curl -s http://localhost:8000/todos | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8000/todos
echo ""
echo ""

echo "=== 测试完成 ==="
echo ""
echo "请访问前端页面测试富文本编辑器的可视化功能："
echo "http://localhost:3000"

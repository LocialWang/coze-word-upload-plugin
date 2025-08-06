#!/bin/bash

echo "🚀 启动Coze Word文档上传插件"
echo "=============================="

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到Node.js，请先安装Node.js"
    exit 1
fi

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

# 创建uploads目录
mkdir -p uploads

echo "✅ 启动插件服务..."
echo ""
echo "📍 服务地址:"
echo "   - 测试界面: http://localhost:3000/static/index.html"
echo "   - OpenAPI规范: http://localhost:3000/openapi.yaml"
echo "   - 健康检查: http://localhost:3000/health"
echo ""
echo "🔧 Coze集成:"
echo "   1. 在Coze平台导入插件时使用: http://localhost:3000/openapi.yaml"
echo "   2. 或上传项目根目录下的 openapi.yaml 文件"
echo ""
echo "按 Ctrl+C 停止服务"
echo "=============================="
echo ""

# 启动服务
npm start
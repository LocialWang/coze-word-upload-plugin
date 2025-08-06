#!/bin/bash

echo "🚀 Coze Word文档上传插件安装脚本"
echo "=================================="

# 检查Node.js是否已安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到Node.js"
    echo "请先安装Node.js (版本 >= 14): https://nodejs.org/"
    exit 1
fi

# 检查npm是否已安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未检测到npm"
    echo "请确保npm已正确安装"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"

# 安装依赖
echo "📦 正在安装依赖包..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ 依赖安装成功!"
else
    echo "❌ 依赖安装失败"
    exit 1
fi

# 创建uploads目录
echo "📁 创建上传目录..."
mkdir -p uploads

echo ""
echo "🎉 安装完成!"
echo ""
echo "启动服务器："
echo "  npm start        # 生产环境"
echo "  npm run dev      # 开发环境"
echo ""
echo "访问测试界面："
echo "  http://localhost:3000/static/index.html"
echo ""
echo "查看API文档："
echo "  http://localhost:3000/openapi.json"
echo ""
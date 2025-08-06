#!/bin/bash

echo "🚀 一键部署到Railway"
echo "===================="

# 检查是否安装了Railway CLI
if ! command -v railway &> /dev/null; then
    echo "📦 正在安装Railway CLI..."
    npm install -g @railway/cli
    if [ $? -ne 0 ]; then
        echo "❌ Railway CLI安装失败"
        echo "请手动安装: npm install -g @railway/cli"
        exit 1
    fi
fi

echo "✅ Railway CLI已安装"

# 检查是否已登录
echo "🔐 检查登录状态..."
railway whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "请先登录Railway:"
    railway login
    if [ $? -ne 0 ]; then
        echo "❌ 登录失败"
        exit 1
    fi
fi

echo "✅ 已登录Railway"

# 初始化Git仓库（如果不存在）
if [ ! -d ".git" ]; then
    echo "📁 初始化Git仓库..."
    git init
    git add .
    git commit -m "Initial commit for Coze Word Upload Plugin"
fi

echo "🚀 开始部署..."
railway up

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 部署成功！"
    echo ""
    echo "接下来的步骤："
    echo "1. 在Railway控制台获取您的应用URL"
    echo "2. 更新openapi.yaml中的服务器地址"
    echo "3. 在Coze中使用新的URL导入插件"
    echo ""
    echo "Railway控制台: https://railway.app/dashboard"
    echo ""
else
    echo "❌ 部署失败，请检查错误信息"
    exit 1
fi
#!/bin/bash

echo "📤 上传代码到GitHub"
echo "==================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查Git是否已安装
if ! command -v git &> /dev/null; then
    echo "❌ 错误：未检测到Git，请先安装Git"
    echo "下载地址：https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git已安装：$(git --version)"

# 检查Git配置
git_name=$(git config --global user.name)
git_email=$(git config --global user.email)

if [ -z "$git_name" ] || [ -z "$git_email" ]; then
    echo ""
    echo "⚙️  首次使用Git，需要配置用户信息："
    read -p "请输入您的用户名: " input_name
    read -p "请输入您的邮箱: " input_email
    
    git config --global user.name "$input_name"
    git config --global user.email "$input_email"
    
    echo "✅ Git配置完成"
else
    echo "✅ Git用户信息：$git_name <$git_email>"
fi

echo ""
echo "📋 准备上传信息："

# 获取GitHub用户名
read -p "请输入您的GitHub用户名: " username

if [ -z "$username" ]; then
    echo "❌ 用户名不能为空"
    exit 1
fi

# 确认仓库名称
repo_name="coze-word-upload-plugin"
read -p "仓库名称 [$repo_name]: " input_repo
if [ ! -z "$input_repo" ]; then
    repo_name="$input_repo"
fi

echo ""
echo "📍 目标仓库：https://github.com/$username/$repo_name"
echo ""

# 确认继续
read -p "确认上传？(y/N): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ 取消上传"
    exit 0
fi

echo ""
echo "🚀 开始上传..."

# 初始化Git仓库（如果未初始化）
if [ ! -d ".git" ]; then
    echo "📁 初始化Git仓库..."
    git init
    
    # 创建.gitignore（如果不存在）
    if [ ! -f ".gitignore" ]; then
        echo "📝 创建.gitignore文件..."
        cat > .gitignore << EOF
# 依赖
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 运行时数据
pids
*.pid
*.seed
*.pid.lock

# 上传的文件
uploads/*
!uploads/.gitkeep

# 日志
logs
*.log

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# 临时文件
*.tmp
*.temp
EOF
    fi
else
    echo "✅ Git仓库已存在"
fi

# 添加远程仓库
echo "🔗 配置远程仓库..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/$username/$repo_name.git

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    # 添加所有文件
    echo "📦 添加文件到暂存区..."
    git add .

    # 提交
    echo "💾 提交文件..."
    git commit -m "Initial commit: Coze Word文档上传插件

功能特性：
- 支持.docx格式Word文档上传
- 自动文本提取和字数统计
- RESTful API设计
- OpenAPI 3.0规范
- 现代化Web测试界面
- 支持云端部署
- 完整的错误处理

技术栈：
- Node.js + Express
- Mammoth.js文档解析
- Multer文件上传
- 原生前端技术

部署支持：
- Railway一键部署
- Docker容器化
- 多平台云部署方案"

else
    echo "✅ 没有需要提交的更改"
fi

# 设置分支名称
echo "🌿 设置主分支..."
git branch -M main

# 推送到GitHub
echo "🚀 推送到GitHub..."
echo ""
echo "注意：如果提示认证失败，请使用以下方式之一："
echo "1. 用户名：您的GitHub用户名"
echo "2. 密码：Personal Access Token（不是GitHub密码）"
echo "3. 获取Token：GitHub → Settings → Developer settings → Personal access tokens"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 上传成功！"
    echo ""
    echo "📍 仓库地址："
    echo "   https://github.com/$username/$repo_name"
    echo ""
    echo "🔗 克隆地址："
    echo "   git clone https://github.com/$username/$repo_name.git"
    echo ""
    echo "📋 接下来可以："
    echo "1. 🚀 一键部署到Railway："
    echo "   ./deploy-railway.sh"
    echo ""
    echo "2. 🌐 手动部署到云平台："
    echo "   - Railway: https://railway.app (推荐)"
    echo "   - Render: https://render.com (免费)"
    echo "   - Vercel: npx vercel"
    echo ""
    echo "3. 📖 查看部署指南："
    echo "   cat CLOUD_DEPLOYMENT.md"
    echo ""
    echo "4. 🔧 在Coze中导入插件："
    echo "   使用云端部署后的OpenAPI URL"
    echo ""
else
    echo ""
    echo "❌ 上传失败，可能的原因和解决方案："
    echo ""
    echo "🔍 常见问题："
    echo "1. 仓库不存在"
    echo "   解决：访问 https://github.com/new 创建仓库"
    echo "   仓库名称：$repo_name"
    echo ""
    echo "2. 认证失败"
    echo "   解决：使用Personal Access Token"
    echo "   步骤：GitHub → Settings → Developer settings → Personal access tokens"
    echo "   权限：repo, workflow, write:packages"
    echo ""
    echo "3. 网络问题"
    echo "   解决：检查网络连接，或稍后重试"
    echo ""
    echo "🛠️  调试命令："
    echo "   git status          # 查看状态"
    echo "   git remote -v       # 查看远程仓库"
    echo "   git log --oneline   # 查看提交历史"
    echo ""
    echo "📞 需要帮助？查看详细说明："
    echo "   cat GITHUB_UPLOAD.md"
    echo ""
fi
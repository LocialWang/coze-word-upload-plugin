# GitHub上传详细步骤

本文档详细介绍如何将Coze Word文档上传插件的代码上传到GitHub。

## 📋 准备工作

### 1. 确保已安装Git
```bash
# 检查Git是否已安装
git --version

# 如果未安装，请访问：https://git-scm.com/downloads
```

### 2. 配置Git用户信息（首次使用）
```bash
# 设置用户名和邮箱（替换为您的信息）
git config --global user.name "您的用户名"
git config --global user.email "您的邮箱@example.com"
```

## 🌐 在GitHub创建仓库

### 方法一：通过GitHub网站创建

1. **登录GitHub**
   - 访问 [github.com](https://github.com)
   - 登录您的账号

2. **创建新仓库**
   - 点击右上角的 "+" 号
   - 选择 "New repository"

3. **填写仓库信息**
   - Repository name: `coze-word-upload-plugin`
   - Description: `Coze智能体Word文档上传插件`
   - 选择 "Public"（公开）或 "Private"（私有）
   - ✅ 勾选 "Add a README file"
   - 选择 "Node" 作为 .gitignore 模板
   - 选择 "MIT License"（可选）

4. **点击 "Create repository"**

### 方法二：通过GitHub CLI创建（需要安装GitHub CLI）

```bash
# 安装GitHub CLI（如果未安装）
# macOS: brew install gh
# Windows: 下载安装包

# 登录GitHub
gh auth login

# 创建仓库
gh repo create coze-word-upload-plugin --public --description "Coze智能体Word文档上传插件"
```

## 📤 上传代码到GitHub

### 步骤1：初始化本地Git仓库

```bash
# 进入项目目录
cd /Users/wangshuyang/Desktop/coze-word-upload-plugin

# 初始化Git仓库
git init

# 添加远程仓库（替换为您的GitHub用户名）
git remote add origin https://github.com/您的用户名/coze-word-upload-plugin.git
```

### 步骤2：添加和提交文件

```bash
# 查看文件状态
git status

# 添加所有文件到暂存区
git add .

# 提交文件
git commit -m "Initial commit: Coze Word文档上传插件"
```

### 步骤3：推送到GitHub

```bash
# 推送到GitHub（首次推送）
git push -u origin main

# 如果出现分支名称问题，可能需要：
git branch -M main
git push -u origin main
```

## 🔧 如果遇到问题

### 问题1：认证失败

如果推送时提示认证失败，有两种解决方案：

#### 方案A：使用Personal Access Token（推荐）

1. **生成Token**
   - 访问 GitHub → Settings → Developer settings → Personal access tokens
   - 点击 "Generate new token"
   - 选择权限：repo, workflow, write:packages
   - 复制生成的token

2. **使用Token推送**
   ```bash
   # 方法1：在推送时输入token作为密码
   git push -u origin main
   # 用户名：您的GitHub用户名
   # 密码：刚才复制的token

   # 方法2：在URL中包含token
   git remote set-url origin https://您的用户名:您的token@github.com/您的用户名/coze-word-upload-plugin.git
   git push -u origin main
   ```

#### 方案B：使用SSH Key

1. **生成SSH Key**
   ```bash
   # 生成SSH密钥（替换为您的邮箱）
   ssh-keygen -t ed25519 -C "您的邮箱@example.com"
   
   # 启动ssh-agent
   eval "$(ssh-agent -s)"
   
   # 添加SSH key到ssh-agent
   ssh-add ~/.ssh/id_ed25519
   ```

2. **添加SSH Key到GitHub**
   ```bash
   # 复制公钥内容
   cat ~/.ssh/id_ed25519.pub
   ```
   - 访问 GitHub → Settings → SSH and GPG keys
   - 点击 "New SSH key"
   - 粘贴公钥内容

3. **使用SSH URL**
   ```bash
   git remote set-url origin git@github.com:您的用户名/coze-word-upload-plugin.git
   git push -u origin main
   ```

### 问题2：分支名称问题

如果遇到 `master` vs `main` 分支问题：

```bash
# 重命名分支为main
git branch -M main

# 推送到main分支
git push -u origin main
```

### 问题3：文件太大

如果有大文件无法上传：

```bash
# 查看大文件
find . -size +100M -type f

# 添加到.gitignore
echo "大文件名" >> .gitignore

# 重新提交
git add .gitignore
git commit -m "Add large files to gitignore"
```

## 📝 完整的上传脚本

我为您创建了一个自动化脚本：

```bash
#!/bin/bash

echo "📤 上传代码到GitHub"
echo "==================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 获取GitHub用户名
read -p "请输入您的GitHub用户名: " username

if [ -z "$username" ]; then
    echo "❌ 用户名不能为空"
    exit 1
fi

# 初始化Git仓库（如果未初始化）
if [ ! -d ".git" ]; then
    echo "📁 初始化Git仓库..."
    git init
fi

# 添加远程仓库
echo "🔗 添加远程仓库..."
git remote add origin https://github.com/$username/coze-word-upload-plugin.git 2>/dev/null || \
git remote set-url origin https://github.com/$username/coze-word-upload-plugin.git

# 添加所有文件
echo "📦 添加文件..."
git add .

# 提交
echo "💾 提交文件..."
git commit -m "Initial commit: Coze Word文档上传插件"

# 设置分支名称
git branch -M main

# 推送到GitHub
echo "🚀 推送到GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 上传成功！"
    echo "📍 仓库地址: https://github.com/$username/coze-word-upload-plugin"
    echo ""
    echo "接下来可以："
    echo "1. 部署到Railway: ./deploy-railway.sh"
    echo "2. 部署到其他云平台（查看CLOUD_DEPLOYMENT.md）"
    echo ""
else
    echo ""
    echo "❌ 上传失败，可能的原因："
    echo "1. 仓库不存在，请先在GitHub创建仓库"
    echo "2. 认证失败，请检查用户名和密码/token"
    echo "3. 网络问题，请检查网络连接"
    echo ""
    echo "解决方案："
    echo "1. 访问 https://github.com/new 创建仓库"
    echo "2. 使用Personal Access Token作为密码"
    echo "3. 查看详细说明：GITHUB_UPLOAD.md"
fi
```

## 🎯 上传后的下一步

上传成功后，您可以：

1. **部署到云平台**
   ```bash
   ./deploy-railway.sh
   ```

2. **与他人协作**
   - 邀请协作者
   - 创建Issues和Pull Requests

3. **自动部署**
   - 连接到Railway/Render等平台
   - 设置CI/CD自动部署

4. **在Coze中使用**
   - 使用云端部署的URL
   - 导入OpenAPI规范

## 📞 需要帮助？

如果在上传过程中遇到问题：

1. 查看Git状态：`git status`
2. 查看提交历史：`git log --oneline`
3. 查看远程仓库：`git remote -v`
4. 重置到上一个版本：`git reset --hard HEAD~1`

记住：GitHub是代码协作的基础，上传后就可以轻松部署到各种云平台了！
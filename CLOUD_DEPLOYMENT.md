# 云端部署指南

本文档介绍如何将Word文档上传插件部署到云平台，这样您就不需要在本地运行代码了。

## 🚀 推荐部署平台

### 1. Railway（最推荐 - 简单快速）

Railway提供免费额度，非常适合小型项目。

#### 部署步骤：

1. **准备代码**
   ```bash
   # 确保代码已提交到Git
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **创建GitHub仓库**（可选但推荐）
   - 在GitHub创建新仓库
   - 推送代码到GitHub

3. **部署到Railway**
   - 访问 [railway.app](https://railway.app)
   - 注册账号并登录
   - 点击"New Project"
   - 选择"Deploy from GitHub repo"（如果已上传GitHub）
   - 或选择"Deploy from local"直接上传代码
   - Railway会自动检测Node.js项目并部署

4. **获取部署URL**
   - 部署完成后，Railway会提供一个URL（如：`https://your-app.railway.app`）
   - 记录这个URL，稍后在Coze中使用

### 2. Render（完全免费）

Render提供永久免费的Web服务。

#### 部署步骤：

1. **上传到GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # 推送到GitHub仓库
   ```

2. **在Render部署**
   - 访问 [render.com](https://render.com)
   - 注册账号并连接GitHub
   - 点击"New +" -> "Web Service"
   - 选择您的GitHub仓库
   - 配置如下：
     - Name: `coze-word-upload-plugin`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - 点击"Create Web Service"

3. **获取部署URL**
   - 部署完成后获得URL（如：`https://your-app.onrender.com`）

### 3. Vercel（适合静态和API）

#### 部署步骤：

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **部署**
   ```bash
   vercel
   # 按提示操作，选择项目设置
   ```

3. **获取部署URL**
   - 部署完成后获得URL（如：`https://your-app.vercel.app`）

## 🔧 部署后配置

### 1. 更新OpenAPI规范

部署成功后，需要更新`openapi.yaml`中的服务器地址：

```yaml
servers:
  - url: https://your-deployed-app.railway.app  # 替换为实际部署URL
    description: 生产服务器
```

### 2. 在Coze中导入插件

1. 使用新的URL导入插件：
   ```
   https://your-deployed-app.railway.app/openapi.yaml
   ```

2. 或下载更新后的`openapi.yaml`文件上传到Coze

## 🌟 部署优势

### ✅ 使用云端部署的好处：

1. **24/7可用性** - 不需要保持电脑开机
2. **稳定性** - 云平台提供高可用性
3. **自动扩展** - 根据需求自动调整资源
4. **HTTPS支持** - 云平台自动提供SSL证书
5. **全球访问** - CDN加速，全球用户都能快速访问
6. **免费额度** - 大多数平台提供免费使用额度

### ❌ 本地运行的限制：

1. **需要保持电脑开机** - 关机后插件就无法使用
2. **网络依赖** - 需要稳定的网络连接
3. **安全性** - 需要暴露本地端口到公网
4. **维护成本** - 需要手动管理和维护

## 📋 快速部署检查清单

- [ ] 选择部署平台（推荐Railway）
- [ ] 准备代码仓库（GitHub/GitLab）
- [ ] 部署到云平台
- [ ] 获取部署URL
- [ ] 更新`openapi.yaml`中的服务器地址
- [ ] 测试部署的服务（访问`/health`端点）
- [ ] 在Coze中重新导入插件
- [ ] 测试Coze智能体功能

## 🛠️ 故障排除

### 常见问题：

1. **部署失败**
   - 检查`package.json`中的依赖
   - 确认Node.js版本兼容性
   - 查看部署平台的日志

2. **服务无法访问**
   - 确认环境变量配置正确
   - 检查端口配置（使用`process.env.PORT`）
   - 验证路由配置

3. **Coze导入失败**
   - 确认OpenAPI规范URL可访问
   - 检查YAML格式是否正确
   - 验证CORS配置

## 💡 推荐工作流程

1. **开发阶段** - 在本地运行和测试
2. **部署阶段** - 部署到云平台
3. **集成阶段** - 在Coze中使用云端URL
4. **维护阶段** - 通过Git推送更新代码

这样，您就可以享受云端部署的所有好处，而不需要一直保持本地服务运行！
# Coze Word文档上传插件

这是一个为Coze智能体开发的Word文档上传插件，支持上传.docx格式的Word文档并自动提取其中的文本内容。

## 功能特性

- ✅ 支持.docx格式Word文档上传
- ✅ 自动提取文档文本内容
- ✅ 字数统计功能
- ✅ 文档管理（查看、删除）
- ✅ 拖拽上传支持
- ✅ 现代化的Web界面
- ✅ RESTful API设计
- ✅ OpenAPI规范支持

## 技术栈

- **后端**: Node.js + Express
- **文档解析**: Mammoth.js
- **文件上传**: Multer
- **前端**: 原生HTML/CSS/JavaScript
- **API规范**: OpenAPI 3.0

## 快速开始

### 方式一：云端部署（推荐）

**一键部署到Railway：**
```bash
cd coze-word-upload-plugin
./deploy-railway.sh
```

**手动部署选项：**
- Railway: 访问 [railway.app](https://railway.app)，连接GitHub仓库
- Render: 访问 [render.com](https://render.com)，免费部署
- Vercel: 运行 `npx vercel` 快速部署

详细部署指南请查看：[CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md)

### 方式二：本地运行

```bash
cd coze-word-upload-plugin

# 安装依赖
npm install

# 启动服务
npm start              # 生产环境
# 或
npm run dev           # 开发环境（自动重启）
```

访问测试界面: `http://localhost:3000/static/index.html`

## API接口

### 上传Word文档

```http
POST /upload-word
Content-Type: multipart/form-data

参数:
- document: Word文档文件(.docx格式)
```

### 获取文档内容

```http
GET /get-document/{fileId}
```

### 获取文档列表

```http
GET /documents
```

### 删除文档

```http
DELETE /delete-document/{fileId}
```

### 健康检查

```http
GET /health
```

### OpenAPI规范

```http
GET /openapi.json
```

## Coze集成配置

### 1. 启动插件服务

首先确保插件服务正在运行：

```bash
npm start
```

服务启动后，可以访问以下地址确认服务正常：
- 健康检查: `http://localhost:3000/health`
- OpenAPI JSON: `http://localhost:3000/openapi.json`
- OpenAPI YAML: `http://localhost:3000/openapi.yaml` (推荐用于Coze导入)

### 2. 在Coze平台导入插件

1. 登录Coze平台
2. 进入"资源库" -> "插件"页面
3. 点击"导入插件"按钮
4. 选择"本地文件"选项卡
5. 上传项目根目录下的 `openapi.yaml` 文件
6. 或者选择"URL和始数据"选项卡，输入: `http://localhost:3000/openapi.yaml`

### 3. 插件配置信息

插件在Coze中的基本信息：
- **插件名称**: Word文档上传插件
- **功能描述**: 专为Coze智能体设计的Word文档上传和解析插件
- **主要功能**: 
  - 上传.docx格式Word文档
  - 自动提取文档文本内容
  - 提供字数统计和文档管理功能

### 4. 可用的API接口

导入后，智能体可以使用以下接口：

#### 4.1 uploadWordDocument
- **功能**: 上传Word文档并提取内容
- **用法**: 当用户需要上传文档时自动调用
- **返回**: 文档ID、文件名、提取的文本内容、字数统计等

#### 4.2 getDocument
- **功能**: 根据文档ID获取文档内容
- **用法**: 查看之前上传的文档内容
- **参数**: fileId (文档唯一标识符)

#### 4.3 getDocumentList
- **功能**: 获取所有已上传文档的列表
- **用法**: 查看用户的文档历史记录

#### 4.4 deleteDocument
- **功能**: 删除指定的文档
- **参数**: fileId (文档唯一标识符)

### 5. 智能体使用示例

配置完成后，在Coze智能体中可以这样使用：

```
用户: "帮我上传这个Word文档并分析其内容"
智能体: [调用uploadWordDocument接口]
智能体: "文档上传成功！我已经提取了文档内容，共计1,250字。以下是文档的主要内容：..."

用户: "显示我之前上传的所有文档"
智能体: [调用getDocumentList接口]
智能体: "您总共上传了3个文档：1. 报告.docx (1,250字) 2. 说明书.docx (800字) 3. 合同.docx (2,100字)"

用户: "请显示第一个文档的内容"
智能体: [调用getDocument接口]
智能体: "以下是报告.docx的完整内容：..."
```

### 6. 注意事项

- 确保插件服务在Coze智能体运行期间保持启动状态
- 如果部署到云服务器，记得更新 `openapi.yaml` 中的服务器地址
- 建议在生产环境中使用HTTPS和适当的身份验证
- 定期清理uploads目录中的临时文件

## 项目结构

```
coze-word-upload-plugin/
├── src/
│   └── index.js          # 主服务器代码
├── static/
│   ├── index.html        # 测试Web界面
│   └── logo.svg          # 插件图标
├── uploads/              # 上传文件存储目录
├── package.json          # 项目配置
├── manifest.json         # Coze插件配置
└── README.md            # 说明文档
```

## 配置选项

### 环境变量

- `PORT`: 服务器端口（默认: 3000）

### 文件限制

- 最大文件大小: 10MB
- 支持格式: .docx
- 存储位置: `uploads/` 目录

## 部署说明

### 本地部署

1. 确保已安装Node.js (版本 >= 14)
2. 运行 `npm install` 安装依赖
3. 运行 `npm start` 启动服务

### 生产部署

1. 使用PM2进程管理器:
```bash
npm install -g pm2
pm2 start src/index.js --name coze-word-plugin
```

2. 使用Docker部署:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 云服务部署

可以部署到以下平台：
- Heroku
- Vercel
- Railway
- DigitalOcean App Platform

## 安全注意事项

1. **文件验证**: 插件会验证文件格式，只允许.docx文件
2. **文件大小限制**: 限制上传文件最大10MB
3. **临时存储**: 上传的文件存储在本地，建议定期清理
4. **CORS配置**: 已配置CORS支持跨域请求

## 故障排除

### 常见问题

1. **文件上传失败**
   - 检查文件格式是否为.docx
   - 确认文件大小不超过10MB
   - 检查uploads目录权限

2. **服务启动失败**
   - 检查端口是否被占用
   - 确认Node.js版本 >= 14
   - 检查依赖是否正确安装

3. **文档解析失败**
   - 确认Word文档没有损坏
   - 检查文档是否为标准.docx格式
   - 查看服务器日志获取详细错误信息

### 日志查看

```bash
# 查看实时日志
npm run dev

# 使用PM2查看日志
pm2 logs coze-word-plugin
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个插件。

## 联系方式

如有问题或建议，请联系: support@example.com
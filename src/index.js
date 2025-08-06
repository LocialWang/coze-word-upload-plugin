const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// 获取基础URL，支持云端部署
const getBaseUrl = (req) => {
  if (process.env.NODE_ENV === 'production') {
    return `${req.protocol}://${req.get('host')}`;
  }
  return `http://localhost:${PORT}`;
};

// 中间件配置
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '../static')));

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads');
fs.ensureDirSync(uploadDir);

// 配置multer用于文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueId}${extension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB限制
  },
  fileFilter: function (req, file, cb) {
    // 只允许Word文档
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.originalname.toLowerCase().endsWith('.docx')) {
      cb(null, true);
    } else {
      cb(new Error('只支持.docx格式的Word文档'));
    }
  }
});

// OpenAPI规范 - 针对Coze平台优化
const openApiSpec = {
  "openapi": "3.0.0",
  "info": {
    "title": "Word文档上传插件",
    "description": "专为Coze智能体设计的Word文档上传和解析插件，支持.docx格式文档的上传、文本提取和内容分析功能。",
    "version": "1.0.0",
    "contact": {
      "name": "插件支持",
      "email": "support@example.com"
    }
  },
  "servers": [
    {
      "url": "http://localhost:3000",
      "description": "本地开发服务器"
    }
  ],
  "tags": [
    {
      "name": "文档上传",
      "description": "Word文档上传和处理相关接口"
    },
    {
      "name": "文档查询",
      "description": "文档内容查询和管理相关接口"
    }
  ],
  "paths": {
    "/upload-word": {
      "post": {
        "summary": "上传Word文档",
        "description": "上传.docx格式的Word文档并自动提取其中的文本内容，返回解析后的纯文本和相关统计信息。适用于文档分析、内容提取等场景。",
        "operationId": "uploadWordDocument",
        "tags": ["文档上传"],
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "document": {
                    "type": "string",
                    "format": "binary",
                    "description": "Word文档文件(.docx格式)"
                  }
                },
                "required": ["document"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "文档上传成功",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "message": {
                      "type": "string"
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "fileId": {
                          "type": "string",
                          "description": "文件唯一标识符"
                        },
                        "filename": {
                          "type": "string",
                          "description": "原始文件名"
                        },
                        "content": {
                          "type": "string",
                          "description": "提取的文本内容"
                        },
                        "wordCount": {
                          "type": "integer",
                          "description": "字数统计"
                        },
                        "uploadTime": {
                          "type": "string",
                          "format": "date-time",
                          "description": "上传时间"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "请求错误",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/get-document/{fileId}": {
      "get": {
        "summary": "获取文档内容",
        "description": "根据文件ID获取已上传文档的详细内容，包括原始文本、字数统计和上传时间等信息。",
        "operationId": "getDocument",
        "tags": ["文档查询"],
        "parameters": [
          {
            "name": "fileId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "文件唯一标识符"
          }
        ],
        "responses": {
          "200": {
            "description": "获取成功",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "fileId": {
                          "type": "string"
                        },
                        "filename": {
                          "type": "string"
                        },
                        "content": {
                          "type": "string"
                        },
                        "wordCount": {
                          "type": "integer"
                        },
                        "uploadTime": {
                          "type": "string",
                          "format": "date-time"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "文档未找到"
          }
        }
      }
    }
  }
};

// 存储文档信息的内存数据库（生产环境建议使用真实数据库）
const documentStore = new Map();

// API端点

// 提供OpenAPI规范 (JSON格式)
app.get('/openapi.json', (req, res) => {
  const dynamicSpec = {
    ...openApiSpec,
    servers: [
      {
        url: getBaseUrl(req),
        description: process.env.NODE_ENV === 'production' ? '生产服务器' : '本地开发服务器'
      }
    ]
  };
  res.json(dynamicSpec);
});

// 提供OpenAPI规范 (YAML格式) - 推荐用于Coze导入
app.get('/openapi.yaml', async (req, res) => {
  try {
    const yamlPath = path.join(__dirname, '../openapi.yaml');
    const yamlContent = await fs.readFile(yamlPath, 'utf8');
    res.set('Content-Type', 'application/x-yaml');
    res.send(yamlContent);
  } catch (error) {
    console.error('读取YAML文件失败:', error);
    res.status(500).json({
      success: false,
      message: '无法提供YAML格式的OpenAPI规范'
    });
  }
});

// 上传Word文档
app.post('/upload-word', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的Word文档'
      });
    }

    const filePath = req.file.path;
    const fileId = path.parse(req.file.filename).name;

    // 使用mammoth提取Word文档内容
    const result = await mammoth.extractRawText({ path: filePath });
    const content = result.value;
    const wordCount = content.trim().split(/\s+/).length;

    // 存储文档信息
    const documentInfo = {
      fileId: fileId,
      filename: req.file.originalname,
      content: content,
      wordCount: wordCount,
      uploadTime: new Date().toISOString(),
      filePath: filePath
    };

    documentStore.set(fileId, documentInfo);

    // 返回成功响应
    res.json({
      success: true,
      message: 'Word文档上传成功',
      data: {
        fileId: documentInfo.fileId,
        filename: documentInfo.filename,
        content: documentInfo.content,
        wordCount: documentInfo.wordCount,
        uploadTime: documentInfo.uploadTime
      }
    });

  } catch (error) {
    console.error('文档处理错误:', error);
    res.status(500).json({
      success: false,
      message: '文档处理失败: ' + error.message
    });
  }
});

// 获取文档内容
app.get('/get-document/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  const documentInfo = documentStore.get(fileId);

  if (!documentInfo) {
    return res.status(404).json({
      success: false,
      message: '文档未找到'
    });
  }

  res.json({
    success: true,
    data: {
      fileId: documentInfo.fileId,
      filename: documentInfo.filename,
      content: documentInfo.content,
      wordCount: documentInfo.wordCount,
      uploadTime: documentInfo.uploadTime
    }
  });
});

// 获取所有文档列表
app.get('/documents', (req, res) => {
  const documents = Array.from(documentStore.values()).map(doc => ({
    fileId: doc.fileId,
    filename: doc.filename,
    wordCount: doc.wordCount,
    uploadTime: doc.uploadTime
  }));

  res.json({
    success: true,
    data: documents
  });
});

// 删除文档
app.delete('/delete-document/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  const documentInfo = documentStore.get(fileId);

  if (!documentInfo) {
    return res.status(404).json({
      success: false,
      message: '文档未找到'
    });
  }

  try {
    // 删除文件
    await fs.remove(documentInfo.filePath);
    // 从内存中删除记录
    documentStore.delete(fileId);

    res.json({
      success: true,
      message: '文档删除成功'
    });
  } catch (error) {
    console.error('删除文档失败:', error);
    res.status(500).json({
      success: false,
      message: '删除文档失败: ' + error.message
    });
  }
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Word文档上传插件运行正常',
    timestamp: new Date().toISOString()
  });
});

// 法律信息页面
app.get('/legal', (req, res) => {
  res.json({
    service: 'Word文档上传插件',
    version: '1.0.0',
    terms: '本插件仅用于文档处理，用户上传的文档内容不会被永久存储。',
    privacy: '我们不会收集或存储用户的个人信息。',
    contact: 'support@example.com'
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '文件大小超过限制（最大10MB）'
      });
    }
  }

  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Word文档上传插件服务器运行在 http://localhost:${PORT}`);
  console.log(`OpenAPI规范可在 http://localhost:${PORT}/openapi.json 查看`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
});

module.exports = app;
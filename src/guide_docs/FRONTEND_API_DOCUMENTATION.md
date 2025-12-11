# 智慧校园健康 AI 前端开发接口文档

## 📋 目录
- [基本信息](#基本信息)
- [通用说明](#通用说明)
- [HealthAppController 接口](#healthappcontroller-接口)
- [AiController 接口](#aicontroller-接口)
- [数据结构](#数据结构)
- [错误处理](#错误处理)
- [前端集成示例](#前端集成示例)

---

## 基本信息

### 服务器配置
- **Base URL**: `http://localhost:8718`
- **协议**: HTTP/1.1
- **编码**: UTF-8
- **时区**: Asia/Shanghai (东八区)

### API 版本
- **当前版本**: v1.0
- **最后更新**: 2025-12-10

---

## 通用说明

### 请求格式
- **Content-Type**: `application/x-www-form-urlencoded` 或 `application/json`
- **方法**: GET (所有接口)
- **参数传递**: Query String

### 响应格式

#### 标准响应结构 (Result)
```json
{
  "code": 200,
  "message": "success",
  "data": { /* 具体数据 */ }
}
```

#### 字段说明
| 字段 | 类型 | 说明 |
|------|------|------|
| code | Integer | 状态码，200表示成功 |
| message | String | 响应消息 |
| data | Object | 业务数据 |

### 通用参数

#### chatId（会话ID）
- **类型**: String
- **必填**: 是
- **说明**: 用于维护对话上下文，同一用户的多次对话应使用相同的 chatId
- **示例**: 可使用用户ID、UUID或时间戳
- **建议**: `用户ID_时间戳` 格式，如 `U001_1702123456`

---

## HealthAppController 接口

### 基础路径
`/api/health`

---

### 1. 生成基础健康报告

#### 接口信息
- **路径**: `/api/health/report`
- **方法**: GET
- **说明**: 根据用户健康数据生成个性化建议报告（不使用 RAG）

#### 请求参数
| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| uid | String | 是 | 用户ID | S202409000739 |

#### 请求示例
```bash
GET http://localhost:8718/api/health/report?uid=S202409000739
```

#### 响应示例
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "title": "用户S202409000739的健康报告",
    "suggestions": [
      "您的BMI指数正常，请继续保持良好的体重管理",
      "建议增加深度睡眠时间，可以通过规律作息和睡前放松来改善",
      "心率数据正常，继续保持适量运动",
      "建议每天保持8000-10000步的运动量"
    ]
  }
}
```

#### 错误响应
```json
{
  "code": 500,
  "message": "未找到用户健康数据",
  "data": null
}
```

#### 使用场景
- 快速生成健康建议
- 响应速度最快（2-5秒）
- 不需要专业知识库支持

---

### 2. 生成 RAG 健康报告（本地+云端）

#### 接口信息
- **路径**: `/api/health/rag-report`
- **方法**: GET
- **说明**: 结合健康知识库生成更专业的健康建议报告（推荐使用）

#### 请求参数
| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| uid | String | 是 | 用户ID | S202409000739 |
| username | String | 否 | 用户名（默认"用户"） | 张三 |

#### 请求示例
```bash
GET http://localhost:8718/api/health/rag-report?uid=S202409000739&username=张三
```

#### 响应示例
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "title": "张三的健康报告",
    "suggestions": [
      "根据您的BMI为22.5，属于健康体重范围（18.5-23.9），建议维持现状",
      "深度睡眠占比较低（1.2小时/7小时=17%），建议通过以下方式改善：\n  - 睡前1小时避免使用电子设备\n  - 保持卧室温度在18-22℃\n  - 尝试冥想或深呼吸练习",
      "您的静息心率平均72次/分钟，处于正常范围（60-100），说明心血管功能良好",
      "当前步数6000步，建议增加至8000-10000步以达到WHO推荐的运动量"
    ]
  }
}
```

#### 特点
- **检索源**: 本地健康知识库（67个文档）+ 云端知识库
- **响应时间**: 5-10秒
- **专业性**: ⭐⭐⭐⭐⭐
- **适用场景**: 需要详细、专业的健康分析

---

### 3. 生成云端 RAG 健康报告

#### 接口信息
- **路径**: `/api/health/cloud-rag-report`
- **方法**: GET
- **说明**: 仅使用云端知识库生成健康建议报告

#### 请求参数
| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| uid | String | 是 | 用户ID | S202409000739 |
| username | String | 否 | 用户名（默认"用户"） | 李四 |

#### 请求示例
```bash
GET http://localhost:8718/api/health/cloud-rag-report?uid=S202409000739&username=李四
```

#### 响应格式
与 RAG 报告相同

#### 特点
- **检索源**: 仅云端知识库
- **响应时间**: 4-8秒
- **专业性**: ⭐⭐⭐⭐
- **适用场景**: 本地知识库不可用时的备选方案

---

### 4. 测试接口

#### 接口信息
- **路径**: `/api/health/test`
- **方法**: GET
- **说明**: 使用固定测试用户ID进行测试

#### 请求参数
无需参数

#### 请求示例
```bash
GET http://localhost:8718/api/health/test
```

#### 响应示例
与 RAG 报告相同

#### 特点
- 固定测试用户: `S202409000739`
- 自动打印用户健康数据到控制台
- 用于快速验证功能

---

## AiController 接口

### 基础路径
`/ai`

---

### 5. 同步对话接口

#### 接口信息
- **路径**: `/ai/health_app/chat/sync`
- **方法**: GET
- **说明**: 普通同步对话，等待完整响应后返回

#### 请求参数
| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| message | String | 是 | 用户消息 | 如何提高睡眠质量？ |
| chatId | String | 是 | 会话ID | chat_001 |

#### 请求示例
```bash
GET http://localhost:8718/ai/health_app/chat/sync?message=如何提高睡眠质量？&chatId=chat_001
```

#### 响应示例
```
提高睡眠质量可以从以下几个方面入手：

1. 保持规律作息：每天同一时间入睡和起床
2. 优化睡眠环境：保持卧室安静、黑暗、凉爽
3. 睡前放松：尝试冥想、深呼吸或轻度拉伸
4. 避免刺激：睡前避免咖啡因、大量饮水和电子设备
5. 适量运动：白天进行规律运动，但避免睡前剧烈运动

如有持续睡眠问题，建议咨询专业医生。
```

#### 响应格式
- **Content-Type**: `text/plain; charset=UTF-8`
- **返回**: 纯文本字符串

#### 特点
- **响应方式**: 同步阻塞，等待完整响应
- **响应时间**: 3-8秒
- **适用场景**: 简单问答、不需要实时反馈

---

### 6. 流式对话接口（Flux）

#### 接口信息
- **路径**: `/ai/health_app/chat/sse`
- **方法**: GET
- **说明**: 服务器推送事件（SSE），实时流式返回AI响应

#### 请求参数
| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| message | String | 是 | 用户消息 | 介绍健康饮食原则 |
| chatId | String | 是 | 会话ID | chat_002 |

#### 请求示例
```bash
GET http://localhost:8718/ai/health_app/chat/sse?message=介绍健康饮食原则&chatId=chat_002
```

#### 响应示例
```
data: 健康
data: 饮食
data: 的
data: 核心
data: 原则
data: 包括
data: ：
data: \n\n
data: 1.
data:  均衡
data: 摄入
...
```

#### 响应格式
- **Content-Type**: `text/event-stream`
- **格式**: SSE 标准格式
- **编码**: UTF-8

#### 前端接收示例（JavaScript）
```javascript
const eventSource = new EventSource(
  'http://localhost:8718/ai/health_app/chat/sse?message=介绍健康饮食原则&chatId=chat_002'
);

eventSource.onmessage = function(event) {
  console.log('收到数据:', event.data);
  // 将数据逐步追加到页面
  document.getElementById('response').innerHTML += event.data;
};

eventSource.onerror = function(error) {
  console.error('连接错误:', error);
  eventSource.close();
};
```

#### 特点
- **响应方式**: 流式，逐字或逐词返回
- **首字延迟**: 1-2秒
- **适用场景**: 需要实时反馈的聊天界面

---

### 7. 流式对话接口（ServerSentEvent）

#### 接口信息
- **路径**: `/ai/health_app/chat/sse/events`
- **方法**: GET
- **说明**: 返回标准 ServerSentEvent 对象

#### 请求参数
与流式对话（Flux）相同

#### 请求示例
```bash
GET http://localhost:8718/ai/health_app/chat/sse/events?message=运动的好处&chatId=chat_003
```

#### 响应格式
标准 SSE Event 格式，包含完整的事件元数据

#### 前端接收方式
与流式对话（Flux）相同，使用 EventSource API

---

### 8. 流式对话接口（SseEmitter）

#### 接口信息
- **路径**: `/ai/health_app/chat/sse/emitter`
- **方法**: GET
- **说明**: 使用 Spring SseEmitter 实现的流式接口

#### 请求参数
| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| message | String | 是 | 用户消息 | 如何预防感冒 |
| chatId | String | 是 | 会话ID | chat_004 |

#### 请求示例
```bash
GET http://localhost:8718/ai/health_app/chat/sse/emitter?message=如何预防感冒&chatId=chat_004
```

#### 特点
- **超时时间**: 3分钟（180秒）
- **自动重连**: 支持
- **错误处理**: 完整

---

### 9. 高级同步对话（支持开关）

#### 接口信息
- **路径**: `/ai/health_app/chat/advanced`
- **方法**: GET
- **说明**: 支持联网搜索和深度思考的高级对话接口

#### 请求参数
| 参数 | 类型 | 必填 | 默认值 | 说明 | 示例 |
|------|------|------|--------|------|------|
| message | String | 是 | - | 用户消息 | 2024年健康趋势 |
| chatId | String | 是 | - | 会话ID | chat_005 |
| enableWebSearch | Boolean | 否 | false | 是否启用联网搜索 | true |
| enableDeepThinking | Boolean | 否 | false | 是否启用深度思考 | true |

#### 请求示例

**基础对话**:
```bash
GET http://localhost:8718/ai/health_app/chat/advanced?message=健康的重要性&chatId=chat_005
```

**启用联网搜索**:
```bash
GET http://localhost:8718/ai/health_app/chat/advanced?message=2024年最新健康趋势&chatId=chat_005&enableWebSearch=true
```

**启用深度思考**:
```bash
GET http://localhost:8718/ai/health_app/chat/advanced?message=如何平衡工作与健康&chatId=chat_005&enableDeepThinking=true
```

**同时启用**:
```bash
GET http://localhost:8718/ai/health_app/chat/advanced?message=分析当前健康产业发展&chatId=chat_005&enableWebSearch=true&enableDeepThinking=true
```

#### 响应示例

**基础对话**:
```
健康的重要性体现在多个方面：身体健康是幸福生活的基础...
```

**启用深度思考**:
```
请深入思考以下问题，分析多个角度并给出详细的推理过程：
如何平衡工作与健康

从多个维度分析：

1. 时间管理角度
   - 工作时间与休息时间的分配...
   - 具体建议：...

2. 心理健康角度
   - 工作压力对身心的影响...
   - 应对策略：...

3. 生活方式角度
   - 运动、饮食、睡眠的平衡...
   - 实施计划：...
```

#### 功能说明

**联网搜索 (enableWebSearch)**:
- 通过 WebSearchTool 实时获取网络信息
- 使用百度搜索引擎
- 返回前5条相关结果
- 响应时间: +3-5秒

**深度思考 (enableDeepThinking)**:
- 引导 AI 进行多角度深入分析
- 包含详细推理过程
- 提供系统性解决方案
- 响应时间: +5-10秒

#### 响应时间对比
| 模式 | 预计响应时间 |
|------|-------------|
| 基础对话 | 3-5秒 |
| +联网搜索 | 6-10秒 |
| +深度思考 | 8-15秒 |
| 两者同时启用 | 10-20秒 |

---

### 10. 高级流式对话（Flux）

#### 接口信息
- **路径**: `/ai/health_app/chat/advanced/stream`
- **方法**: GET
- **说明**: 流式返回的高级对话

#### 请求参数
与高级同步对话相同

#### 请求示例
```bash
GET http://localhost:8718/ai/health_app/chat/advanced/stream?message=如何科学减肥&chatId=chat_006&enableDeepThinking=true
```

#### 响应格式
- **Content-Type**: `text/event-stream`
- **流式输出**: 逐步返回内容

---

### 11. 高级流式对话（SseEmitter）

#### 接口信息
- **路径**: `/ai/health_app/chat/advanced/emitter`
- **方法**: GET
- **说明**: 使用 SseEmitter 的高级流式对话

#### 请求参数
与高级同步对话相同

#### 请求示例
```bash
GET http://localhost:8718/ai/health_app/chat/advanced/emitter?message=分析健康科技发展&chatId=chat_007&enableWebSearch=true&enableDeepThinking=true
```

#### 特点
- **超时时间**: 3分钟
- **完整功能**: 支持所有高级特性

---

### 12. YuManus 超级智能体

#### 接口信息
- **路径**: `/ai/manus/chat`
- **方法**: GET
- **说明**: 调用 YuManus 超级智能体，支持工具调用

#### 请求参数
| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| message | String | 是 | 用户消息 | 帮我生成一份健康报告PDF |

#### 请求示例
```bash
GET http://localhost:8718/ai/manus/chat?message=帮我生成一份健康报告PDF
```

#### 特点
- **智能体架构**: ReAct（Reasoning + Acting）
- **工具支持**: WebSearchTool, PDFGenerationTool
- **最大步骤数**: 10步
- **自动终止**: 检测任务完成信号

#### 响应格式
流式输出，包含每一步的执行结果：
```
Step 1: 正在分析任务...
Step 2: 调用工具 WebSearchTool，搜索健康报告模板...
Step 3: 调用工具 PDFGenerationTool，生成PDF...
Step 4: 任务完成，PDF已生成
```

---

## 数据结构

### HealthReport（健康报告）

```typescript
interface HealthReport {
  title: string;        // 报告标题
  suggestions: string[]; // 建议列表
}
```

#### 示例
```json
{
  "title": "张三的健康报告",
  "suggestions": [
    "您的BMI指数正常，请继续保持",
    "建议增加深度睡眠时间",
    "心率数据正常，继续保持适量运动",
    "建议每天保持8000-10000步的运动量"
  ]
}
```

### Result（统一响应）

```typescript
interface Result<T> {
  code: number;    // 状态码
  message: string; // 消息
  data: T | null;  // 业务数据
}
```

### UserHealth（用户健康数据）

```typescript
interface UserHealth {
  height: number;              // 身高（cm）
  weight: number;              // 体重（kg）
  bmi: number;                 // BMI指数
  fatPercentage: number;       // 体脂率（%）
  sleepTimeTotal: number;      // 总睡眠时间（小时）
  deepSleepTotal: number;      // 深睡眠时间（小时）
  lightSleepTotal: number;     // 浅睡眠时间（小时）
  meanRestingHeartRate: number;// 平均静息心率
  restingHeartRateMax: number; // 最高静息心率
  restingHeartRateMin: number; // 最低静息心率
  step: number;                // 步数
  walkingTime: number;         // 运动时长（小时）
}
```

---

## 错误处理

### HTTP 状态码
| 状态码 | 说明 | 处理建议 |
|--------|------|---------|
| 200 | 成功 | 正常处理响应数据 |
| 400 | 参数错误 | 检查请求参数是否完整且格式正确 |
| 500 | 服务器错误 | 提示用户稍后重试或联系管理员 |
| 504 | 网关超时 | AI响应超时，建议重新发起请求 |

### 业务错误码
| code | message | 说明 | 处理建议 |
|------|---------|------|---------|
| 200 | success | 成功 | 正常处理 |
| 500 | 未找到用户健康数据 | 用户数据不存在 | 提示用户补充健康数据 |
| 500 | AI 服务暂时不可用 | AI服务异常 | 提示用户稍后重试 |

### 错误响应示例
```json
{
  "code": 500,
  "message": "未找到用户健康数据",
  "data": null
}
```

---

## 前端集成示例

### 1. 获取健康报告（Vue 3 + Axios）

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8718';

// 获取RAG健康报告
async function getHealthReport(uid, username) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health/rag-report`, {
      params: { uid, username }
    });
    
    if (response.data.code === 200) {
      return response.data.data; // HealthReport对象
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('获取健康报告失败:', error);
    throw error;
  }
}

// 使用示例
getHealthReport('S202409000739', '张三')
  .then(report => {
    console.log('报告标题:', report.title);
    console.log('建议列表:', report.suggestions);
  })
  .catch(error => {
    alert('获取报告失败: ' + error.message);
  });
```

### 2. 同步对话（React）

```javascript
import React, { useState } from 'react';
import axios from 'axios';

function ChatComponent() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const result = await axios.get('http://localhost:8718/ai/health_app/chat/sync', {
        params: {
          message: message,
          chatId: 'user_' + Date.now()
        }
      });
      setResponse(result.data);
    } catch (error) {
      alert('发送失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)}
        placeholder="输入您的问题"
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? '发送中...' : '发送'}
      </button>
      <div className="response">{response}</div>
    </div>
  );
}
```

### 3. 流式对话（原生 JavaScript）

```javascript
class StreamChatClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.eventSource = null;
  }

  // 开始流式对话
  startChat(message, chatId, onMessage, onError, onComplete) {
    // 关闭之前的连接
    this.stopChat();

    const url = `${this.baseUrl}/ai/health_app/chat/sse?message=${encodeURIComponent(message)}&chatId=${chatId}`;
    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (event) => {
      onMessage(event.data);
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE连接错误:', error);
      this.stopChat();
      if (onError) onError(error);
    };

    // 监听连接完成
    this.eventSource.addEventListener('complete', () => {
      this.stopChat();
      if (onComplete) onComplete();
    });
  }

  // 停止对话
  stopChat() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

// 使用示例
const chatClient = new StreamChatClient('http://localhost:8718');
const responseDiv = document.getElementById('response');

chatClient.startChat(
  '如何提高睡眠质量',
  'chat_' + Date.now(),
  (chunk) => {
    // 逐步追加内容
    responseDiv.innerHTML += chunk;
  },
  (error) => {
    alert('对话失败');
  },
  () => {
    console.log('对话完成');
  }
);
```

### 4. 高级对话（Vue 3 Composition API）

```vue
<template>
  <div class="advanced-chat">
    <textarea v-model="message" placeholder="输入您的问题"></textarea>
    
    <div class="options">
      <label>
        <input type="checkbox" v-model="enableWebSearch" />
        启用联网搜索
      </label>
      <label>
        <input type="checkbox" v-model="enableDeepThinking" />
        启用深度思考
      </label>
    </div>
    
    <button @click="sendMessage" :disabled="loading">
      {{ loading ? '思考中...' : '发送' }}
    </button>
    
    <div class="response" v-html="response"></div>
    <div class="tips">
      <p v-if="enableWebSearch">⏱️ 联网搜索需要额外 3-5 秒</p>
      <p v-if="enableDeepThinking">⏱️ 深度思考需要额外 5-10 秒</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const message = ref('');
const response = ref('');
const loading = ref(false);
const enableWebSearch = ref(false);
const enableDeepThinking = ref(false);

const chatId = 'user_' + Date.now();

const sendMessage = async () => {
  if (!message.value.trim()) return;
  
  loading.value = true;
  response.value = '';
  
  try {
    const result = await axios.get('http://localhost:8718/ai/health_app/chat/advanced', {
      params: {
        message: message.value,
        chatId: chatId,
        enableWebSearch: enableWebSearch.value,
        enableDeepThinking: enableDeepThinking.value
      }
    });
    response.value = result.data.replace(/\n/g, '<br>');
  } catch (error) {
    response.value = '发送失败: ' + error.message;
  } finally {
    loading.value = false;
  }
};
</script>
```

### 5. 流式高级对话（TypeScript + Fetch）

```typescript
interface ChatOptions {
  message: string;
  chatId: string;
  enableWebSearch?: boolean;
  enableDeepThinking?: boolean;
}

async function streamAdvancedChat(
  options: ChatOptions,
  onChunk: (chunk: string) => void
): Promise<void> {
  const { message, chatId, enableWebSearch = false, enableDeepThinking = false } = options;
  
  const params = new URLSearchParams({
    message,
    chatId,
    enableWebSearch: String(enableWebSearch),
    enableDeepThinking: String(enableDeepThinking)
  });
  
  const response = await fetch(
    `http://localhost:8718/ai/health_app/chat/advanced/stream?${params}`
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  
  if (!reader) throw new Error('无法读取响应流');
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.substring(6);
        onChunk(data);
      }
    }
  }
}

// 使用示例
streamAdvancedChat(
  {
    message: '分析2024年健康科技趋势',
    chatId: 'chat_' + Date.now(),
    enableWebSearch: true,
    enableDeepThinking: true
  },
  (chunk) => {
    document.getElementById('response')!.textContent += chunk;
  }
).catch(console.error);
```

---

## 性能优化建议

### 1. 接口选择建议
| 场景 | 推荐接口 | 原因 |
|------|---------|------|
| 快速健康建议 | `/api/health/report` | 最快，2-5秒 |
| 专业健康分析 | `/api/health/rag-report` | 准确，5-10秒 |
| 简单问答 | `/ai/health_app/chat/sync` | 同步阻塞，简单直接 |
| 实时聊天 | `/ai/health_app/chat/sse` | 流式输出，体验好 |
| 需要联网 | `/ai/health_app/chat/advanced?enableWebSearch=true` | 获取最新信息 |
| 复杂分析 | `/ai/health_app/chat/advanced?enableDeepThinking=true` | 深度思考 |

### 2. 前端优化
- **防抖**: 用户输入时添加 500ms 防抖
- **缓存**: 相同的健康报告查询可以缓存 5分钟
- **加载提示**: 显示预计响应时间
- **超时处理**: 设置 30秒 请求超时
- **错误重试**: 网络错误自动重试 2次

### 3. chatId 管理
```javascript
// 推荐的 chatId 生成策略
function generateChatId(userId) {
  const timestamp = Date.now();
  const sessionId = `${userId}_${timestamp}`;
  return sessionId;
}

// 持久化 chatId（同一对话保持相同ID）
let currentChatId = sessionStorage.getItem('chatId') || generateChatId('user123');
sessionStorage.setItem('chatId', currentChatId);
```

---

## 常见问题 FAQ

### Q1: 如何区分不同的流式接口？
**A**: 三种流式接口功能相同，区别在于实现方式：
- `/sse` - 最简单，直接返回 Flux<String>
- `/sse/events` - 返回标准 ServerSentEvent 对象，包含元数据
- `/sse/emitter` - Spring SseEmitter 实现，支持超时控制

**建议**: 前端使用 EventSource API 时，三者均可，推荐使用 `/sse`

### Q2: 为什么需要 chatId？
**A**: chatId 用于维护对话上下文，AI 会记住同一 chatId 的历史对话（最近20条消息），从而提供连贯的对话体验。

### Q3: 高级对话什么时候启用开关？
**A**: 
- **联网搜索**: 需要实时信息时（天气、新闻、最新研究）
- **深度思考**: 需要详细分析时（复杂问题、战略规划）
- **两者同时**: 需要基于最新信息的深度分析

### Q4: 响应时间太长怎么办？
**A**: 
1. 检查网络连接
2. 选择更快的接口（/report 比 /rag-report 快）
3. 不启用高级功能开关
4. 使用流式接口获得更快的首字响应

### Q5: 如何处理 CORS 跨域问题？
**A**: 后端已配置 CORS，如仍有问题：
```javascript
// 开发环境配置代理（Vue CLI）
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8718',
        changeOrigin: true
      },
      '/ai': {
        target: 'http://localhost:8718',
        changeOrigin: true
      }
    }
  }
}
```

---

## 更新日志

### v1.0 (2025-12-10)
- ✅ 初始版本
- ✅ HealthAppController 4个接口
- ✅ AiController 8个接口
- ✅ 支持同步/流式对话
- ✅ 支持联网搜索和深度思考
- ✅ 完整的前端集成示例

---

## 技术支持

如有问题，请联系技术支持团队或查看：
- [AI 代码审查报告](./AI_CODE_REVIEW.md)
- [修复总结文档](./CRITICAL_FIXES_SUMMARY.md)
- [高级功能文档](./AI_ADVANCED_CHAT_API.md)

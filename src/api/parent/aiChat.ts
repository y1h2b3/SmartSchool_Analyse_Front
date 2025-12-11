import request from '@/utils/request'

/**
 * AI对话接口模块
 * 集成后端AI对话服务
 */

// 基础URL配置
const AI_BASE_URL = '/ai/health_app/chat'
const HEALTH_BASE_URL = '/api/health'

/**
 * 生成唯一的会话ID
 * @param userId 用户ID
 * @returns chatId 格式: userId_timestamp
 */
export function generateChatId(userId: string): string {
  const timestamp = Date.now()
  return `${userId}_${timestamp}`
}

/**
 * 流式对话接口 - 使用EventSource SSE
 * @param message 用户消息
 * @param chatId 会话ID
 * @returns EventSource URL
 */
export function getStreamChatUrl(message: string, chatId: string): string {
  const encodedMessage = encodeURIComponent(message)
  const encodedChatId = encodeURIComponent(chatId)
  return `/api${AI_BASE_URL}/sse?message=${encodedMessage}&chatId=${encodedChatId}`
}

/**
 * 高级流式对话接口
 * @param message 用户消息
 * @param chatId 会话ID
 * @param options 高级选项
 * @returns EventSource URL
 */
export function getAdvancedStreamChatUrl(
  message: string,
  chatId: string,
  options?: {
    enableWebSearch?: boolean
    enableDeepThinking?: boolean
  }
): string {
  const encodedMessage = encodeURIComponent(message)
  const encodedChatId = encodeURIComponent(chatId)
  const webSearch = options?.enableWebSearch ? 'true' : 'false'
  const deepThinking = options?.enableDeepThinking ? 'true' : 'false'
  
  return `/api${AI_BASE_URL}/advanced/stream?message=${encodedMessage}&chatId=${encodedChatId}&enableWebSearch=${webSearch}&enableDeepThinking=${deepThinking}`
}

/**
 * 同步对话接口（备用）
 * @param message 用户消息
 * @param chatId 会话ID
 */
export function syncChat(message: string, chatId: string) {
  return request({
    url: `${AI_BASE_URL}/sync`,
    method: 'get',
    params: {
      message,
      chatId,
    },
  })
}

/**
 * 高级同步对话接口（备用）
 * @param message 用户消息
 * @param chatId 会话ID
 * @param options 高级选项
 */
export function advancedChat(
  message: string,
  chatId: string,
  options?: {
    enableWebSearch?: boolean
    enableDeepThinking?: boolean
  }
) {
  return request({
    url: `${AI_BASE_URL}/advanced`,
    method: 'get',
    params: {
      message,
      chatId,
      enableWebSearch: options?.enableWebSearch || false,
      enableDeepThinking: options?.enableDeepThinking || false,
    },
  })
}

/**
 * 生成RAG健康报告
 * @param uid 用户ID
 * @param username 用户名
 */
export function generateHealthReport(uid: string, username?: string) {
  return request({
    url: `${HEALTH_BASE_URL}/rag-report`,
    method: 'get',
    params: {
      uid,
      username: username || '用户',
    },
  })
}

/**
 * 生成基础健康报告（不使用RAG）
 * @param uid 用户ID
 */
export function generateBasicHealthReport(uid: string) {
  return request({
    url: `${HEALTH_BASE_URL}/report`,
    method: 'get',
    params: {
      uid,
    },
  })
}

/**
 * YuManus超级智能体
 * @param message 用户消息
 */
export function manusChat(message: string) {
  return request({
    url: '/ai/manus/chat',
    method: 'get',
    params: {
      message,
    },
  })
}

/**
 * 健康报告响应数据类型
 */
export interface HealthReportData {
  title: string
  suggestions: string[]
}

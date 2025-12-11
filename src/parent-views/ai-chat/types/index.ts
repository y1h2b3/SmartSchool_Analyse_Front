/**
 * AI对话模块类型定义
 */

/**
 * 会话信息
 */
export interface ChatSession {
  id: string // 会话唯一ID
  title: string // 会话标题
  createdAt: number // 创建时间戳
  updatedAt: number // 更新时间戳
  lastMessage?: string // 最后一条消息预览
  messageCount?: number // 消息数量
}

/**
 * 消息角色
 */
export type MessageRole = 'user' | 'assistant' | 'system'

/**
 * 消息信息
 */
export interface Message {
  id: string // 消息唯一ID
  sessionId: string // 所属会话ID
  role: MessageRole // 消息角色
  content: string // 消息内容
  timestamp: number // 时间戳
  streaming?: boolean // 是否正在流式输出
  error?: boolean // 是否错误消息
}

/**
 * 对话设置
 */
export interface ChatSettings {
  enableWebSearch: boolean // 是否启用联网搜索
  enableDeepThinking: boolean // 是否启用深度思考
  useAdvancedMode: boolean // 是否使用高级模式
  autoScroll: boolean // 是否自动滚动到底部
  showTimestamp: boolean // 是否显示时间戳
  typingSpeed: number // 打字速度（毫秒/字符）
}

/**
 * EventSource 连接状态
 */
export enum ConnectionStatus {
  DISCONNECTED = 'disconnected', // 未连接
  CONNECTING = 'connecting', // 连接中
  CONNECTED = 'connected', // 已连接
  ERROR = 'error', // 错误
}

/**
 * 快捷操作模板
 */
export interface QuickAction {
  id: string
  icon: string
  label: string
  prompt: string
  type?: 'chat' | 'report' // chat-普通对话, report-生成报告
}

/**
 * 流式对话选项
 */
export interface StreamChatOptions {
  message: string
  chatId: string
  enableWebSearch?: boolean
  enableDeepThinking?: boolean
  onMessage?: (chunk: string) => void
  onComplete?: () => void
  onError?: (error: Error) => void
}

/**
 * 消息统计
 */
export interface MessageStats {
  totalSessions: number // 总会话数
  totalMessages: number // 总消息数
  userMessages: number // 用户消息数
  assistantMessages: number // AI消息数
}

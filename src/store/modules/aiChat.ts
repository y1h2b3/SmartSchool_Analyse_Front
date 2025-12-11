import { defineStore } from 'pinia'
import type { ChatSession, Message, ChatSettings, MessageStats } from '@/parent-views/ai-chat/types'

/**
 * AI对话状态管理
 */
interface AiChatState {
  sessions: ChatSession[] // 会话列表
  currentSessionId: string | null // 当前选中的会话ID
  messagesBySession: Record<string, Message[]> // 按会话ID分组的消息
  isStreaming: boolean // 是否正在流式输出
  settings: ChatSettings // 对话设置
}

export const useAiChatStore = defineStore({
  id: 'aiChatState',
  
  state: (): AiChatState => ({
    sessions: [],
    currentSessionId: null,
    messagesBySession: {},
    isStreaming: false,
    settings: {
      enableWebSearch: false,
      enableDeepThinking: false,
      useAdvancedMode: false,
      autoScroll: true,
      showTimestamp: true,
      typingSpeed: 30, // 30ms每字符
    },
  }),

  getters: {
    /**
     * 获取当前会话
     */
    currentSession: (state): ChatSession | null => {
      if (!state.currentSessionId) return null
      return state.sessions.find(s => s.id === state.currentSessionId) || null
    },

    /**
     * 获取当前会话的消息列表
     */
    currentMessages: (state): Message[] => {
      if (!state.currentSessionId) return []
      return state.messagesBySession[state.currentSessionId] || []
    },

    /**
     * 获取会话数量统计
     */
    sessionStats: (state): MessageStats => {
      const totalSessions = state.sessions.length
      let totalMessages = 0
      let userMessages = 0
      let assistantMessages = 0

      Object.values(state.messagesBySession).forEach(messages => {
        totalMessages += messages.length
        messages.forEach(msg => {
          if (msg.role === 'user') userMessages++
          else if (msg.role === 'assistant') assistantMessages++
        })
      })

      return {
        totalSessions,
        totalMessages,
        userMessages,
        assistantMessages,
      }
    },

    /**
     * 按时间排序的会话列表
     */
    sortedSessions: (state): ChatSession[] => {
      return [...state.sessions].sort((a, b) => b.updatedAt - a.updatedAt)
    },
  },

  actions: {
    /**
     * 创建新会话
     */
    createSession(title: string = '新对话'): ChatSession {
      const now = Date.now()
      const session: ChatSession = {
        id: `session_${now}_${Math.random().toString(36).substring(7)}`,
        title,
        createdAt: now,
        updatedAt: now,
        messageCount: 0,
      }
      
      this.sessions.push(session)
      this.messagesBySession[session.id] = []
      this.currentSessionId = session.id
      
      return session
    },

    /**
     * 删除会话
     */
    deleteSession(sessionId: string): void {
      const index = this.sessions.findIndex(s => s.id === sessionId)
      if (index > -1) {
        this.sessions.splice(index, 1)
        delete this.messagesBySession[sessionId]
        
        // 如果删除的是当前会话，切换到第一个会话
        if (this.currentSessionId === sessionId) {
          this.currentSessionId = this.sessions.length > 0 ? this.sessions[0].id : null
        }
      }
    },

    /**
     * 切换会话
     */
    switchSession(sessionId: string): void {
      const session = this.sessions.find(s => s.id === sessionId)
      if (session) {
        this.currentSessionId = sessionId
      }
    },

    /**
     * 更新会话标题
     */
    updateSessionTitle(sessionId: string, title: string): void {
      const session = this.sessions.find(s => s.id === sessionId)
      if (session) {
        session.title = title
        session.updatedAt = Date.now()
      }
    },

    /**
     * 添加消息
     */
    addMessage(sessionId: string, message: Omit<Message, 'id' | 'timestamp' | 'sessionId'>): Message {
      const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        sessionId,
        timestamp: Date.now(),
        ...message,
      }

      if (!this.messagesBySession[sessionId]) {
        this.messagesBySession[sessionId] = []
      }

      this.messagesBySession[sessionId].push(newMessage)

      // 更新会话信息
      const session = this.sessions.find(s => s.id === sessionId)
      if (session) {
        session.updatedAt = Date.now()
        session.lastMessage = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
        session.messageCount = (session.messageCount || 0) + 1
      }

      return newMessage
    },

    /**
     * 更新流式消息内容
     */
    updateStreamingMessage(sessionId: string, messageId: string, content: string): void {
      const messages = this.messagesBySession[sessionId]
      if (messages) {
        const message = messages.find(m => m.id === messageId)
        if (message) {
          message.content = content
        }
      }
    },

    /**
     * 完成流式消息
     */
    completeStreamingMessage(sessionId: string, messageId: string): void {
      const messages = this.messagesBySession[sessionId]
      if (messages) {
        const message = messages.find(m => m.id === messageId)
        if (message) {
          message.streaming = false
          
          // 更新会话最后消息
          const session = this.sessions.find(s => s.id === sessionId)
          if (session) {
            session.lastMessage = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
            session.updatedAt = Date.now()
          }
        }
      }
    },

    /**
     * 删除消息
     */
    deleteMessage(sessionId: string, messageId: string): void {
      const messages = this.messagesBySession[sessionId]
      if (messages) {
        const index = messages.findIndex(m => m.id === messageId)
        if (index > -1) {
          messages.splice(index, 1)
          
          // 更新会话消息计数
          const session = this.sessions.find(s => s.id === sessionId)
          if (session && session.messageCount) {
            session.messageCount--
          }
        }
      }
    },

    /**
     * 清空会话消息
     */
    clearMessages(sessionId: string): void {
      this.messagesBySession[sessionId] = []
      
      const session = this.sessions.find(s => s.id === sessionId)
      if (session) {
        session.lastMessage = undefined
        session.messageCount = 0
        session.updatedAt = Date.now()
      }
    },

    /**
     * 设置流式状态
     */
    setStreaming(isStreaming: boolean): void {
      this.isStreaming = isStreaming
    },

    /**
     * 更新设置
     */
    updateSettings(settings: Partial<ChatSettings>): void {
      this.settings = { ...this.settings, ...settings }
    },

    /**
     * 重置设置为默认值
     */
    resetSettings(): void {
      this.settings = {
        enableWebSearch: false,
        enableDeepThinking: false,
        useAdvancedMode: false,
        autoScroll: true,
        showTimestamp: true,
        typingSpeed: 30,
      }
    },

    /**
     * 清空所有数据
     */
    clearAll(): void {
      this.sessions = []
      this.currentSessionId = null
      this.messagesBySession = {}
      this.isStreaming = false
    },
  },

  // 持久化配置
  persist: {
    storage: {
      getItem(key): string {
        return localStorage.getItem(key)
      },
      setItem(key, value): void {
        localStorage.setItem(key, value)
      },
    },
  },
})

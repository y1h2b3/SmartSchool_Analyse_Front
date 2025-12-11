import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useAiChatStore } from '@/store/modules/aiChat'
import { useUserStore } from '@/store/modules/user'
import { useStreamChat } from './useStreamChat'
import { generateChatId, generateHealthReport } from '@/api/parent/aiChat'
import type { QuickAction } from '../types'

/**
 * AI对话业务Hook
 */
export function useAIChat() {
  const chatStore = useAiChatStore()
  const userStore = useUserStore()
  const { startStream, stopStream } = useStreamChat()

  // 快捷操作模板
  const quickActions: QuickAction[] = [
    {
      id: 'sleep',
      icon: 'Moon',
      label: '如何提高睡眠质量',
      prompt: '如何提高睡眠质量？请给我一些实用的建议。',
      type: 'chat',
    },
    {
      id: 'exercise',
      icon: 'Bicycle',
      label: '运动的好处',
      prompt: '运动的好处有哪些？请详细说明。',
      type: 'chat',
    },
    {
      id: 'diet',
      icon: 'Coffee',
      label: '健康饮食建议',
      prompt: '请给我一些健康饮食的建议。',
      type: 'chat',
    },
    {
      id: 'stress',
      icon: 'Sunny',
      label: '压力管理方法',
      prompt: '如何有效管理压力？请提供一些方法。',
      type: 'chat',
    },
    {
      id: 'report',
      icon: 'Document',
      label: '生成健康报告',
      prompt: '帮我生成一份健康报告',
      type: 'report',
    },
  ]

  /**
   * 发送消息
   */
  const sendMessage = async (messageText: string): Promise<void> => {
    if (!messageText.trim()) {
      ElMessage.warning('请输入消息内容')
      return
    }

    // 确保有当前会话
    let currentSessionId = chatStore.currentSessionId
    if (!currentSessionId) {
      const session = chatStore.createSession()
      currentSessionId = session.id
    }

    // 添加用户消息
    const userMessage = chatStore.addMessage(currentSessionId, {
      role: 'user',
      content: messageText.trim(),
    })

    // 如果是该会话的第一条用户消息，并且标题还是默认“新对话”，则用问题内容更新标题
    const currentMessages = chatStore.messagesBySession[currentSessionId] || []
    const userMessageCount = currentMessages.filter(m => m.role === 'user').length
    const session = chatStore.sessions.find(s => s.id === currentSessionId)
    
    if (session && userMessageCount === 1 && session.title === '新对话') {
      chatStore.updateSessionTitle(session.id, userMessage.content.substring(0, 50))
    }

    // 创建AI消息占位，初始显示"正在思考中..."
    const aiMessage = chatStore.addMessage(currentSessionId, {
      role: 'assistant',
      content: '正在思考中...',
      streaming: true,
    })

    // 设置流式状态
    chatStore.setStreaming(true)

    try {
      // 生成chatId
      const chatId = generateChatId(userStore.userInfo?.id || 'guest')
      
      // 获取设置
      const settings = chatStore.settings
      
      // 启动流式对话
      startStream(messageText, chatId, {
        enableWebSearch: settings.useAdvancedMode && settings.enableWebSearch,
        enableDeepThinking: settings.useAdvancedMode && settings.enableDeepThinking,
        enableMcp: settings.useAdvancedMode && settings.enableMcp,
        
        // 接收流式数据
        onChunk: (chunk: string) => {
          // 第一次收到数据时，替换掉"正在思考中..."
          const currentContent = aiMessage.content === '正在思考中...' ? '' : aiMessage.content
          chatStore.updateStreamingMessage(currentSessionId, aiMessage.id, currentContent + chunk)
        },
        
        // 流式完成
        onComplete: () => {
          chatStore.completeStreamingMessage(currentSessionId, aiMessage.id)
          chatStore.setStreaming(false)
        },
        
        // 错误处理
        onError: (error: Error) => {
          console.error('流式对话错误:', error)
          chatStore.updateStreamingMessage(currentSessionId, aiMessage.id, '抱歉，发生了错误，请稍后重试。')
          chatStore.completeStreamingMessage(currentSessionId, aiMessage.id)
          chatStore.setStreaming(false)
          ElMessage.error('消息发送失败')
        },
      })

    } catch (error) {
      console.error('发送消息失败:', error)
      chatStore.setStreaming(false)
      ElMessage.error('消息发送失败')
    }
  }

  /**
   * 处理快捷操作
   */
  const handleQuickAction = async (action: QuickAction): Promise<void> => {
    if (action.type === 'report') {
      // 生成健康报告
      await generateReport()
    } else {
      // 发送快捷消息
      await sendMessage(action.prompt)
    }
  }

  /**
   * 生成健康报告
   */
  const generateReport = async (): Promise<void> => {
    // 调试信息：输出当前登录状态
    console.log('[健康报告] 登录状态检查:', {
      hasToken: !!userStore.token,
      token: userStore.token,
      userInfo: userStore.userInfo,
      userInfoKeys: Object.keys(userStore.userInfo || {}),
      userId: userStore.userInfo?.id,
    })
    
    // 检查登录状态：同时检查 token 和 userInfo
    if (!userStore.token || !userStore.userInfo || Object.keys(userStore.userInfo).length === 0) {
      console.warn('[健康报告] 登录验证失败')
      ElMessage.warning('请先登录')
      return
    }

    // 家长端用户ID字段是 studentId，不是 id
    const userId = userStore.userInfo?.studentId || userStore.userInfo?.id || 'unknown'
    const userName = userStore.userInfo?.username || userStore.userInfo?.name || '用户'

    // 确保有当前会话
    let currentSessionId = chatStore.currentSessionId
    if (!currentSessionId) {
      const session = chatStore.createSession('健康报告')
      currentSessionId = session.id
    }

    // 添加用户消息
    chatStore.addMessage(currentSessionId, {
      role: 'user',
      content: '生成我的健康报告',
    })

    // 添加AI「正在生成」占位消息
    const loadingMessage = chatStore.addMessage(currentSessionId, {
      role: 'assistant',
      content: '正在生成健康报告，请稍候...',
      streaming: true,
    })
    chatStore.setStreaming(true)

    try {
      const reportData = await generateHealthReport(userId, userName)

      // 构建报告内容（去掉"家长"两字）
      const cleanTitle = reportData.title.replace('家长', '')
      let reportContent = `# ${cleanTitle}\n\n`
      reportData.suggestions.forEach((suggestion: string, index: number) => {
        reportContent += `${index + 1}. ${suggestion}\n\n`
      })

      // 更新AI消息为最终报告
      chatStore.updateStreamingMessage(currentSessionId, loadingMessage.id, reportContent)
      chatStore.completeStreamingMessage(currentSessionId, loadingMessage.id)
      chatStore.setStreaming(false)

      ElMessage.success('健康报告生成成功')
    } catch (error) {
      console.error('生成健康报告失败:', error)
      // 更新为错误提示
      chatStore.updateStreamingMessage(currentSessionId, loadingMessage.id, '生成健康报告失败，请稍后重试。')
      chatStore.completeStreamingMessage(currentSessionId, loadingMessage.id)
      chatStore.setStreaming(false)
      ElMessage.error('生成健康报告失败，请稍后重试')
    }
  }

  /**
   * 停止当前流式输出
   */
  const stopCurrentStream = (): void => {
    stopStream()
    chatStore.setStreaming(false)
  }

  /**
   * 创建新会话
   */
  const createNewSession = (title?: string): void => {
    chatStore.createSession(title)
    ElMessage.success('已创建新会话')
  }

  /**
   * 删除会话
   */
  const removeSession = (sessionId: string): void => {
    const session = chatStore.sessions.find(s => s.id === sessionId)
    if (session) {
      chatStore.deleteSession(sessionId)
      ElMessage.success(`已删除会话: ${session.title}`)
    }
  }

  /**
   * 切换会话
   */
  const switchToSession = (sessionId: string): void => {
    chatStore.switchSession(sessionId)
  }

  /**
   * 清空当前会话消息
   */
  const clearCurrentMessages = (): void => {
    if (chatStore.currentSessionId) {
      chatStore.clearMessages(chatStore.currentSessionId)
      ElMessage.success('已清空消息')
    }
  }

  /**
   * 计算属性
   */
  const currentSession = computed(() => chatStore.currentSession)
  const currentMessages = computed(() => chatStore.currentMessages)
  const sessions = computed(() => chatStore.sortedSessions)
  const isStreaming = computed(() => chatStore.isStreaming)
  const settings = computed(() => chatStore.settings)

  return {
    // 数据
    quickActions,
    currentSession,
    currentMessages,
    sessions,
    isStreaming,
    settings,
    
    // 方法
    sendMessage,
    handleQuickAction,
    generateReport,
    stopCurrentStream,
    createNewSession,
    removeSession,
    switchToSession,
    clearCurrentMessages,
  }
}

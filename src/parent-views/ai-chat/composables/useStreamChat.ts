import { ref, onBeforeUnmount } from 'vue'
import { getStreamChatUrl, getAdvancedStreamChatUrl } from '@/api/parent/aiChat'
import { ConnectionStatus } from '../types'

/**
 * 流式对话Hook
 */
export function useStreamChat() {
  const eventSource = ref<EventSource | null>(null)
  const abortController = ref<AbortController | null>(null)
  const connectionStatus = ref<ConnectionStatus>(ConnectionStatus.DISCONNECTED)
  const currentContent = ref<string>('')
  const error = ref<Error | null>(null)

  /**
   * 开始流式对话 - 使用 fetch + TextDecoder 解决编码问题
   */
  const startStream = async (
    message: string,
    chatId: string,
    options?: {
      enableWebSearch?: boolean
      enableDeepThinking?: boolean
      onChunk?: (chunk: string) => void
      onComplete?: () => void
      onError?: (err: Error) => void
    }
  ) => {
    // 关闭之前的连接
    stopStream()

    try {
      connectionStatus.value = ConnectionStatus.CONNECTING
      currentContent.value = ''
      error.value = null

      // 根据选项选择URL
      const url = options?.enableWebSearch || options?.enableDeepThinking
        ? getAdvancedStreamChatUrl(message, chatId, {
            enableWebSearch: options.enableWebSearch,
            enableDeepThinking: options.enableDeepThinking,
          })
        : getStreamChatUrl(message, chatId)

      // 创建 AbortController 用于取消请求
      abortController.value = new AbortController()

      // 使用 fetch 替代 EventSource
      const response = await fetch(url, {
        signal: abortController.value.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('响应体为空')
      }

      connectionStatus.value = ConnectionStatus.CONNECTED
      console.log('流式连接已建立')

      // 使用 TextDecoder 解码 UTF-8
      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          console.log('流式响应完成')
          options?.onComplete?.()
          break
        }

        // 解码数据
        buffer += decoder.decode(value, { stream: true })
        
        // 处理 SSE 格式
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // 保留最后不完整的行

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const chunk = line.substring(5).trim()
            if (chunk) {
              currentContent.value += chunk
              options?.onChunk?.(chunk)
            }
          }
        }
      }

    } catch (err: any) {
      // 如果是主动取消，不认为是错误
      if (err.name === 'AbortError') {
        console.log('流式请求已取消')
        return
      }
      
      console.error('流式对话错误:', err)
      connectionStatus.value = ConnectionStatus.ERROR
      error.value = err as Error
      options?.onError?.(err as Error)
    } finally {
      abortController.value = null
    }
  }

  /**
   * 停止流式对话
   */
  const stopStream = () => {
    // 取消 fetch 请求
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
    
    // 关闭 EventSource（如果有）
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
    
    if (connectionStatus.value === ConnectionStatus.CONNECTING || 
        connectionStatus.value === ConnectionStatus.CONNECTED) {
      connectionStatus.value = ConnectionStatus.DISCONNECTED
    }
  }

  /**
   * 重置状态
   */
  const resetStream = () => {
    stopStream()
    currentContent.value = ''
    error.value = null
    connectionStatus.value = ConnectionStatus.DISCONNECTED
  }

  /**
   * 组件卸载前清理
   */
  onBeforeUnmount(() => {
    stopStream()
  })

  return {
    eventSource,
    connectionStatus,
    currentContent,
    error,
    startStream,
    stopStream,
    resetStream,
  }
}

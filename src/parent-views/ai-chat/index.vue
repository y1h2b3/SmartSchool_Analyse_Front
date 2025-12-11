<template>
  <div class="ai-chat-container">
    <!-- 左侧会话列表 -->
    <div class="session-list" :class="{ collapsed: isMobile && !showSessionList }">
      <div class="session-header">
        <h3>对话列表</h3>
        <!-- 注意：必须显式调用 createNewSession()，避免事件对象作为标题传入导致标题为 [object PointerEvent] -->
        <el-button type="primary" :icon="Plus" size="small" @click="createNewSession()">
          新建对话
        </el-button>
      </div>
      
      <el-scrollbar class="session-scroll">
        <div 
          v-for="session in sessions" 
          :key="session.id"
          class="session-item"
          :class="{ active: session.id === currentSession?.id }"
          @click="switchToSession(session.id)"
        >
          <div class="session-content">
            <div class="session-title">{{ session.title }}</div>
            <div class="session-preview">{{ session.lastMessage || '暂无消息' }}</div>
          </div>
          <el-button 
            type="danger" 
            :icon="Delete" 
            size="small" 
            circle 
            @click.stop="handleDeleteSession(session.id)"
          />
        </div>
      </el-scrollbar>
    </div>

    <!-- 右侧对话区域 -->
    <div class="chat-area">
      <!-- 顶部标题栏 -->
      <div class="chat-header">
        <h3>{{ currentSession?.title || '请选择或创建对话' }}</h3>
      </div>

      <!-- 消息列表 -->
      <el-scrollbar ref="scrollbarRef" class="message-list">
        <div v-if="!currentSession || currentMessages.length === 0" class="empty-state">
          <el-empty description="暂无消息，开始对话吧！">
            <div class="quick-actions">
              <el-button 
                v-for="action in quickActions.slice(0, 4)" 
                :key="action.id"
                @click="handleQuickAction(action)"
              >
                <el-icon><component :is="action.icon" /></el-icon>
                {{ action.label }}
              </el-button>
            </div>
          </el-empty>
        </div>

        <div v-else class="messages">
          <div 
            v-for="message in currentMessages" 
            :key="message.id"
            class="message-item"
            :class="message.role"
          >
            <div class="message-avatar">
              <el-icon v-if="message.role === 'user'"><User /></el-icon>
              <el-icon v-else><ChatLineRound /></el-icon>
            </div>
            <div class="message-content">
              <div class="message-text" v-html="renderMarkdown(message.content)"></div>
            </div>
            <span v-if="message.role === 'user'" class="message-time-tag">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>
      </el-scrollbar>

      <!-- 输入框 -->
      <div class="input-area">
        <div class="quick-actions-bar">
          <el-button 
            v-for="action in quickActions" 
            :key="action.id"
            size="small"
            @click="handleQuickAction(action)"
          >
            <el-icon><component :is="action.icon" /></el-icon>
            {{ action.label }}
          </el-button>
        </div>
        <div class="input-box">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="3"
            placeholder="输入您的健康问题..."
            :disabled="isStreaming"
            @keydown.enter.ctrl="handleSend"
          />
          <div class="input-actions">
            <div class="left-controls">
              <el-switch 
                v-model="settings.useAdvancedMode"
                @change="handleSettingsChange"
                active-text="高级"
                size="small"
              />
              <el-button 
                v-if="settings.useAdvancedMode"
                :type="settings.enableWebSearch ? 'primary' : ''"
                size="small"
                @click="toggleWebSearch"
                circle
                title="联网搜索"
              >
                <el-icon><Search /></el-icon>
              </el-button>
              <el-button 
                v-if="settings.useAdvancedMode"
                :type="settings.enableDeepThinking ? 'primary' : ''"
                size="small"
                @click="toggleDeepThinking"
                circle
                title="深度思考"
              >
                <el-icon><TrendCharts /></el-icon>
              </el-button>
            </div>
            <div class="right-controls">
              <span class="tip">Ctrl + Enter 发送</span>
              <el-button 
                v-if="isStreaming"
                type="danger"
                size="small"
                @click="stopCurrentStream"
              >
                停止
              </el-button>
              <el-button 
                v-else
                type="primary"
                :icon="Promotion"
                size="small"
                @click="handleSend"
                :disabled="!inputMessage.trim()"
              >
                发送
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { Plus, Delete, User, Search, TrendCharts, Promotion, ChatLineRound } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useAIChat } from './composables/useAIChat'
import { useAiChatStore } from '@/store/modules/aiChat'

const chatStore = useAiChatStore()
const {
  quickActions,
  currentSession,
  currentMessages,
  sessions,
  isStreaming,
  settings,
  sendMessage,
  handleQuickAction,
  createNewSession,
  removeSession,
  switchToSession,
  stopCurrentStream,
} = useAIChat()

const inputMessage = ref('')
const scrollbarRef = ref()
const isMobile = ref(window.innerWidth < 768)
const showSessionList = ref(true)

// 发送消息
const handleSend = async () => {
  if (!inputMessage.value.trim() || isStreaming.value) return
  
  const message = inputMessage.value
  inputMessage.value = ''
  
  await sendMessage(message)
  await nextTick()
  scrollToBottom()
}

// 删除会话
const handleDeleteSession = (sessionId: string) => {
  ElMessageBox.confirm('确定要删除这个会话吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    removeSession(sessionId)
  }).catch(() => {})
}

// 切换设置
const handleSettingsChange = () => {
  chatStore.updateSettings(settings.value)
}

const toggleWebSearch = () => {
  chatStore.updateSettings({ enableWebSearch: !settings.value.enableWebSearch })
}

const toggleDeepThinking = () => {
  chatStore.updateSettings({ enableDeepThinking: !settings.value.enableDeepThinking })
}

// 滚动到底部
const scrollToBottom = () => {
  if (scrollbarRef.value) {
    nextTick(() => {
      nextTick(() => {
        // 使用足够大的数值确保滚动到底部
        scrollbarRef.value?.setScrollTop(999999)
      })
    })
  }
}

// 监听消息变化，自动滚动
watch(() => currentMessages.value, () => {
  if (settings.value.autoScroll) {
    nextTick(() => scrollToBottom())
  }
}, { deep: true })

// 增强的Markdown渲染
const renderMarkdown = (text: string) => {
  let html = text
  
  // 1. 代码块 (必须先处理，避免内部被转换)
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
  
  // 2. 标题 (从小到大)
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  
  // 3. 粗体和斜体 (粗体先)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  
  // 4. 行内代码
  html = html.replace(/`(.+?)`/g, '<code>$1</code>')
  
  // 5. 链接
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
  
  // 6. 列表 (先标记列表项)
  // 无序列表
  html = html.replace(/^[\s]*[-*+]\s+(.+)$/gm, '___UL___<li>$1</li>')
  // 有序列表
  html = html.replace(/^[\s]*\d+\.\s+(.+)$/gm, '___OL___<li>$1</li>')
  
  // 包装列表
  html = html.replace(/(___UL___<li>[\s\S]*?<\/li>)(?!___UL___)/g, '<ul>$1</ul>')
  html = html.replace(/(___OL___<li>[\s\S]*?<\/li>)(?!___OL___)/g, '<ol>$1</ol>')
  
  // 清理列表标记
  html = html.replace(/___UL___/g, '')
  html = html.replace(/___OL___/g, '')
  
  // 7. 段落和换行
  html = html.replace(/\n\n/g, '</p><p>')
  html = html.replace(/\n/g, '<br>')
  html = '<p>' + html + '</p>'
  
  // 8. 清理空段落和多余br
  html = html.replace(/<p><\/p>/g, '')
  html = html.replace(/<p><br><\/p>/g, '')
  html = html.replace(/<br><\/p>/g, '</p>')
  html = html.replace(/<p><br>/g, '<p>')
  
  // 9. 修复列表外的段落标签
  html = html.replace(/<p>(<ul>|<ol>|<h[1-3]>|<pre>)/g, '$1')
  html = html.replace(/(<\/ul>|<\/ol>|<\/h[1-3]>|<\/pre>)<\/p>/g, '$1')
  
  return html
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 初始化：如果没有会话则创建一个
if (sessions.value.length === 0) {
  createNewSession('我的第一个对话')
}
</script>

<style scoped lang="scss">
.ai-chat-container {
  display: flex;
  height: calc(100vh - 120px); // 固定高度，减去顶部导航栏高度
  max-height: 900px;
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
}

.session-list {
  width: 225px;
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;

  &.collapsed {
    width: 0;
    opacity: 0;
  }
}

.session-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
  }
  
  .el-button {
    font-size: 12px;
  }
}

.session-scroll {
  flex: 1;
}

.session-item {
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background: #f5f7fa;
    
    .el-button {
      opacity: 1;
    }
  }

  &.active {
    background: #ecf5ff;
    border-left: 3px solid #409eff;
  }
  
  .el-button {
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  &.active .el-button {
    opacity: 1;
  }
}

.session-content {
  flex: 1;
  overflow: hidden;
}

.session-title {
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: #303133;
}

.session-preview {
  font-size: 11px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafafa;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }
}

.message-list {
  flex: 1;
  padding: 16px;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
    
    .el-button {
      border-radius: 20px;
      padding: 10px 20px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-item {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  
  &.user {
    flex-direction: row-reverse;
    
    .message-content {
      background: linear-gradient(135deg, #409eff 0%, #3a8ee6 100%);
      color: white;
      box-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
      
      // 用户消息中的Markdown样式调整
      :deep(code) {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }
      
      :deep(pre) {
        background: rgba(0, 0, 0, 0.2);
      }
      
      :deep(a) {
        color: #e1f0ff;
      }
      
      :deep(h1), :deep(h2) {
        border-bottom-color: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

.message-time-tag {
  font-size: 11px;
  color: #909399;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
  align-self: flex-end;
  margin-bottom: 4px;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  flex-shrink: 0;
  
  .el-icon {
    font-size: 18px;
    color: #606266;
  }
}

.message-content {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  background: #f0f0f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  // AI消息中Markdown样式
  :deep(pre) {
    background: #e8eaed;
    
    code {
      color: #333;
    }
  }
  
  :deep(h1), :deep(h2) {
    border-bottom-color: #ddd;
  }
}

.message-text {
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap; // 保留换行符并自动换行
  
  // Markdown 样式
  :deep(h1) {
    font-size: 1.8em;
    font-weight: bold;
    margin: 16px 0 8px;
    border-bottom: 2px solid #ddd;
    padding-bottom: 8px;
  }
  
  :deep(h2) {
    font-size: 1.5em;
    font-weight: bold;
    margin: 14px 0 7px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 6px;
  }
  
  :deep(h3) {
    font-size: 1.3em;
    font-weight: bold;
    margin: 12px 0 6px;
  }
  
  :deep(p) {
    margin: 8px 0;
    white-space: pre-wrap;
  }
  
  :deep(ul) {
    margin: 8px 0;
    padding-left: 24px;
    list-style-type: disc;
  }
  
  :deep(ol) {
    margin: 8px 0;
    padding-left: 24px;
    list-style-type: decimal;
  }
  
  :deep(li) {
    margin: 4px 0;
    line-height: 1.6;
    white-space: pre-wrap;
  }
  
  :deep(code) {
    padding: 2px 6px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    font-family: 'Courier New', Consolas, monospace;
    font-size: 0.9em;
  }
  
  :deep(pre) {
    background: #f6f8fa;
    border-radius: 6px;
    padding: 12px;
    margin: 12px 0;
    overflow-x: auto;
    
    code {
      background: transparent;
      padding: 0;
      font-size: 0.9em;
      line-height: 1.5;
    }
  }
  
  :deep(a) {
    color: #409eff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  :deep(strong) {
    font-weight: bold;
  }
  
  :deep(em) {
    font-style: italic;
  }
  
  :deep(br) {
    display: block;
    content: '';
    margin: 4px 0;
  }
}


.input-area {
  border-top: 1px solid #e4e7ed;
  background: white;
}

.quick-actions-bar {
  padding: 8px 16px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  
  .el-button {
    padding: 6px 12px;
    font-size: 12px;
    border-radius: 16px;
    
    &:hover {
      background: #ecf5ff;
      color: #409eff;
    }
  }
}

.input-box {
  padding: 8px 16px 16px;
  
  .el-textarea {
    :deep(.el-textarea__inner) {
      border-radius: 8px;
      border: 1px solid #dcdfe6;
      transition: all 0.2s;
      
      &:focus {
        border-color: #409eff;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
      }
    }
  }
}

.input-actions {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  
  .tip {
    font-size: 10px;
    color: #909399;
  }
  
  .left-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .right-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .session-list {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 10;
    width: 280px;
  }
  
  .input-actions {
    flex-direction: column;
    gap: 8px;
    
    .left-controls,
    .right-controls {
      width: 100%;
      justify-content: space-between;
    }
  }
  
  .quick-actions-bar {
    .el-button {
      flex: 1;
      min-width: 0;
    }
  }
}
</style>

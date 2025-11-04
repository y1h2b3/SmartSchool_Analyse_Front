<template>
  <div class="location-test-container">
    <div class="test-header">
      <h1>🧭 定位功能测试页面</h1>
      <p class="subtitle">测试 GPS 和 IP 混合定位方案</p>
    </div>

    <div class="test-content">
      <!-- 控制按钮 -->
      <div class="button-group">
        <el-button type="primary" @click="handleGetLocation" :loading="isLocating">
          {{ isLocating ? '定位中...' : '获取定位' }}
        </el-button>
        <el-button @click="handleResetLocation" :disabled="isLocating">
          重置定位
        </el-button>
        <el-button type="info" @click="handleGetGPSOnly" :loading="isLocatingGPS">
          仅 GPS 定位
        </el-button>
        <el-button type="success" @click="handleGetAmapOnly" :loading="isLocatingAmap">
          仅高德定位
        </el-button>
        <el-button type="info" @click="handleGetIPOnly" :loading="isLocatingIP">
          仅 IP 定位
        </el-button>
      </div>

      <!-- 结果显示 -->
      <div class="results-container">
        <!-- 定位状态 -->
        <div class="status-box">
          <h3>📍 定位状态</h3>
          <div class="status-content">
            <div class="status-item">
              <span class="label">定位状态：</span>
              <span v-if="isLocating" class="status-text loading">定位中...</span>
              <span v-else-if="locationData" class="status-text success">✅ 定位成功</span>
              <span v-else class="status-text">未定位</span>
            </div>
            <div class="status-item">
              <span class="label">定位源：</span>
              <el-tag v-if="locationData" :type="getSourceType(locationData.source)">
                {{ getSourceName(locationData.source) }}
              </el-tag>
              <span v-else class="text-muted">-</span>
            </div>
          </div>
        </div>

        <!-- 定位信息 -->
        <div v-if="locationData" class="info-box">
          <h3>📊 定位信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">纬度：</span>
              <span class="value">{{ locationData.latitude }}</span>
            </div>
            <div class="info-item">
              <span class="label">经度：</span>
              <span class="value">{{ locationData.longitude }}</span>
            </div>
            <div v-if="locationData.accuracy" class="info-item">
              <span class="label">精度：</span>
              <span class="value">±{{ locationData.accuracy.toFixed(2) }} 米</span>
            </div>
            <div v-if="locationData.city" class="info-item">
              <span class="label">城市：</span>
              <span class="value">{{ locationData.city }}</span>
            </div>
            <div v-if="locationData.province" class="info-item">
              <span class="label">省份：</span>
              <span class="value">{{ locationData.province }}</span>
            </div>
            <div v-if="locationData.country" class="info-item">
              <span class="label">国家：</span>
              <span class="value">{{ locationData.country }}</span>
            </div>
            <div v-if="locationData.district" class="info-item">
              <span class="label">区县：</span>
              <span class="value">{{ locationData.district }}</span>
            </div>
            <div v-if="locationData.address" class="info-item">
              <span class="label">详细地址：</span>
              <span class="value">{{ locationData.address }}</span>
            </div>
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="errorMessage" class="error-box">
          <h3>❌ 错误信息</h3>
          <div class="error-content">
            {{ errorMessage }}
          </div>
        </div>

        <!-- 日志信息 -->
        <div class="log-box">
          <div class="log-header">
            <h3>📝 日志</h3>
            <el-button link @click="handleClearLog" size="small">清空日志</el-button>
          </div>
          <div class="log-content">
            <div v-if="logs.length === 0" class="log-empty">暂无日志</div>
            <div v-for="(log, index) in logs" :key="index" class="log-item" :class="log.type">
              <span class="log-time">{{ log.time }}</span>
              <span class="log-icon">{{ log.icon }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="tips-box">
        <h3>💡 使用说明</h3>
        <ul>
          <li>点击"获取定位"会自动使用 GPS 定位，失败时降级到 IP 定位</li>
          <li>第一次使用 GPS 定位可能需要 5-10 秒钟</li>
          <li>浏览器会要求位置权限，请点击"允许"</li>
          <li>如果使用 HTTP 协议（非 localhost），GPS 定位会被禁用</li>
          <li>定位结果会被缓存，重新定位前请点击"重置定位"</li>
        </ul>
      </div>

      <!-- 技术详情 -->
      <div class="tech-details-box">
        <h3>🔧 技术详情</h3>
        <div class="detail-item">
          <span class="detail-label">浏览器支持：</span>
          <span class="detail-value">
            {{ browserInfo.geolocationSupported ? '✅ 支持 Geolocation API' : '❌ 不支持 Geolocation API' }}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">协议类型：</span>
          <span class="detail-value">{{ browserInfo.protocol }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">主机名：</span>
          <span class="detail-value">{{ browserInfo.hostname }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWeatherStore } from '@/store/modules/weather'
import { getGPSLocation, getIPLocation, getAmapLocation } from '@/utils/location'
import { ElMessage } from 'element-plus'
import type { LocationData } from '@/utils/location'

const weatherStore = useWeatherStore()

// 状态
const locationData = ref<LocationData | null>(null)
const errorMessage = ref('')
const isLocating = ref(false)
const isLocatingGPS = ref(false)
const isLocatingAmap = ref(false)
const isLocatingIP = ref(false)
const logs = ref<Array<{ time: string; icon: string; message: string; type: string }>>([])

// 浏览器信息
const browserInfo = ref({
  geolocationSupported: typeof navigator !== 'undefined' ? !!navigator.geolocation : false,
  protocol: typeof window !== 'undefined' ? window.location.protocol : '',
  hostname: typeof window !== 'undefined' ? window.location.hostname : '',
})

// 辅助函数
function getSourceType(source: string) {
  const typeMap: Record<string, 'success' | 'warning' | ''> = {
    gps: 'success',
    amap: 'success',
    ip: 'warning',
  }
  return typeMap[source] || ''
}

function getSourceName(source: string) {
  const nameMap: Record<string, string> = {
    gps: '🛰️ GPS 定位',
    amap: '🗺️ 高德地图',
    ip: '🌐 IP 定位',
  }
  return nameMap[source] || source
}

// 添加日志
function addLog(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const iconMap = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  }
  const now = new Date()
  const time = now.toLocaleTimeString('zh-CN')
  logs.value.unshift({
    time,
    icon: iconMap[type],
    message,
    type,
  })
  if (logs.value.length > 50) {
    logs.value.pop()
  }
}

// 获取定位
async function handleGetLocation() {
  isLocating.value = true
  errorMessage.value = ''
  addLog('开始混合定位...', 'info')

  try {
    const location = await weatherStore.getLocationInfo()
    if (location) {
      locationData.value = location
      errorMessage.value = ''
      const source = location.source === 'gps' ? 'GPS' : 'IP'
      addLog(`${source} 定位成功 (${location.latitude}, ${location.longitude})`, 'success')
      ElMessage.success(`${source} 定位成功！`)
    } else {
      errorMessage.value = '定位失败'
      addLog('定位失败：返回空值', 'error')
      ElMessage.error('定位失败')
    }
  } catch (error: any) {
    errorMessage.value = error.message || '定位失败'
    addLog(`定位异常: ${error.message}`, 'error')
    ElMessage.error(error.message)
  } finally {
    isLocating.value = false
  }
}

// 仅 GPS 定位
async function handleGetGPSOnly() {
  isLocatingGPS.value = true
  errorMessage.value = ''
  addLog('开始 GPS 定位...', 'info')

  try {
    const location = await getGPSLocation()
    locationData.value = location
    errorMessage.value = ''
    addLog(`GPS 定位成功 (${location.latitude}, ${location.longitude})`, 'success')
    ElMessage.success('GPS 定位成功！')
  } catch (error: any) {
    errorMessage.value = error.message || 'GPS 定位失败'
    addLog(`GPS 定位失败: ${error.message}`, 'error')
    ElMessage.error(error.message)
  } finally {
    isLocatingGPS.value = false
  }
}


// 仅高德定位
async function handleGetAmapOnly() {
  isLocatingAmap.value = true
  errorMessage.value = ''
  addLog('开始高德地图定位...', 'info')

  try {
    const location = await getAmapLocation()
    locationData.value = location
    errorMessage.value = ''
    addLog(`高德定位成功 (${location.latitude}, ${location.longitude})`, 'success')
    ElMessage.success('高德定位成功！')
  } catch (error: any) {
    errorMessage.value = error.message || '高德定位失败'
    addLog(`高德定位失败: ${error.message}`, 'error')
    ElMessage.error(error.message)
  } finally {
    isLocatingAmap.value = false
  }
}

// 仅 IP 定位
async function handleGetIPOnly() {
  isLocatingIP.value = true
  errorMessage.value = ''
  addLog('开始 IP 定位...', 'info')

  try {
    const location = await getIPLocation()
    locationData.value = location
    errorMessage.value = ''
    addLog(`IP 定位成功 (${location.latitude}, ${location.longitude})`, 'success')
    ElMessage.success('IP 定位成功！')
  } catch (error: any) {
    errorMessage.value = error.message || 'IP 定位失败'
    addLog(`IP 定位失败: ${error.message}`, 'error')
    ElMessage.error(error.message)
  } finally {
    isLocatingIP.value = false
  }
}

// 重置定位
function handleResetLocation() {
  weatherStore.resetLocation()
  locationData.value = null
  errorMessage.value = ''
  addLog('定位信息已重置', 'info')
  ElMessage.info('定位已重置')
}

// 清空日志
function handleClearLog() {
  logs.value = []
  addLog('日志已清空', 'info')
}

onMounted(() => {
  addLog('测试页面已加载', 'success')
})
</script>

<style lang="scss" scoped>
.location-test-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  border-radius: 10px;

  .test-header {
    text-align: center;
    color: white;
    margin-bottom: 30px;

    h1 {
      font-size: 32px;
      margin: 0 0 10px 0;
    }

    .subtitle {
      font-size: 14px;
      opacity: 0.8;
      margin: 0;
    }
  }

  .test-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .button-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    :deep(.el-button) {
      flex: 1;
      min-width: 120px;
    }
  }

  .results-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .status-box,
  .info-box,
  .error-box,
  .log-box,
  .tips-box,
  .tech-details-box {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .status-content {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;

    .status-item {
      display: flex;
      align-items: center;
      gap: 10px;

      .label {
        color: #666;
        font-weight: 500;
      }

      .status-text {
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 12px;

        &.loading {
          background: #e6f7ff;
          color: #1890ff;
          animation: pulse 1.5s infinite;
        }

        &.success {
          color: #52c41a;
        }

        &.text-muted {
          color: #999;
        }
      }
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background: #f5f7fa;
      border-radius: 4px;

      .label {
        color: #666;
        font-weight: 500;
        min-width: 80px;
      }

      .value {
        color: #333;
        font-family: 'Courier New', monospace;
        font-weight: 600;
        word-break: break-all;
      }
    }
  }

  .error-box {
    border-left: 4px solid #f56c6c;

    .error-content {
      color: #f56c6c;
      padding: 10px;
      background: #fef0f0;
      border-radius: 4px;
      font-size: 13px;
      word-break: break-all;
    }
  }

  .log-box {
    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      h3 {
        margin: 0;
      }
    }

    .log-content {
      background: #f5f7fa;
      border-radius: 4px;
      max-height: 300px;
      overflow-y: auto;
      padding: 10px;

      .log-empty {
        text-align: center;
        color: #999;
        padding: 20px;
        font-size: 12px;
      }

      .log-item {
        display: flex;
        gap: 10px;
        padding: 8px 10px;
        border-bottom: 1px solid #eee;
        font-size: 12px;
        font-family: 'Courier New', monospace;

        &:last-child {
          border-bottom: none;
        }

        .log-time {
          color: #999;
          min-width: 80px;
        }

        .log-icon {
          min-width: 20px;
        }

        .log-message {
          color: #333;
          flex: 1;
          word-break: break-all;
        }

        &.success {
          .log-message {
            color: #52c41a;
          }
        }

        &.error {
          .log-message {
            color: #f56c6c;
          }
        }

        &.info {
          .log-message {
            color: #1890ff;
          }
        }
      }
    }
  }

  .tips-box,
  .tech-details-box {
    ul {
      margin: 0;
      padding-left: 20px;
      color: #666;
      font-size: 13px;
      line-height: 1.8;

      li {
        margin-bottom: 8px;
      }
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      border-bottom: 1px solid #eee;
      font-size: 13px;

      &:last-child {
        border-bottom: none;
      }

      .detail-label {
        color: #666;
        font-weight: 500;
        min-width: 120px;
      }

      .detail-value {
        color: #333;
        font-family: 'Courier New', monospace;
      }
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>

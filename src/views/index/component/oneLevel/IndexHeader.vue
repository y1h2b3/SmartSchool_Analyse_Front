<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useWeatherStore } from '@/store/modules/weather'

  const WeatherStore = useWeatherStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性：获取格式化地址
  const formattedAddress = computed(() => {
    console.log('🔍 IndexHeader - locationInfo:', WeatherStore.locationInfo)
    console.log('🔍 IndexHeader - isLocating:', WeatherStore.isLocating)

    if (!WeatherStore.locationInfo) return '获取中...'
    const { address, district, city, province, latitude, longitude, source } =
      WeatherStore.locationInfo

    // 优先显示完整地址
    if (address) return address

    // 组合省市区
    const locationStr = `${province || ''}${city || ''}${district || ''}`
    if (locationStr.trim()) {
      console.log('🔍 IndexHeader - 格式化地址:', locationStr)
      return locationStr
    }

    // 如果没有地址信息，显示经纬度
    console.log('⚠️ IndexHeader - 没有地址信息，显示坐标')
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
  })

  // 获取位置信息
  const getLocationData = async () => {
    console.log('🚀 IndexHeader - 开始获取位置')
    if (isLoading.value) {
      console.log('⏸️ IndexHeader - 正在加载中，跳过')
      return
    }

    isLoading.value = true
    error.value = null
    try {
      console.log('📍 IndexHeader - needsLocationUpdate:', WeatherStore.needsLocationUpdate)
      console.log('📍 IndexHeader - 当前 locationInfo:', WeatherStore.locationInfo)

      // 检查是否需要更新（超过30分钟）
      if (WeatherStore.needsLocationUpdate) {
        console.log('🔄 IndexHeader - 强制更新位置')
        await WeatherStore.getLocationInfo(true)
      } else if (!WeatherStore.locationInfo) {
        console.log('🆕 IndexHeader - 首次获取位置')
        // 如果没有缓存，获取一次
        await WeatherStore.getLocationInfo()
      } else {
        console.log('✅ IndexHeader - 使用缓存位置')
      }

      console.log('✅ IndexHeader - 位置获取完成:', WeatherStore.locationInfo)
    } catch (err: any) {
      error.value = err.message || '定位失败'
      console.error('❌ IndexHeader - 定位错误:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 强制刷新位置
  const forceRefresh = async () => {
    console.log('🔄 强制刷新位置...')
    WeatherStore.resetLocation()
    await getLocationData()
  }

  onMounted(() => {
    getLocationData()
  })
</script>

<template>
  <div class="position_box">
    <el-icon :size="16" color="#000" :class="{ loading: isLoading }" @click="forceRefresh" style="cursor: pointer">
      <Location />
    </el-icon>
    <span class="text" :title="formattedAddress">{{ formattedAddress }}</span>
    <el-tooltip v-if="error" :content="error" placement="bottom">
      <el-icon :size="14" color="#f56c6c" style="margin-left: 4px"><Warning /></el-icon>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .position_box {
    width: auto;
    max-width: 150px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-sizing: border-box;
    gap: 4px;

    .text {
      color: #000;
      font-weight: 700;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>

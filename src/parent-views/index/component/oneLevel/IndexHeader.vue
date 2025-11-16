<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useWeatherStore } from '@/store/modules/weather'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const WeatherStore = useWeatherStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const showCityDialog = ref(false)
  const cityInput = ref('')
  const isSettingCity = ref(false)

  // 计算属性:直接使用 store 的 formattedAddress getter
  const formattedAddress = computed(() => {
    console.log('🔍 IndexHeader - locationInfo:', WeatherStore.locationInfo)
    console.log('🔍 IndexHeader - isLocating:', WeatherStore.isLocating)

    if (WeatherStore.isLocating) return '获取中...'
    
    // 使用 store 的 formattedAddress getter (仅显示市+区)
    return WeatherStore.formattedAddress
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
    let locationUpdated = false
    
    try {
      console.log('📍 IndexHeader - needsLocationUpdate:', WeatherStore.needsLocationUpdate)
      console.log('📍 IndexHeader - 当前 locationInfo:', WeatherStore.locationInfo)

      // 检查是否需要更新（超过30分钟）
      if (WeatherStore.needsLocationUpdate) {
        console.log('🔄 IndexHeader - 强制更新位置')
        await WeatherStore.getLocationInfo(true)
        locationUpdated = true
      } else if (!WeatherStore.locationInfo) {
        console.log('🆕 IndexHeader - 首次获取位置')
        // 如果没有缓存，获取一次
        await WeatherStore.getLocationInfo()
        locationUpdated = true
      } else {
        console.log('✅ IndexHeader - 使用缓存位置')
      }

      console.log('✅ IndexHeader - 位置获取完成:', WeatherStore.locationInfo)
      
      // 🌦️ 如果位置有更新，自动刷新天气
      if (locationUpdated && WeatherStore.locationInfo) {
        console.log('🌦️ 位置已更新，正在刷新天气数据...')
        await WeatherStore.getWeatherData(true)
        console.log('✅ 天气数据已同步更新')
      }
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
    // getLocationData 内部已经会自动刷新天气
  }

  // 打开城市输入弹窗
  const openCityDialog = () => {
    cityInput.value = ''
    showCityDialog.value = true
  }

  // 手动设置城市
  const setCity = async () => {
    const city = cityInput.value.trim()
    if (!city) {
      ElMessage.warning('请输入城市名称')
      return
    }

    isSettingCity.value = true
    try {
      // 调用 store 的手动设置位置方法
      await WeatherStore.setLocationByCity(city)
      
      // 设置位置成功后，立即刷新天气
      await WeatherStore.getWeatherData(true)
      
      ElMessage.success(`定位成功：${city}`)
      showCityDialog.value = false
      cityInput.value = ''
    } catch (err: any) {
      ElMessage.error(err.message || '城市定位失败，请检查城市名称')
      console.error('❌ 设置城市失败:', err)
    } finally {
      isSettingCity.value = false
    }
  }

  // 清除所有缓存
  const clearCache = async () => {
    try {
      await ElMessageBox.confirm(
        '清除缓存后将重新获取定位和天气数据，是否继续？',
        '确认清除缓存',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
      
      // 用户确认后执行清除
      WeatherStore.resetAll()
      ElMessage.success('缓存已清除，正在重新获取...')
      console.log('🗑️ 已清除所有缓存（定位+天气）')
      
      // 清除后自动重新获取（会自动触发天气刷新）
      setTimeout(() => {
        getLocationData()
      }, 500)
    } catch {
      // 用户取消操作
      console.log('❌ 用户取消清除缓存')
    }
  }

  onMounted(() => {
    getLocationData()
  })
</script>

<template>
  <div class="position_box">
    <el-icon
      :size="16"
      color="#000"
      :class="{ loading: isLoading }"
      @click="forceRefresh"
      style="cursor: pointer"
      title="刷新定位"
    >
      <Location />
    </el-icon>
    <span class="text" :title="formattedAddress" @click="openCityDialog" style="cursor: pointer">
      {{ formattedAddress }}
    </span>
    <el-tooltip content="手动输入城市" placement="bottom">
      <el-icon 
        :size="14" 
        color="#409eff" 
        style="margin-left: 4px; cursor: pointer"
        @click="openCityDialog"
      >
        <Edit />
      </el-icon>
    </el-tooltip>
    <el-tooltip content="清除缓存" placement="bottom">
      <el-icon 
        :size="14" 
        color="#e6a23c" 
        style="margin-left: 4px; cursor: pointer"
        @click="clearCache"
      >
        <Delete />
      </el-icon>
    </el-tooltip>
    <el-tooltip v-if="error" :content="error" placement="bottom">
      <el-icon :size="14" color="#f56c6c" style="margin-left: 4px"><Warning /></el-icon>
    </el-tooltip>
  </div>

  <!-- 手动输入城市弹窗 -->
  <el-dialog
    v-model="showCityDialog"
    title="手动设置位置"
    width="400px"
    :close-on-click-modal="false"
  >
    <el-form @submit.prevent="setCity">
      <el-form-item label="城市名称">
        <el-input
          v-model="cityInput"
          placeholder="请输入城市名称，如：北京、上海、广州"
          :disabled="isSettingCity"
          clearable
          @keyup.enter="setCity"
        >
          <template #prefix>
            <el-icon><Location /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <div style="color: #909399; font-size: 12px; margin-top: -10px; margin-bottom: 15px">
        💡 支持中文城市名，如：北京、上海、深圳、成都等
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCityDialog = false" :disabled="isSettingCity">取消</el-button>
        <el-button type="primary" @click="setCity" :loading="isSettingCity">
          {{ isSettingCity ? '定位中...' : '确定' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
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

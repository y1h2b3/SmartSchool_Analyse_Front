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
  
  // 定位类型和精度
  const locationType = computed(() => WeatherStore.locationInfo?.source || 'unknown')
  const locationAccuracy = computed(() => {
    const accuracy = WeatherStore.locationInfo?.accuracy
    if (!accuracy) return ''
    if (accuracy < 100) return `精度: ${Math.round(accuracy)}m`
    if (accuracy < 1000) return `精度: ${Math.round(accuracy)}m`
    return `精度: ${(accuracy / 1000).toFixed(1)}km`
  })
  
  // 热门城市
  const hotCities = ['北京', '上海', '杭州', '成都', '武汉', '哈尔滨']

  // 计算属性:直接使用 store 的 formattedAddress getter
  const formattedAddress = computed(() => {
    if (WeatherStore.isLocating) return '获取中...'
    
    // 使用 store 的 formattedAddress getter (仅显示市+区)
    return WeatherStore.formattedAddress
  })

  // 获取位置信息
  const getLocationData = async () => {
    if (isLoading.value) {
      return
    }

    isLoading.value = true
    error.value = null
    
    try {
      // 获取定位信息（不强制刷新，使用缓存策略）
      await WeatherStore.getLocationInfo(false)
      
      // 获取天气数据（不强制刷新，使用缓存策略）
      await WeatherStore.getWeatherData(false)
    } catch (err: any) {
      error.value = err.message || '定位失败'
    } finally {
      isLoading.value = false
    }
  }

  // 强制刷新位置（智能降级）
  const forceRefresh = async () => {
    WeatherStore.resetLocation()
    await getLocationData()
    ElMessage.success('定位已刷新')
  }

  // 打开城市输入弹窗
  const openCityDialog = () => {
    cityInput.value = ''
    showCityDialog.value = true
  }

  // 选择热门城市（直接定位）
  const selectHotCity = async (city: string) => {
    cityInput.value = city
    // 直接触发定位
    await setCity()
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
      
      ElMessage.success(`定位成功：${city}`)
      showCityDialog.value = false
      cityInput.value = ''
      
      // 定位成功后，异步刷新天气（不阻塞弹窗关闭）
      WeatherStore.getWeatherData(true)
    } catch (err: any) {
      ElMessage.error(err.message || '城市定位失败，请检查城市名称')
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
      
      // 清除后自动重新获取（会自动触发天气刷新）
      setTimeout(() => {
        getLocationData()
      }, 500)
    } catch {
      // 用户取消操作
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
    width="450px"
    :close-on-click-modal="false"
  >
    <el-form @submit.prevent="setCity">
      <el-form-item label="城市名称">
        <el-input
          v-model="cityInput"
          placeholder="请输入城市名称，如：中山、广州、深圳"
          :disabled="isSettingCity"
          clearable
          @keyup.enter="setCity"
        >
          <template #prefix>
            <el-icon><Location /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      
      <!-- 热门城市 -->
      <div style="margin-top: -10px; margin-bottom: 15px">
        <div style="color: #909399; font-size: 12px; margin-bottom: 8px">
          🔥 热门城市：
        </div>
        <el-space wrap>
          <el-tag 
            v-for="city in hotCities" 
            :key="city"
            @click="selectHotCity(city)"
            style="cursor: pointer"
            size="small"
          >
            {{ city }}
          </el-tag>
        </el-space>
      </div>
      
      <div style="color: #909399; font-size: 12px">
        💡 支持中文城市名，点击热门城市快速选择
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

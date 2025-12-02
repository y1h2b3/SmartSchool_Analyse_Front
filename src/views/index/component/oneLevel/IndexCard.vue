<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue'
  import IndexHeader from './IndexHeader.vue'
  import { useUserStore } from '../../../../store/modules/user'
  import { useWeatherStore } from '@/store/modules/weather'
  import { formatTemperature } from '@/api/weather'

  const UserStore = useUserStore()
  const WeatherStore = useWeatherStore()
  
  // 使用 computed 监听 Store 的 isFetchingWeather 状态
  const isLoadingWeather = computed(() => WeatherStore.isFetchingWeather)

  // 根据温度获取图标
  const getTempIcon = (temp: number) => {
    if (temp >= 35) return '🥵' // 高温
    if (temp >= 25) return '🌡️' // 热
    if (temp >= 15) return '☀️' // 温暖
    if (temp >= 5) return '🌤️' // 凉爽
    return '❄️' // 寒冷
  }

  // 根据湿度获取图标
  const getHumidityIcon = (humidity: number) => {
    if (humidity >= 80) return '💧' // 潮湿
    if (humidity >= 60) return '💦' // 正常
    return '🌬️' // 干燥
  }

  // 根据云量获取图标
  const getCloudIcon = (cloudiness: number) => {
    if (cloudiness >= 80) return '☁️' // 阴天
    if (cloudiness >= 50) return '🌥️' // 多云
    if (cloudiness >= 20) return '⛅' // 少云
    return '☀️' // 晴天
  }

  // 根据气压获取图标
  const getPressureIcon = (pressure: number) => {
    if (pressure >= 1020) return '🔼' // 高压
    if (pressure >= 1000) return '🧭' // 正常
    return '🔽' // 低压
  }

  // 根据风速获取图标
  const getWindIcon = (windSpeed: number) => {
    if (windSpeed >= 10) return '🌪️' // 狂风
    if (windSpeed >= 5) return '💨' // 大风
    if (windSpeed >= 2) return '🍃' // 微风
    return '🍁' // 无风
  }

  // 计算天气数据
  const weatherList = computed(() => {
    const weather = WeatherStore.weatherData
    if (!weather) {
      return [
        { icon: '🌡️', value: '--℃', key: '室外温度' },
        { icon: '💧', value: '--%', key: '室外湿度' },
        { icon: '☁️', value: '--%', key: '云量' },
        { icon: '🧭', value: '--hPa', key: '气压' },
        { icon: '🍃', value: '--m/s', key: '风速' },
      ]
    }

    return [
      { icon: getTempIcon(weather.temp), value: formatTemperature(weather.temp), key: '室外温度' },
      { icon: getHumidityIcon(weather.humidity), value: `${weather.humidity}%`, key: '室外湿度' },
      { icon: getCloudIcon(weather.cloudiness), value: `${weather.cloudiness}%`, key: '云量' },
      { icon: getPressureIcon(weather.pressure), value: `${weather.pressure}hPa`, key: '气压' },
      { icon: getWindIcon(weather.windSpeed), value: `${weather.windSpeed.toFixed(1)}m/s`, key: '风速' },
    ]
  })

  // 获取天气数据（首次加载时调用）
  const getWeatherData = async () => {
    try {
      await WeatherStore.getWeatherData()
    } catch (error) {
      console.error('获取天气失败:', error)
    }
  }

  onMounted(() => {
    // 首次加载时获取天气数据
    // 后续定位更新会自动触发天气刷新，isLoadingWeather 会自动响应
    getWeatherData()
  })
</script>

<template>
  <div class="card-content">
    <div class="header">
      <div class="top">
        <span class="title">你好，{{ UserStore.userInfo?.username }}！</span>
        <IndexHeader></IndexHeader>
        <!-- <el-icon style="cursor: pointer"><MoreFilled /></el-icon> -->
      </div>
      <div class="bottom">
        <span>当前健康指数正常，希望你继续保持健康的状态！</span>
      </div>
    </div>

    <!-- 天气信息展示 -->
    <div class="footer" :class="{ loading: isLoadingWeather }">
      <template v-for="item in weatherList" :key="item.value">
        <div class="weather-item" :class="{ skeleton: isLoadingWeather }">
          <span class="weather-icon">{{ item.icon }}</span>
          <span class="value">{{ item.value }}</span>
          <span class="key">{{ item.key }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .card-content {
    width: 100%;
    padding: 5px 20px 20px 20px;
    box-sizing: border-box;
    height: 240px;
    /* background: linear-gradient(to bottom right, #45c4eb, #39a1c1); */
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    .header {
      width: 100%;
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      .top {
        width: 100%;
        height: auto;
        padding: 5px 0;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        .title {
          font-size: 15px;
          color: #000;
          font-weight: 700;
        }
        .logo {
          width: 20px;
          height: 20px;
        }
      }
      .bottom {
        width: 90%;
        > span {
          font-size: 12px;
          color: #000;
          opacity: 0.7;
        }
      }
    }
    .footer {
      margin-top: 15px;
      width: 100%;
      flex: 1;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .weather-item {
        width: 100px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        opacity: 1;
        transition: opacity 0.3s ease;

        &.skeleton {
          opacity: 0.6;
          .weather-icon {
            opacity: 0.3;
            animation: shimmer 2s infinite;
          }
          .value,
          .key {
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
            color: transparent;
          }
        }

        .weather-icon {
          font-size: 40px;
          transition: all 0.3s ease;
        }
        .value {
          font-size: 18px;
          color: #000;
          font-weight: 600;
        }
        .key {
          font-size: 12px;
          color: #000;
          opacity: 0.6;
        }
      }
    }
  }
</style>

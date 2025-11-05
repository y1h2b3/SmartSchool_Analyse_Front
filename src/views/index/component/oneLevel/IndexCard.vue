<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue'
  import IndexHeader from './IndexHeader.vue'
  import { useUserStore } from '../../../../store/modules/user'
  import { useWeatherStore } from '@/store/modules/weather'
  import { formatTemperature } from '@/api/weather'

  const UserStore = useUserStore()
  const WeatherStore = useWeatherStore()
  const isLoadingWeather = ref(false)

  // 计算天气数据
  const weatherList = computed(() => {
    const weather = WeatherStore.weatherData
    if (!weather) {
      return [
        { icon: 'Sunny', value: '--℃', key: '室外温度' },
        { icon: 'Drizzling', value: '--%', key: '室外湿度' },
        { icon: 'Cloudy', value: '--%', key: '云量' },
        { icon: 'Compass', value: '--hPa', key: '气压' },
        { icon: 'MostlyCloudy', value: '--℃', key: '体感' },
      ]
    }

    return [
      { icon: 'Sunny', value: formatTemperature(weather.temp), key: '室外温度' },
      { icon: 'Drizzling', value: `${weather.humidity}%`, key: '室外湿度' },
      { icon: 'Cloudy', value: `${weather.cloudiness}%`, key: '云量' },
      { icon: 'Compass', value: `${weather.pressure}hPa`, key: '气压' },
      { icon: 'MostlyCloudy', value: formatTemperature(weather.feelsLike), key: '体感' },
    ]
  })

  // 获取天气数据
  const getWeatherData = async () => {
    if (isLoadingWeather.value) return
    
    isLoadingWeather.value = true
    try {
      await WeatherStore.getWeatherData()
    } catch (error) {
      console.error('获取天气失败:', error)
    } finally {
      isLoadingWeather.value = false
    }
  }

  onMounted(() => {
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
    <div class="footer" :class="{ loading: isLoadingWeather }">
      <template v-for="item in weatherList" :key="item.value">
        <div class="weather-item" :class="{ skeleton: isLoadingWeather }">
          <el-icon :size="40" class="weather-icon">
            <component :is="item.icon" />
          </el-icon>
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
          color: #333;
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

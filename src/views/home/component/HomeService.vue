<script setup>
  import { ref, onBeforeMount } from 'vue'
  import axios from 'axios'
  const weatherData = ref({})
  const props = defineProps(['lat', 'lon'])
  /**
   * 获取当前地区天气的数据
   */
  const getWeatherInfo = async () => {
    if (localStorage.getItem('weatherData')) {
      weatherData.value = JSON.parse(localStorage.getItem('weatherData'))
      console.log(weatherData.value)
      return
    }
    const resp = await axios.request({
      url: `/openweathermap/data/2.5/weather?lat=23.175881&lon=113.3149391&appid=f2767ce16ef8bac65d38f9c60de0f3d5&units=metric`,
      method: 'get',
    })
    weatherData.value = resp.data
    weatherData.value.main.feels_like += '℃'
    weatherData.value.main.temp_min += '℃'
    weatherData.value.main.humidity += '%'
    weatherData.value.visibility = weatherData.value.visibility / 1000 + 'km'
    weatherData.value.main.pressure += '百帕'
    weatherData.value.clouds.all += '%'

    weatherData.value.main.pressure_change = '稳定'
    weatherData.value.ultraviolet = '1级 稳定'
    localStorage.setItem('weatherData', JSON.stringify(weatherData.value))
    console.log(weatherData.value)
  }
  onBeforeMount(async () => {
    // localStorage.clear('weatherData')
    // 获取当前地区天气数据
    console.log('获取当前地区天气数据')
    await getWeatherInfo()
  })
</script>

<template>
  <div class="serviceInfo_box">
    <div class="serviceItme">
      <div class="logo" style="background-image: url('/src/assets/image/index/云量.png')"></div>
      <span class="text">体感</span>
      <span class="text">{{ weatherData?.main?.feels_like }}</span>
    </div>
    <div class="serviceItme">
      <div class="logo" style="background-image: url('/src/assets/image/index/云量.png')"></div>
      <span class="text">最低温度</span>
      <span class="text">{{ weatherData?.main?.temp_min }}</span>
    </div>
    <div class="serviceItme">
      <div class="logo" style="background-image: url('/src/assets/image/index/云量.png')"></div>
      <span class="text">湿度</span>
      <span class="text">{{ weatherData?.main?.humidity }}</span>
    </div>
    <div class="serviceItme">
      <div class="logo" style="background-image: url('/src/assets/image/index/云量.png')"></div>
      <span class="text">紫外线</span>
      <span class="text">{{ weatherData?.ultraviolet }}</span>
    </div>
    <div class="serviceItme">
      <div class="logo" style="background-image: url('/src/assets/image/index/云量.png')"></div>
      <span class="text">能见度</span>
      <span class="text">{{ weatherData?.visibility }}</span>
    </div>
    <div class="serviceItme">
      <div class="logo" style="background-image: url('/src/assets/image/index/云量.png')"></div>
      <span class="text">气压</span>
      <span class="text">{{ weatherData?.main?.pressure }}</span>
    </div>
    <div class="serviceItme">
      <div class="logo" style="background-image: url('/src/assets/image/index/云量.png')"></div>
      <span class="text">气压变化</span>
      <span class="text">{{ weatherData?.main?.pressure_change }}</span>
    </div>
    <div class="serviceItme">
      <div class="logo" style="background-image: url('/src/assets/image/index/云量.png')"></div>
      <span class="text">云量</span>
      <span class="text">{{ weatherData?.clouds?.all }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .serviceInfo_box {
    width: 500px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    .serviceItme {
      width: 125px;
      height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      margin-top: 5px;
      .logo {
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
        background-size: cover;
      }
      .text:nth-child(2) {
        font-size: 12px;
        color: #929292;
        font-weight: 500;
        margin-bottom: 2px;
      }
      .text:nth-child(3) {
        font-size: 15px;
        font-weight: 700;
      }
    }
  }
</style>

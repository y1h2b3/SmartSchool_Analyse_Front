<script lang="ts" setup>
  import { ref } from 'vue'
  import IndexWeatherItem from './IndexWeather-Item.vue'
  const weatherList = ref([
    { logo: '/src/assets/image/index/温度.png', value: '15℃', key: '室外温度' },
    { logo: '/src/assets/image/index/湿度.png', value: '60%', key: '室外湿度' },
    { logo: '/src/assets/image/index/多云.png', value: '80%', key: '云量' },
    { logo: '/src/assets/image/index/紫外线.png', value: '15℃', key: '紫外线' },
    { logo: '/src/assets/image/index/体感.png', value: '15℃', key: '体感' },
  ])
</script>

<template>
  <div class="card-content">
    <IndexWeatherItem></IndexWeatherItem>
    <div class="footer">
      <template v-for="item in weatherList" :key="item.value">
        <div class="weather-item">
          <div class="logo" :style="{ backgroundImage: `url(${item.logo})` }"></div>
          <span class="value">{{ item.value }}</span>
          <span class="key">{{ item.key }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .card-content {
    width: 100%;
    margin-top: 20px;
    padding: 20px;
    box-sizing: border-box;
    height: 390px;
    background: linear-gradient(to bottom right, #45c4eb, #39a1c1);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
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
        .logo {
          width: 50px;
          height: 50px;
          background-image: url('/src/assets/test.jpg');
          background-size: cover;
        }
        .value {
          font-size: 18px;
          color: #fff;
        }
        .key {
          font-size: 12px;
          color: #fff;
          opacity: 0.6;
        }
      }
    }
  }
</style>

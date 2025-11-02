<script setup>
  import { onMounted, reactive } from 'vue'
  import { useWeatherStore } from '@/store/modules/weather.ts'
  const WeatherStore = useWeatherStore()
  const address = reactive({
    province: null,
    city: null,
  })
  onMounted(async () => {
    const addressInfo = await WeatherStore.getAddressInfo()
    address.province = addressInfo?.ipdata?.info1
    address.city = addressInfo?.ipdata?.info2
  })
</script>

<template>
  <div class="position_box">
    <el-icon :size="20" color="#fff"><Location /></el-icon>
    <span class="text">校园健康监测与预警</span>
  </div>
</template>

<style lang="scss" scoped>
  @media (max-width: 768px) {
    .position_box {
      height: 0px !important;
    }
  }
  .position_box {
    width: 300px;
    height: 50px;
    // background-color: #66b1ff;
    // background: linear-gradient(to bottom right, #45c4eb, #39a1c1);
    border-radius: 20px;
    // box-shadow: 2px 3px 5px #39a1c1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 20px;
    box-sizing: border-box;
    .text {
      margin-left: 5px;
      color: #fff;
      font-weight: bold;
    }
  }
</style>

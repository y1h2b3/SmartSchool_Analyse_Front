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
    <el-icon :size="16" color="#000"><Location /></el-icon>
    <span class="text">{{ address.province }} {{ address.city }}</span>
  </div>
</template>

<style lang="scss" scoped>
  .position_box {
    width: 150px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-sizing: border-box;
    .text {
      margin-left: 2px;
      color: #000;
      font-weight: 700;
      font-size: 12px;
    }
  }
</style>

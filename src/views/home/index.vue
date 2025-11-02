<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
  import { ref } from 'vue'
  import HomeHeader from './component/HomeHeader.vue'
  import HomeWeatherInfo from './component/HomeWeatherInfo.vue'
  import HomeService from './component/HomeService.vue'
  import HomeEchartsLine from './component/HomeEchartsLine.vue'
  import HomeEchartsRadar from './component/HomeEchartsRadar.vue'
  import HomePersonalCount from './component/HomePersonalCount.vue'
  const lat = ref<string>('23.175881')
  const lon = ref<string>('113.3149391')
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div class="content">
        <div class="main_box">
          <div class="left">
            <HomeHeader></HomeHeader>
            <HomeWeatherInfo></HomeWeatherInfo>
            <HomeService :lat="lat" :lon="lon"></HomeService>
            <HomeEchartsLine></HomeEchartsLine>
          </div>
          <div class="right">
            <HomeEchartsRadar></HomeEchartsRadar>
            <HomePersonalCount></HomePersonalCount>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .content {
    width: 100%;
    height: 100%;
    .main_box {
      flex: 1;
      display: flex;
      .left {
        width: 500px;
        height: 100%;
        margin-right: 20px;
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
</style>

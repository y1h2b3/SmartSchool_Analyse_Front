<script lang="ts" setup>
  import { onMounted } from 'vue'
  import IndexHeader from './IndexHeader.vue'
  /* import IndexCard from './IndexCard.vue' */
  import IndexWeather from './IndexWeather.vue'
  import IndexCard from './IndexCard.vue'
  import IndexRunData from './IndexRunData.vue'
  import { ElMessage } from 'element-plus'
  onMounted(async () => {
    ElMessage.success('开始获取天气信息')
  })
</script>

<template>
  <div class="content">
    <!-- <IndexHeader></IndexHeader> -->
    <!-- <IndexCard></IndexCard> -->
    <!-- <IndexWeather></IndexWeather> -->
    <!-- <IndexRunData></IndexRunData> -->
    <IndexCard></IndexCard>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    width: calc(50% - 8px);
    height: 100%;
    background-color: transparent;
    /* padding: 20px; */
    box-sizing: border-box;
  }
</style>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import BodyTargetEchart from './BodyTargetEchart.vue'
</script>

<template>
  <div class="propose-content">
    <span class="title">今日全校平均身体指标分析</span>
    <BodyTargetEchart></BodyTargetEchart>
  </div>
</template>

<style lang="scss" scoped>
  .propose-content {
    width: 100%;
    height: 250px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: center;
    .title {
      width: 100%;
      height: 42px;
      padding: 10px;
      border-bottom: 1px solid #e1e1e1;
      box-sizing: border-box;
      font-weight: 700;
    }
  }
</style>

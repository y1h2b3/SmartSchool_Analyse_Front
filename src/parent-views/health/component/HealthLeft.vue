<script lang="ts" setup>
  import HealthRunTop from './HealthRunTop.vue'
  import ReasonEchart from '../../index/component/twoLevel/ReasonEchart.vue'
</script>

<template>
  <div class="left-content">
    <div class="run-top-box">
      <HealthRunTop></HealthRunTop>
    </div>
    <div class="sleep-box">
      <span class="title">一周睡眠统计</span>
      <div class="content">
        <ReasonEchart></ReasonEchart>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .left-content {
    width: 100%;
    height: 100%;
    background-color: transparent;
    .run-top-box {
      padding: 0;
      box-sizing: border-box;
    }
    .sleep-box {
      margin-top: 15px;
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
      .content {
        padding: 10px;
        box-sizing: border-box;
      }
    }
  }
</style>

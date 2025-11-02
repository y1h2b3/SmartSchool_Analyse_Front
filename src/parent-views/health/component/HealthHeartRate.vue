<script lang="ts" setup>
  import ReasonEchart from '../../index/component/twoLevel/ReasonEchart.vue'
</script>

<template>
  <div class="propose-content">
    <span class="title">近一周睡眠情况统计</span>
    <div class="content">
      <ReasonEchart></ReasonEchart>
    </div>
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
    .content {
      padding: 10px;
      box-sizing: border-box;
    }
  }
</style>

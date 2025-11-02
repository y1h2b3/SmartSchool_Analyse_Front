<script type="ts" setup>
  import ReasonEchart from './ReasonEchart.vue'
  import GradeEchart from './GradeEchart.vue'
  import TopSwiper from './TopSwiper.vue'
</script>

<template>
  <div class="left-content">
    <div class="left">
      <span class="title">预警人数前五班级</span>
      <TopSwiper></TopSwiper>
      <span class="title">全校学生预警等级占比</span>
      <ReasonEchart></ReasonEchart>
      <span class="title">全校学生预警原因占比</span>
      <GradeEchart></GradeEchart>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .left-content {
    width: 30%;
    height: 100%;
    background-color: #fff;
    display: flex;
    .title {
      font-size: 15px;
      font-weight: 700;
      padding: 10px 0;
      display: inline-block;
    }
    .title:not(:first-of-type) {
      margin-top: 15px;
    }
    .left {
      width: 100%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      .two-box {
        width: 100%;
        height: 200px;
      }
    }
    .right {
      flex: 1;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
    }
  }
</style>

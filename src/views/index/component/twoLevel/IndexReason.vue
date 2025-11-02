<script lang="ts" setup>
  import GradeEchart from './GradeEchart.vue'
</script>

<template>
  <div class="propose-content">
    <span class="title">今日全校预警人数</span>
    <div class="content">
      <GradeEchart></GradeEchart>
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
      padding-right: 5px;
      box-sizing: border-box;
    }
  }
</style>

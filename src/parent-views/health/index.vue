<script lang="ts" setup>
  import HealthLeft from './component/HealthLeft.vue'
  import HealthRight from './component/HealthRight.vue'
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div class="left">
        <HealthLeft></HealthLeft>
      </div>
      <div class="right">
        <HealthRight></HealthRight>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .app-container-inner {
    padding: 0px;
    background-color: transparent;
    box-shadow: none;
    display: flex;
    justify-content: space-between;
    .left {
      width: 27%;
    }
    .right {
      width: calc(73% - 14px);
    }
  }
</style>

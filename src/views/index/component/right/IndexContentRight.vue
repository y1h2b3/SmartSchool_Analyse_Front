<script lang="ts" setup>
  import IndexHeader from './IndexHeader.vue'
  import IndexSportEchart from './IndexSportEchart.vue'
  import IndexPopularService from './IndexPopularService.vue'
  import IndexWarning from './IndexWarning.vue'
  import IndexPeopleCount from './IndexPeopleCount.vue'
  import IndexProgress from './IndexProgress.vue'
</script>

<template>
  <div class="content">
    <IndexProgress></IndexProgress>
    <!-- <IndexHeader></IndexHeader> -->
    <!-- <IndexPopularService></IndexPopularService> -->
    <!-- <IndexSportEchart></IndexSportEchart> -->
    <!-- <IndexWarning></IndexWarning>
    <IndexPeopleCount></IndexPeopleCount> -->
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

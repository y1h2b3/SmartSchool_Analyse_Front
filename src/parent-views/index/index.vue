<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
  import IndexOneLevel from './component/oneLevel/IndexOneLevel.vue'
  import IndexTwoLevel from './component/twoLevel/IndexTwoLevel.vue'
  import IndexThreeLevel from './component/threeLevel/IndexThreeLevel.vue'
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner">
      <IndexOneLevel></IndexOneLevel>
      <IndexTwoLevel></IndexTwoLevel>
      <IndexThreeLevel></IndexThreeLevel>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .app-container-inner {
    width: 100%;
    height: 100%;
    padding: 0px;
    box-shadow: none;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    background-color: transparent;
    justify-content: flex-start;
  }
  @media (max-width: 768px) {
    .app-container-inner {
      flex-direction: column;
    }
    .app-container-inner > * {
      width: 100%;
      height: auto;
    }
  }
</style>

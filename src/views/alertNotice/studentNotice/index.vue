<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
  import NoticeLeft from './component/NoticeLeft.vue'
  import NoticeRight from './component/NoticeRight.vue'
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner">
      <NoticeLeft></NoticeLeft>
      <NoticeRight></NoticeRight>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .app-container-inner {
    padding: 0px;
    display: flex;
    justify-content: space-between;
    background-color: transparent;
    box-shadow: none;
  }
</style>

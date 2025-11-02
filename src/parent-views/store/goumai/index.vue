<script lang="ts" setup>
  import StoreItem from './component/StoreItem.vue'
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner">
      <StoreItem></StoreItem>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .app-container-inner {
    padding: 0;
    background-color: transparent;
    box-shadow: none;
  }
</style>

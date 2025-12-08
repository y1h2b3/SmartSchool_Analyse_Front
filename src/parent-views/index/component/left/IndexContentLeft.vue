<script lang="ts" setup>
  import { onMounted } from 'vue'
  import IndexCard from './IndexCard.vue'
  import { ElMessage } from 'element-plus'
  onMounted(async () => {
    ElMessage.success('开始获取天气信息')
  })
</script>

<template>
  <div class="content">
    <IndexCard></IndexCard>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    width: calc(50% - 8px);
    height: 100%;
    background-color: transparent;
    box-sizing: border-box;
  }
</style>

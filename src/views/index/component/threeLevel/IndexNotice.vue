<script lang="ts" setup>
  import { ref } from 'vue'
</script>

<template>
  <div class="notice-content">
    <span class="title">待办事项</span>
    <div class="content">
      <el-empty :image-size="80" description="暂无待办事项" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .notice-content {
    width: 100%;
    height: 220px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: center;
    overflow: hidden;
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
      .el-empty {
        margin-top: -20px;
      }
    }
  }
</style>

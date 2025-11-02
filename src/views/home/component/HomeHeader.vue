<script setup></script>

<template>
  <div class="position_box">
    <el-icon :size="20" color="#fff"><Location /></el-icon>
    <span class="text">当前位置：</span>
    <span class="text" style="font-weight: 500">广东省 广州市</span>
  </div>
</template>

<style lang="scss" scoped>
  .position_box {
    width: 300px;
    height: 40px;
    background-color: #66b1ff;
    border-radius: 20px;
    box-shadow: 2px 3px 5px #409eff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 20px;
    box-sizing: border-box;
    .text {
      margin-left: 5px;
      color: #fff;
      font-weight: bold;
    }
  }
</style>

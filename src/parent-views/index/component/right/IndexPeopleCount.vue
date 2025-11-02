<script setup>
  import { ref } from 'vue'
  import { useTransition } from '@vueuse/core'
  const outputValue = useTransition(9999, {
    duration: 1500,
  })
</script>

<template>
  <div class="people-content">
    <div class="people">
      <div style="background-color: #2d8cf0">
        <el-icon :size="24"><User /></el-icon>
      </div>
      <div>
        <text class="role">学生总数</text>
        <div>
          <text class="number1" style="color: #2d8cf0">4109</text>
          <text class="number2">人</text>
        </div>
      </div>
    </div>
    <div class="people">
      <div style="background-color: #64d572">
        <el-icon :size="24"><User /></el-icon>
      </div>
      <div>
        <text class="role">教师总数</text>
        <div>
          <text class="number1" style="color: #64d572">4109</text>
          <text class="number2">人</text>
        </div>
      </div>
    </div>
    <div class="people">
      <div style="background-color: #ff9600">
        <el-icon :size="24"><User /></el-icon>
      </div>
      <div>
        <text class="role">后勤总数</text>
        <div>
          <text class="number1" style="color: #ff9600">4109</text>
          <text class="number2">人</text>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .people-content {
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .people {
      width: 170px;
      height: 90px;
      display: flex;
      background-color: #f7f9fc;
      > div:nth-child(1) {
        width: 60px;
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      > div:nth-child(2) {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 0 20px 0 10px;
        box-sizing: border-box;
        .role {
          font-weight: 700;
          font-size: 15px;
        }
        > div {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          .number1 {
            font-size: 18px;
            margin-top: -3px;
            color: #303133;
            margin-right: 5px;
            font-weight: 600;
          }
          .number2 {
            font-size: 15px;
            color: #303133;
          }
        }
      }
    }
  }
</style>

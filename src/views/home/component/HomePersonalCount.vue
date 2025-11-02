<script setup></script>

<template>
  <div class="personal_count">
    <div class="personalItem">
      <div style="background-color: #2d8cf0">
        <el-icon :size="24"><User /></el-icon>
      </div>
      <div>
        <text class="role" style="color: #2d8cf0">学生</text>
        <text class="number">&nbsp;&nbsp;&nbsp;总人数：4289</text>
        <text class="online_number">在校人数：4109</text>
      </div>
    </div>
    <div class="personalItem">
      <div style="background-color: #64d572">
        <el-icon :size="24"><User /></el-icon>
      </div>
      <div>
        <text class="role" style="color: #64d572">教师</text>
        <text class="number">&nbsp;&nbsp;&nbsp;总人数：428</text>
        <text class="online_number">在校人数：345</text>
      </div>
    </div>
    <div class="personalItem">
      <div style="background-color: #f25e43">
        <el-icon :size="24"><User /></el-icon>
      </div>
      <div>
        <text class="role" style="color: #f25e43">后勤人员</text>
        <text class="number">&nbsp;&nbsp;&nbsp;总人数：16</text>
        <text class="online_number">在校人数：3</text>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .personal_count {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-between;
    .personalItem {
      width: 32%;
      height: 100px;
      display: flex;
      background-color: #f7f9fc;
      > div:nth-child(1) {
        width: 70px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      > div:nth-child(2) {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 10px;
        box-sizing: border-box;
        .role {
          font-weight: 700;
          font-size: 18px;
        }
        .number,
        .online_number {
          text-align: right;
          font-size: 15px;
          color: #303133;
        }
      }
    }
  }
</style>

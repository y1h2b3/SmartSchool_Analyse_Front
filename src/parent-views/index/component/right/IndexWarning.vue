<script lang="ts" setup>
  import { ref } from 'vue'
  const tableList = ref([
    { type: '学生', num: 723, dangerCount: '54' },
    { type: '教师', num: 67, dangerCount: '3' },
    { type: '后勤', num: 27, dangerCount: '0' },
  ])
</script>

<template>
  <div class="header-content">
    <h5 class="title">预警分析</h5>
    <el-table :data="tableList" size="small" show-header highlight-current-row flexible>
      <el-table-column fixed="left" label="职业" label-width="100" prop="type"></el-table-column>
      <el-table-column label="总数" label-width="100" prop="num"></el-table-column>
      <el-table-column label="高预警人数" label-width="100" prop="dangerCount"></el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
  .header-content {
    width: 100%;
    margin-top: 30px;
    .title {
      font-size: 15px;
    }
    .el-table {
      cursor: pointer;
      ::v-deep(th) {
        background-color: #3b99fb !important;
        color: #fff !important;
      }
      ::v-deep(td) {
        color: #000 !important;
      }
    }
  }
</style>

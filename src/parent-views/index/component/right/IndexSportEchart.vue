<script lang="ts" setup>
  import { ref } from 'vue'
  const tableList = ref([
    { key: '日均步数', value: '6576', max: '20000', suffix: '' },
    { key: '本月骑行', value: '1266', max: '20000', suffix: '/km' },
    { key: '有氧跑步', value: '356', max: '20000', suffix: '/km' },
    { key: '平板支撑', value: '8276', max: '20000', suffix: '/h' },
  ])
  const changeProgress = (item) => {
    return (item.value / item.max) * 100
  }
</script>

<template>
  <div class="header-content">
    <h5 class="title">本月运动健康记录</h5>
    <div class="box">
      <template v-for="item in tableList" :key="item.key">
        <el-progress
          type="circle"
          width="120"
          height="120"
          :percentage="changeProgress(item)"
          :stroke-width="6"
        >
          <template #default>
            <span class="percentage-value">{{ item.value }}{{ item.suffix }}</span>
            <span class="percentage-label">{{ item.key }}</span>
          </template>
        </el-progress>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .header-content {
    width: 100%;
    .title {
      font-size: 15px;
      margin: 0 0 25px 0;
    }
    .box {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      .el-progress {
        margin-top: 5px;
        .percentage-value {
          display: block;
          margin-top: 10px;
          font-weight: 700;
          font-size: 20px;
          color: #000;
        }
        .percentage-label {
          display: block;
          margin-top: 10px;
          font-size: 11px;
          color: #3b99fb;
        }
      }
    }
  }
</style>

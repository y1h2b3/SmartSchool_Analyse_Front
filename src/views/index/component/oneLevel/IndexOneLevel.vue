<script lang="ts" setup>
  import { ref } from 'vue'
  import IndexCard from './IndexCard.vue'
  import IndexProgress from './IndexProgress.vue'
  const option1 = ref({
    image: '今日步数',
    name: '全校今日平均步数',
    purpose: '暂无用途',
    allWeight: 10000,
    zbVal: 38.7,
    zbName: '今日步数',
    detailList: [
      { name: '今日平均步数', value: 3875 },
      { name: '昨日平均步数', value: 4571 },
    ],
  })
  const option2 = ref({
    image: '今日睡眠',
    name: '全校今日平均睡眠',
    purpose: '暂无用途',
    allWeight: 8,
    zbVal: 77.5,
    zbName: '今日睡眠',
    detailList: [
      { name: '今日平均睡眠', value: '6.2小时' },
      { name: '昨日平均睡眠', value: '6.5小时' },
    ],
  })
</script>

<template>
  <div class="content">
    <!-- 左侧：欢迎卡片 -->
    <div class="card">
      <IndexCard></IndexCard>
    </div>
    <!-- 右侧：健康进度条 -->
    <div class="progress-box">
      <div class="progress">
        <IndexProgress :option="option1"></IndexProgress>
      </div>
      <div class="progress">
        <IndexProgress :option="option2"></IndexProgress>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @media (max-width: 768px) {
    .content {
      flex-direction: column;
      .card {
        width: 100% !important;
        margin-bottom: 15px;
      }
      .progress-box {
        width: 100% !important;
        flex-direction: column;
        .progress {
          width: 100% !important;
          margin-bottom: 15px;
        }
      }
    }
  }
  .content {
    width: 100%;
    height: 240px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .card {
      width: 42%;
    }
    .progress-box {
      width: calc(58% - 14px);
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .progress {
        width: 49%;
      }
    }
  }
</style>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue'
  import IndexProgress from '../../index/component/oneLevel/IndexProgress.vue'
  import BodyTargetEchart from './BodyTargetEchart.vue'
  import SleepQualityEchart from './SleepQualityEchart.vue'
  import HeartRateEchart from './HeartRateEchart.vue'
  const dialogVisible = ref<boolean>(false)
  const props = defineProps(['selectDialogVisible', 'rowData'])
  watch(
    () => props.selectDialogVisible,
    () => {
      dialogVisible.value = true
    },
  )
  watch(
    () => props.rowData,
    () => {
      healthData.value = props.rowData
      console.log(props.rowData)
      option1.value.detailList[0].value = props.rowData.step
      option1.value.zbVal = props.rowData.step / 100 > 100 ? 100 : props.rowData.step / 100
      option2.value.detailList[0].value = props.rowData.sleepTimeTotal + '小时'
      option2.value.zbVal = ((Number(props.rowData.sleepTimeTotal) * 60) / 4.8).toFixed(2)
      option2.value.zbVal = option2.value.zbVal > 100 ? 100 : option2.value.zbVal
      option3.value.detailList[0].value = props.rowData.calorie
      option3.value.zbVal = (props.rowData.calorie / 20).toFixed(2)
    },
  )
  const healthData = ref(null)
  const option1 = ref({
    image: '今日步数',
    name: '今日步数',
    purpose: '暂无用途',
    allWeight: 10000,
    zbVal: 64,
    zbName: '今日步数',
    detailList: [
      { name: '今日步数', value: 6417 },
      { name: '昨日步数', value: 8752 },
    ],
  })
  const option2 = ref({
    image: '今日睡眠',
    name: '今日睡眠',
    purpose: '暂无用途',
    allWeight: 8,
    zbVal: 75,
    zbName: '今日睡眠',
    detailList: [
      { name: '今日睡眠', value: '5小时' },
      { name: '昨日睡眠', value: '6.5小时' },
    ],
  })
  const option3 = ref({
    image: '今日卡路里',
    name: '今日卡路里',
    purpose: '暂无用途',
    allWeight: 2000,
    zbVal: 100,
    zbName: '今日卡路里',
    detailList: [
      { name: '今日卡路里', value: '372' },
      { name: '昨日卡路里', value: '500' },
    ],
  })
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    class="el-dialog"
    top="0"
    align-center
    :show-close="false"
    left
    width="78%"
  >
    <template #header>
      <div class="el-dialog__header">
        <div class="header">
          <span>记录日期：{{ props.rowData.measureTime.substr(0, 10) }}</span>
        </div>
        <div>
          <el-button type="danger" @click="dialogVisible = !dialogVisible">
            <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
            关闭
          </el-button>
        </div>
      </div>
    </template>
    <div class="com">
      <div class="one-box">
        <div class="progress">
          <IndexProgress :option="option1"></IndexProgress>
        </div>
        <div class="progress">
          <IndexProgress :option="option2"></IndexProgress>
        </div>
        <div class="progress">
          <IndexProgress :option="option3"></IndexProgress>
        </div>
      </div>
      <div class="two-box">
        <div class="bodyTarget">
          <span class="title">今日身体指标分析</span>
          <div class="content">
            <BodyTargetEchart :healthData="healthData"></BodyTargetEchart>
          </div>
        </div>
        <div class="bodyTarget">
          <span class="title">今日睡眠质量分析</span>
          <div class="content">
            <SleepQualityEchart :healthData="healthData"></SleepQualityEchart>
          </div>
        </div>
        <div class="bodyTarget">
          <span class="title">今日静息心率分析</span>
          <div class="content">
            <HeartRateEchart :healthData="healthData"></HeartRateEchart>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
  .el-dialog {
    .el-dialog__header {
      height: 5px;
      padding: 0px !important;
      font-weight: bold;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      > div:nth-child(1) {
        display: flex;
        justify-content: flex-start;
      }
      > div:nth-child(2) {
        flex: 1;
        display: flex;
        margin-right: -30px;
        justify-content: flex-end;
        .el-button {
          width: 70px;
          height: 30px;
        }
      }
    }
    .com {
      width: 100%;
      display: flex;
      flex-direction: column;
      .one-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .progress {
          width: 350px;
          margin-bottom: 15px;
        }
      }
      .two-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .bodyTarget {
          width: 350px;
          height: 250px;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-content: center;
          box-shadow: -4.5px 0 12px 3px rgba(0, 0, 0, 0.1);
          .title {
            width: 100%;
            height: 42px;
            padding: 10px;
            border-bottom: 1px solid #e1e1e1;
            box-sizing: border-box;
            font-weight: 700;
          }
          .content {
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
          }
        }
      }
    }
  }
</style>

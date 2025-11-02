<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import NoticeWarning from './NoticeWarning.vue'
  import NoticeRun from './NoticeRun.vue'
  import SleepEchart from './SleepEchart.vue'
  const dialogVisible = ref<boolean>(false) // 新增弹窗是否展示
  const props = defineProps(['userInfoRules', 'selectDialogVisible', 'rowData'])
  watch(
    () => props.selectDialogVisible,
    () => {
      dialogVisible.value = true
    },
  )
  const grade = ref(3)
  watch(
    () => props.rowData,
    (val) => {
      console.log(val)
      if (val.level === '高') grade.value = 3
      else if (val.level === '中') grade.value = 2
      else grade.value = 1
    },
  )
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    class="el-dialog"
    top="0"
    align-center
    :show-close="false"
    left
    width="70%"
  >
    <template #header>
      <div class="el-dialog__header">
        <div class="header">
          <span>当前预警等级：</span>
          <el-tag type="warning" v-if="grade == 1">低</el-tag>
          <el-tag type="primary" v-if="grade == 2">中</el-tag>
          <el-tag type="danger" v-if="grade == 3">高</el-tag>
        </div>
        <div>
          <el-button type="danger" @click="dialogVisible = !dialogVisible">
            <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
            关闭
          </el-button>
        </div>
      </div>
    </template>
    <div class="top">
      <el-avatar
        shape="square"
        :size="161"
        fit="cover"
        src="/src/assets/image/avatar.png"
        style="background-color: #fff"
      />
      <el-descriptions size="default" column="2" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">姓名</div>
          </template>
          {{ props.rowData.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">性别</div>
          </template>
          {{ props.rowData.sex }}
        </el-descriptions-item>
        <el-descriptions-item label="班级: ">
          <template #label>
            <div class="cell-item">班级</div>
          </template>
          高二(3)班
        </el-descriptions-item>
        <el-descriptions-item label="学号: ">
          <template #label>
            <div class="cell-item">学号</div>
          </template>
          {{ props.rowData.userId }}
        </el-descriptions-item>
        <el-descriptions-item label="联系方式: ">
          <template #label>
            <div class="cell-item">联系方式</div>
          </template>
          {{ props.rowData.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 检测结果 </div>
          </template>
          {{ props.rowData.readingValue }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 检测建议 </div>
          </template>
          {{ props.rowData.recommendedAction }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 检测日期 </div>
          </template>
          {{ props.rowData.time }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="bottom">
      <div class="box left">
        <div class="header">近一周健康情况分析</div>
        <NoticeWarning :dialogVisible="dialogVisible"></NoticeWarning>
      </div>
      <div class="box right">
        <div class="header">近一周睡眠情况分析</div>
        <SleepEchart :dialogVisible="dialogVisible"></SleepEchart>
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
    .top {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .el-descriptions {
        flex: 1;
        margin-left: 15px;
        .cell-item {
          display: flex;
          align-items: center;
          .el-icon {
            margin-right: 5px;
          }
        }
      }
    }
    .bottom {
      width: 100%;
      height: 300px;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .header {
        width: 100%;
        height: 45px;
        display: flex;
        align-items: center;
        padding-left: 30px;
        box-sizing: border-box;
        border-bottom: 1px solid #c3c3c3;
        font-size: 15px;
        font-weight: 600;
      }
      .box {
        width: calc(50% - 20px);
        min-width: 370px;
        height: 100%;
        border-radius: 10px 10px 10px 10px;
        border: 1px solid #c3c3c3;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>

<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue'
  import HealthDataDetailDialog from './HealthDataDetailDialog.vue'
  import { searchStudentUserHealthType } from '@/api/parent/health.ts'
  import { useUserStore } from '../../../store/modules/user'
  import dayjs from 'dayjs'
  const UserStore = useUserStore()
  // 用户是否屏幕放大
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(20)
  const total = ref<number>(0)
  const selectDialogVisible = ref<boolean>(false) // 查看详情是否展示
  const isTwoFuzzy = ref(false)
  const rowData = ref({})
  const isLoading = ref<boolean>(true) // 表格是否加载
  const tableList = ref([])
  const dateValue = ref(null) // 日期时间
  /**
   * 打开弹窗
   */
  const openSelectDialog = (row) => {
    // 开启弹窗
    rowData.value = row
    selectDialogVisible.value = !selectDialogVisible.value
  }
  watch(dateValue, (val) => {
    fuzzyFormData.startTime = dayjs(val[0]).format('YYYY-MM-DD HH:mm:ss')
    fuzzyFormData.endTime = dayjs(val[1]).format('YYYY-MM-DD HH:mm:ss')
    console.log(fuzzyFormData)
  })
  // 查询关键字
  const fuzzyFormData = reactive({
    startTime: '',
    endTime: '',
  })
  // 监听当前页显示条数
  const handleSizeChange = (value: number) => {
    pageSize.value = value
    freshData()
  }
  // 监听当前页数
  const handleCurrentChange = (value: number) => {
    currentPage.value = value
    freshData()
  }
  // 刷新数据
  const freshData = () => {
    isLoading.value = true
    setTimeout(async () => {
      const current = currentPage.value
      const size = pageSize.value
      const studentId = UserStore.userInfo.studentId
      const resp = await searchStudentUserHealthType(current, size, studentId)
      tableList.value = resp.records
      for (let i = 0; i < tableList.value.length; i++) {
        tableList.value[i].userName = UserStore.userInfo.studentName
      }
      total.value = resp.total
      isLoading.value = false
    }, 500)
  }
  // 重置数据
  const reset = () => {
    fuzzyFormData.startTime = ''
    fuzzyFormData.endTime = ''
    freshData()
  }
  const getTableHeight = ref(0)
  watch(
    () => SettingStore.isFull,
    (val) => {
      if (val) getTableHeight.value = 645
      else getTableHeight.value = 520
      // if (isTwoFuzzy.value) getTableHeight.value -= 50
    },
    { immediate: true },
  )
  watch(
    isTwoFuzzy,
    () => {
      if (SettingStore.isFull) getTableHeight.value = 645
      else getTableHeight.value = 520
      // if (val) getTableHeight.value -= 50
    },
    { immediate: true },
  )
  // 初始化数据
  onMounted(() => {
    freshData()
  })
</script>

<template>
  <div class="left-content">
    <HealthDataDetailDialog
      :selectDialogVisible="selectDialogVisible"
      :rowData="rowData"
    ></HealthDataDetailDialog>
    <el-scrollbar class="top" :style="{ height: `${isTwoFuzzy ? 70 : 70}px` }">
      <el-form class="el-form" :model="fuzzyFormData">
        <el-form-item label="记录日期" label-width="80">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label-width="40">
          <el-button type="primary" @click="freshData">
            <el-icon style="margin-right: 3px"><Search /></el-icon>查询
          </el-button>
        </el-form-item>
        <el-form-item label-width="20">
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item label-width="200">
          <div @click="isTwoFuzzy = !isTwoFuzzy" class="isTwoFuzzy">
            <span>{{ isTwoFuzzy ? '折叠' : '展开' }}</span>
            <el-icon v-if="isTwoFuzzy"><ArrowUp /></el-icon>
            <el-icon v-else><ArrowDown /></el-icon>
          </div>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="table-container">
      <el-table
        v-loading="isLoading"
        :data="tableList"
        class="table"
        :style="{ height: `${getTableHeight}px !important` }"
      >
        <el-table-column prop="measureTime" label="记录日期" width="165"></el-table-column>
        <el-table-column prop="userName" label="姓名" width="80"></el-table-column>
        <el-table-column prop="height" label="身高(cm)" width="90"></el-table-column>
        <el-table-column prop="weight" label="体重(kg)" width="90"></el-table-column>
        <el-table-column prop="bmi" label="BMI" width="80"></el-table-column>
        <el-table-column prop="fatPercentage" label="体脂率(%)" width="90"></el-table-column>
        <el-table-column prop="type" label="健康状态" width="80"></el-table-column>
        <el-table-column
          prop="sleepTimeTotal"
          label="累计睡眠时长(时)"
          width="135"
        ></el-table-column>
        <el-table-column
          prop="deepSleepTotal"
          label="累计深睡时长(时)"
          width="135"
        ></el-table-column>
        <el-table-column
          prop="lightSleepTotal"
          label="累计浅睡时长(时)"
          width="135"
        ></el-table-column>
        <el-table-column
          prop="wakeTimeTotal"
          label="累计清醒时长(时)"
          width="135"
        ></el-table-column>
        <el-table-column prop="listSleepTime" label="昨晚入睡时间" width="120"></el-table-column>
        <el-table-column prop="todayWakeupTime" label="今日起床时间" width="120"></el-table-column>
        <el-table-column prop="step" label="步数(步)" width="80"></el-table-column>
        <el-table-column prop="walkingDistance" label="步行距离(km)" width="115"></el-table-column>
        <el-table-column prop="walkingTime" label="步行时长(时)" width="110"></el-table-column>
        <el-table-column prop="calorie" label="卡路里" width="80"></el-table-column>
        <el-table-column
          prop="meanRestingHeartRate"
          label="平均静息心率(次/分)"
          width="155"
        ></el-table-column>
        <el-table-column
          prop="restingHeartRateMax"
          label="静息心率最高(次/分)"
          width="155"
        ></el-table-column>
        <el-table-column
          prop="restingHeartRateMin"
          label="静息心率最低(次/分)"
          width="155"
        ></el-table-column>
        <el-table-column prop="spo2" label="血氧饱和度(%)" width="120"></el-table-column>
        <el-table-column prop="temperature" label="体温(摄氏度)" width="105"></el-table-column>
        <el-table-column fixed="right" label="操作" width="110">
          <template #default="scope">
            <div class="optionStyle">
              <button
                link
                size="mini"
                class="button primaryStyle"
                @click="openSelectDialog(scope.row)"
              >
                <el-icon>
                  <search />
                </el-icon>
                详细信息
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="demo-pagination-block">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          small
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .left-content {
    width: 100%;
    box-shadow: none;
    padding: 0px;
    background-color: #eceef1;
  }
  .top {
    height: 70px;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 18px 40px 0 20px;
    box-sizing: border-box;
    .el-form {
      display: flex;
      justify-content: flex-start;
      .el-form-item {
        margin: 0px;
        .isTwoFuzzy {
          cursor: pointer;
          color: #409eff;
          width: 45px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
  .bottom {
    width: 100%;
    height: 50px;
    padding-top: 20px;
    box-sizing: border-box;
  }
  .table-container {
    width: 100%;
    // padding: 0 15px;
    box-sizing: border-box;
    margin-top: 17px;
    background-color: #fff;
    .table {
      width: 100%;
      // padding-top: 15px;
      box-sizing: border-box;
      .optionStyle {
        width: 120px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .button {
          width: 85px;
          height: 25px;
          color: #fff;
          font-size: 11px;
          border: none;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        .primaryStyle {
          border-radius: 3px;
          background-color: #409eff;
        }
        .primaryStyle:hover {
          opacity: 0.7;
        }
        .dangerStyle {
          border-radius: 3px;
          background-color: #f56c6c;
        }
        .dangerStyle:hover {
          opacity: 0.7;
        }
      }
    }
    .demo-pagination-block {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      background-color: #fff;
    }
  }
</style>

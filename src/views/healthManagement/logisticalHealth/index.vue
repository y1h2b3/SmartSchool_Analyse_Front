<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    getLogisticalHealthPage,
    deleteLogisticalHealthById,
  } from '@/api/admin/healthManagement/logistical.ts'
  import DialogExportExcel from '@/components/ExportExcel/dialogExportExcel.vue'
  // 用户是否屏幕放大
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(20)
  const total = ref<number>(0)
  // 当前表格勾选数据
  const selectedRows = ref([])
  // 是否展示导出Excel窗口
  const exportExcelDialogVisible = ref(false)
  const rowData = ref({})
  const isLoading = ref<boolean>(true) // 表格是否加载
  const tableList = ref([])
  const tableAllList = ref([])
  const fuzzyFormData = reactive({
    userId: '',
    userName: '',
    dateValue: '',
  })
  // 导出表格格式
  const column = [
    { name: 'order', label: '序号' },
    { name: 'measureTime', label: '记录日期' },
    { name: 'userId', label: '后勤工号' },
    { name: 'userName', label: '姓名' },
    { name: 'height', label: '身高(cm)' },
    { name: 'weight', label: '体重(kg)' },
    { name: 'bmi', label: 'BMI' },
    { name: 'fatPercentage', label: '体脂率' },
    { name: 'type', label: '健康状态' },
    { name: 'sleepTimeTotal', label: '累计睡眠时长(时)' },
    { name: 'deepSleepTotal', label: '累计深睡时长(时)' },
    { name: 'lightSleepTotal', label: '累计浅睡时长(时)' },
    { name: 'wakeTimeTotal', label: '累计清醒时长(时)' },
    { name: 'listSleepTime', label: '昨晚入睡时间' },
    { name: 'todayWakeupTime', label: '今日起床时间' },
    { name: 'step', label: '步数(步)' },
    { name: 'walkingDistance', label: '步行距离(km)' },
    { name: 'walkingTime', label: '步行时长(时)' },
    { name: 'calorie', label: '卡路里' },
    { name: 'meanRestingHeartRate', label: '平均静息心率(次/分)' },
    { name: 'restingHeartRateMax', label: '静息心率最高(次/分)' },
    { name: 'restingHeartRateMin', label: '静息心率最低(次/分)' },
    { name: 'spo2', label: '血氧饱和度(%)' },
    { name: 'temperature', label: '温度(摄氏度)' },
  ]
  // 批量删除
  const handleDeleteListClick = () => {
    ElMessageBox.confirm('请确认要批量删除该组数据 ?', '健康管理', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      if (!selectedRows.value.length) {
        ElMessage.error('暂无数据可删除')
        return
      }
      selectedRows.value.map(async (item) => {
        // 调用删除接口
        await deleteLogisticalHealthById(item.userId)
      })
      // 刷新数据
      freshData()
      // 确认删除
      ElMessage.success('删除成功')
    })
  }
  // 删除操作
  const handleDeleteOneClick = (row) => {
    ElMessageBox.confirm('请确认要删除该数据 ?', '健康管理', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 确认删除
      await deleteLogisticalHealthById(row.userId)
      // 刷新数据
      freshData()
      ElMessage.success('删除成功')
    })
  }
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
  // 监听表格勾选的数量
  const handleSelectionChange = (selection) => {
    selectedRows.value = selection
  }
  // 重置查询条件
  const reset = () => {
    fuzzyFormData.userId = ''
    fuzzyFormData.userName = ''
    // 刷新数据
    freshData()
  }
  // 刷新数据
  const freshData = () => {
    isLoading.value = true
    setTimeout(async () => {
      const current = currentPage.value
      const size = pageSize.value
      const id = fuzzyFormData.userId
      const name = fuzzyFormData.userName
      const resp = await getLogisticalHealthPage(current, size, id, name)
      tableList.value = resp.records
      let i = 0
      tableList.value.map((item) => {
        item.order = i++ + 1 + (currentPage.value - 1) * pageSize.value
      })
      total.value = resp.total
      isLoading.value = false
    }, 500)
  }
  /**
   * 监听导出按钮
   */
  const handleExportExcel = async () => {
    // 获取全部数据
    const resp = await getLogisticalHealthPage(1, total.value)
    tableAllList.value = resp.records
    let i = 0
    tableAllList.value.map((item) => {
      item.order = i++ + 1 + (currentPage.value - 1) * pageSize.value
    })
    // 开启弹窗
    exportExcelDialogVisible.value = !exportExcelDialogVisible.value
  }
  // 初始化数据
  onMounted(() => {
    freshData()
  })
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner content">
      <DialogExportExcel
        :exportExcelDialogVisible="exportExcelDialogVisible"
        :column="column"
        :data="tableList"
        :dataAll="tableAllList"
      ></DialogExportExcel>
      <div class="fuzzy_query">
        <div class="top">
          <el-form :model="fuzzyFormData" label-width="auto" class="form">
            <el-form-item label="后勤工号" width="120" class="form-item">
              <el-input type="text" class="input" v-model="fuzzyFormData.userId" />
            </el-form-item>
            <el-form-item label="姓名" width="120" class="form-item">
              <el-input type="text" class="input" v-model="fuzzyFormData.userName" />
            </el-form-item>
            <el-form-item label="记录日期" label-width="70">
              <el-date-picker
                v-model="fuzzyFormData.dateValue"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                style="width: 210px"
              />
            </el-form-item>
            <el-form-item class="form-item" label-width="50">
              <div class="search-btn">
                <el-button type="primary" @click="freshData">查询</el-button>
                <el-button type="default" @click="reset">重置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table-container">
        <div class="header">
          <el-button type="danger" @click="handleDeleteListClick">
            <el-icon style="margin-right: 3px">
              <delete />
            </el-icon>
            批量删除
          </el-button>
          <el-button type="success" class="export_excel" @click="handleExportExcel">
            <el-icon style="margin-right: 3px">
              <Download />
            </el-icon>
            导出 Excel
          </el-button>
        </div>
        <el-table
          v-loading="isLoading"
          :data="tableList"
          class="table"
          :style="{ height: `${SettingStore.isFull ? 575 : 450}px !important` }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed type="selection" width="40" />
          <el-table-column prop="order" label="序号" width="60"></el-table-column>
          <el-table-column prop="measureTime" label="记录日期" width="170"></el-table-column>
          <el-table-column prop="userId" label="后勤工号" width="140"></el-table-column>
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
          <el-table-column
            prop="todayWakeupTime"
            label="今日起床时间"
            width="120"
          ></el-table-column>
          <el-table-column prop="step" label="步数(步)" width="80"></el-table-column>
          <el-table-column
            prop="walkingDistance"
            label="步行距离(km)"
            width="115"
          ></el-table-column>
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
          <el-table-column fixed="right" label="操作" width="78">
            <template #default="scope">
              <div class="optionStyle">
                <button
                  link
                  size="mini"
                  class="button dangerStyle"
                  @click="handleDeleteOneClick(scope.row)"
                >
                  <el-icon>
                    <delete />
                  </el-icon>
                  删除
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
  </div>
</template>

<style lang="scss" scoped>
  .content {
    width: 100%;
    box-shadow: none;
    padding: 0px;
    background-color: #eceef1;
  }
  .fuzzy_query {
    width: 100%;
    padding: 0 15px;
    padding-top: 20px;
    box-sizing: border-box;
    background-color: #fff;
    .top {
      height: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .form {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .form-item {
          margin-right: 50px;
          .input {
            width: 200px;
          }
        }
      }
    }
    .bottom {
      height: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .form {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .form-item {
          margin-right: 50px;
          .input {
            width: 200px;
          }
        }
      }
    }
  }
  .table-container {
    width: 100%;
    height: 88%;
    padding: 0 15px;
    box-sizing: border-box;
    margin-top: 17px;
    background-color: #fff;
    .header {
      width: 100%;
      height: 70px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .table {
      width: 100%;
      height: 450px;
      .optionStyle {
        width: 120px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .button {
          width: 55px;
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

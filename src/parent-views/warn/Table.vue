<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue'
  import {
    getAllStudentHealthWarningNotifications,
    getWarnById,
  } from '@/api/admin/alertNotice/student.ts'
  import DialogExportExcel from '@/components/ExportExcel/dialogExportExcel.vue'
  import SelectDialog from './SelectDialog.vue'
  import dayjs from 'dayjs'
  import { useUserStore } from '@/store/modules/user'
  const UserStore = useUserStore()
  // 用户是否屏幕放大
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(10)
  const total = ref<number>(0)
  const selectDialogVisible = ref<boolean>(false) // 查看弹窗是否展示
  const isTwoFuzzy = ref(false)
  // 是否展示导出Excel窗口
  const exportExcelDialogVisible = ref(false)
  const rowData = ref({})
  const isLoading = ref<boolean>(true) // 表格是否加载
  const tableList = ref([])
  const dateValue = ref(null) // 日期时间
  watch(dateValue, (val) => {
    fuzzyFormData.startTime = dayjs(val[0]).format('YYYY-MM-DD HH:mm:ss')
    fuzzyFormData.endTime = dayjs(val[1]).format('YYYY-MM-DD HH:mm:ss')
  })
  // 查询关键字
  const fuzzyFormData = reactive({
    id: '',
    name: '',
    status: '',
    startTime: '',
    endTime: '',
  })
  // 预警等级
  const options = [
    { value: '', label: '全部' },
    { value: '高', label: '高' },
    { value: '中', label: '中' },
    { value: '低', label: '低' },
  ]
  // 导出表格格式
  const column = [
    { name: 'order', label: '序号' },
    { name: 'notificationId', label: '通知ID' },
    { name: 'userId', label: '学生学号' },
    { name: 'userName', label: '学生姓名' },
    { name: 'userClazzOrPost', label: '班级' },
    { name: 'sex', label: '性别' },
    { name: 'level', label: '预警等级' },
    { name: 'phone', label: '联系电话' },
    { name: 'readingValue', label: '检测结果' },
    { name: 'recommendedAction', label: '检测建议' },
    { name: 'time', label: '检测时间' },
  ]
  const openSelectDialog = (row) => {
    rowData.value = row
    console.log(rowData.value)
    // 开启弹窗
    selectDialogVisible.value = !selectDialogVisible.value
  }
  const selectedRows = ref([])
  // 监听表格勾选的数量
  const handleSelectionChange = (selection) => {
    selectedRows.value = selection
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
  const formatDate = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }
  // 刷新数据
  const freshData = () => {
    isLoading.value = true
    setTimeout(async () => {
      const id = UserStore.userInfo?.studentId
      const resp = await getWarnById(id)
      console.log(resp)
      tableList.value = resp
      for (let i = 0; i < tableList.value.length; i++) {
        tableList.value[i].order = (currentPage.value - 1) * pageSize.value + i + 1
        tableList.value[i].time = formatDate(tableList.value[i].time)
        tableList.value[
          i
        ].readingValue = `${tableList.value[i].readingKey}: ${tableList.value[i].readingValue}`
      }
      /* total.value = resp.total */
      total.value = tableList.value.length
      console.log(tableList.value)
      isLoading.value = false
    }, 500)
  }
  // 重置数据
  const reset = () => {
    fuzzyFormData.id = ''
    fuzzyFormData.name = ''
    fuzzyFormData.status = ''
    fuzzyFormData.startTime = ''
    fuzzyFormData.endTime = ''
    dateValue.value = ''
    freshData()
  }
  const getTableHeight = ref(0)
  watch(
    () => SettingStore.isFull,
    (val) => {
      if (val) getTableHeight.value = 585
      else getTableHeight.value = 560
      if (isTwoFuzzy.value) getTableHeight.value -= 50
    },
    { immediate: true },
  )
  watch(
    isTwoFuzzy,
    (val) => {
      if (SettingStore.isFull) getTableHeight.value = 585
      else getTableHeight.value = 450
      if (val) getTableHeight.value -= 50
    },
    { immediate: true },
  )
  // 初始化数据
  onMounted(() => {
    freshData()
  })
  /**
   * 监听导出按钮
   */
  const tableAllList = ref([])
  const handleExportExcel = async () => {
    // 获取全部数据
    const id = UserStore.userInfo?.studentId
    const resp = await getWarnById(id)
    tableAllList.value = resp
    for (let i = 0; i < tableAllList.value.length; i++) {
      tableAllList.value[i].order = (currentPage.value - 1) * pageSize.value + i + 1
      tableAllList.value[i].time = formatDate(tableAllList.value[i].time)
    }
    // 开启弹窗
    exportExcelDialogVisible.value = !exportExcelDialogVisible.value
  }
  const getRecommendedAction = (recommendedAction) => {
    if (recommendedAction.length > 12) {
      return recommendedAction.substr(0, 12) + '...'
    }
    return recommendedAction
  }
  const getStatusType = (level) => {
    if (level === '低') {
      return 'warning'
    } else if (level === '中') {
      return 'primary'
    } else if (level === '高') {
      return 'danger'
    }
  }
</script>

<template>
  <div class="right-content">
    <DialogExportExcel
      :exportExcelDialogVisible="exportExcelDialogVisible"
      :column="column"
      :data="tableList"
      :dataAll="tableAllList"
    ></DialogExportExcel>
    <SelectDialog
      :selectDialogVisible="selectDialogVisible"
      :rowData="rowData"
      @freshData="freshData"
    >
    </SelectDialog>
    <el-scrollbar class="top" style="height: 70px">
      <el-form class="el-form" :model="fuzzyFormData">
        <el-form-item label="预警等级" label-width="80" class="el-form-item" prop="type">
          <el-select v-model="fuzzyFormData.status" style="width: 90px">
            <template v-for="item in options" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="检测周期" label-width="100">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 210px"
          />
        </el-form-item>
        <el-form-item label-width="35">
          <el-button type="primary" @click="freshData">
            <el-icon style="margin-right: 3px"><Search /></el-icon>查询
          </el-button>
        </el-form-item>
        <el-form-item label-width="20">
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="table-container">
      <div class="header">
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
        :style="{ height: `${getTableHeight}px !important` }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="order" label="序号" width="60"></el-table-column>
        <el-table-column prop="time" label="检测时间" width="180"></el-table-column>
        <el-table-column prop="notificationId" label="通知ID" width="120"></el-table-column>
        <el-table-column prop="userId" label="学生学号" width="140"></el-table-column>
        <el-table-column prop="name" label="学生姓名" width="90"></el-table-column>
        <el-table-column prop="sex" label="性别" width="60"></el-table-column>
        <el-table-column label="预警等级" width="80">
          <template v-slot="{ row }">
            <el-tag :type="getStatusType(row.level)" size="small" style="width: 40px">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="130"></el-table-column>
        <el-table-column prop="readingValue" label="检测结果" width="120"></el-table-column>
        <el-table-column prop="recommendedAction" label="检测建议" width="220">
          <template v-slot="{ row }">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="row.recommendedAction"
              placement="bottom-start"
            >
              <span>{{ getRecommendedAction(row.recommendedAction) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template #default="scope">
            <div class="optionStyle">
              <button
                link
                size="mini"
                class="button primaryStyle"
                @click="openSelectDialog(scope.row)"
              >
                <el-icon>
                  <edit />
                </el-icon>
                详情
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
  .right-content {
    width: calc(100%);
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

<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    getAllTeacherHealthWarningNotifications,
    getPageTeacherSearchHealthWarningNotifications,
    deleteTeacherHealthWarningNotifications,
  } from '@/api/admin/alertNotice/teacher.ts'
  import DialogExportExcel from '@/components/ExportExcel/dialogExportExcel.vue'
  import SelectDialog from './SelectDialog.vue'
  import dayjs from 'dayjs'
  // 用户是否屏幕放大
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(20)
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
    { name: 'userId', label: '教师工号' },
    { name: 'userName', label: '教师姓名' },
    { name: 'userClazzOrPost', label: '职位' },
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
  // 批量删除
  const handleDeleteListClick = () => {
    ElMessageBox.confirm('请确认要批量删除该组数据 ?', '预警管理', {
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
        await deleteTeacherHealthWarningNotifications(item.userId)
      })
      // 刷新数据
      freshData()
      ElMessage.success('删除成功')
    })
  }
  // 删除操作
  const handleDeleteOneClick = (index: number) => {
    ElMessageBox.confirm('请确认要删除该数据 ?', '预警管理', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 确认删除
      // 调用删除接口
      const id = tableList.value[index].userId
      await deleteTeacherHealthWarningNotifications(id)
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
  const formatDate = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD hh:mm:ss')
  }
  // 刷新数据
  const freshData = () => {
    isLoading.value = true
    setTimeout(async () => {
      const current = currentPage.value
      const size = pageSize.value
      const id = fuzzyFormData.id
      const level = fuzzyFormData.status
      const startTime = fuzzyFormData.startTime
      const endTime = fuzzyFormData.endTime
      const resp = await getPageTeacherSearchHealthWarningNotifications(
        current,
        size,
        id,
        level,
        startTime,
        endTime,
      )
      tableList.value = resp.records
      console.log(tableList.value)
      for (let i = 0; i < tableList.value.length; i++) {
        tableList.value[i].readingValue = tableList.value[i].type + tableList.value[i].readingValue
        tableList.value[i].order = (currentPage.value - 1) * pageSize.value + i + 1
        tableList.value[i].time = formatDate(tableList.value[i].time)
      }
      total.value = resp.total
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
      else getTableHeight.value = 560
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
    const resp = await getAllTeacherHealthWarningNotifications()
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
    <el-scrollbar class="top" :style="{ height: `${isTwoFuzzy ? 120 : 70}px` }">
      <el-form class="el-form" :model="fuzzyFormData">
        <el-form-item label="教师工号" label-width="70" class="el-form-item" prop="id">
          <el-input v-model="fuzzyFormData.id" placeholder="请输入教师工号" style="width: 150px" />
        </el-form-item>
        <el-form-item label="预警等级" label-width="100" class="el-form-item" prop="type">
          <el-select v-model="fuzzyFormData.status" style="width: 120px">
            <template v-for="item in options" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label-width="25">
          <el-button type="primary" @click="freshData">
            <el-icon style="margin-right: 3px"><Search /></el-icon>查询
          </el-button>
        </el-form-item>
        <el-form-item label-width="20">
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item label-width="20">
          <div @click="isTwoFuzzy = !isTwoFuzzy" class="isTwoFuzzy">
            <span>{{ isTwoFuzzy ? '折叠' : '展开' }}</span>
            <el-icon v-if="isTwoFuzzy"><ArrowUp /></el-icon>
            <el-icon v-else><ArrowDown /></el-icon>
          </div>
        </el-form-item>
      </el-form>
      <el-form v-if="isTwoFuzzy" class="bottom">
        <el-form-item label="周期" label-width="70">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 210px"
          />
        </el-form-item>
      </el-form>
    </el-scrollbar>
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
        :style="{ height: `${getTableHeight}px !important` }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="40" />
        <el-table-column prop="time" label="检测时间" width="165"></el-table-column>
        <el-table-column prop="userId" label="教师工号" width="140"></el-table-column>
        <el-table-column prop="userName" label="教师姓名" width="80"></el-table-column>
        <el-table-column label="预警等级" width="80">
          <template v-slot="{ row }">
            <el-tag :type="getStatusType(row.level)" size="small" style="width: 40px">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="readingValue" label="检测结果" width="200"></el-table-column>
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
        <el-table-column prop="userPost" label="职位" width="100"></el-table-column>
        <el-table-column prop="sex" label="性别" width="60"></el-table-column>
        <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
        <el-table-column prop="notificationId" label="通知ID" width="120"></el-table-column>
        <el-table-column fixed="right" label="操作" width="145">
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
              <button
                link
                size="mini"
                class="button dangerStyle"
                @click="handleDeleteOneClick(scope.$index)"
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
</template>

<style lang="scss" scoped>
  .right-content {
    width: calc(70% - 18px);
    box-shadow: none;
    padding: 0px;
    margin-left: 18px;
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

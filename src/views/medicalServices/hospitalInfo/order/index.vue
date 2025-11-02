<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import DialogExportExcel from '@/components/ExportExcel/dialogExportExcel.vue'
  import {
    getSearchStaffOrders,
    deleteStaffOrders,
    getAllStaffOrders,
    updateStaffOrders,
  } from '@/api/admin/medicalServices/staffOrders.ts'
  import dayjs from 'dayjs'
  // 用户是否屏幕放大
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  const tableAllList = ref([])
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(20)
  const total = ref<number>(0)
  const isTwoFuzzy = ref(false)
  // 是否展示导出Excel窗口
  const exportExcelDialogVisible = ref(false)
  const isLoading = ref<boolean>(true) // 表格是否加载
  const tableList = ref([])
  const dateValue = ref(null) // 日期时间
  watch(dateValue, (val) => {
    fuzzyFormData.startTime = dayjs(val[0]).format('YYYY-MM-DD HH:mm:ss')
    fuzzyFormData.endTime = dayjs(val[1]).format('YYYY-MM-DD HH:mm:ss')
    console.log(fuzzyFormData)
  })
  // 查询关键字
  const fuzzyFormData = reactive({
    id: '',
    name: '',
    status: '',
    startTime: '',
    endTime: '',
  })
  // 预约类型
  const options = [
    { value: '', label: '全部' },
    { value: '已预约', label: '已预约' },
    { value: '已完成', label: '已完成' },
    { value: '已取消', label: '已取消' },
    { value: '异常', label: '异常' },
  ]
  const statusOptions = [
    { value: '已预约', label: '已预约' },
    { value: '已完成', label: '已完成' },
    { value: '已取消', label: '已取消' },
    { value: '异常', label: '异常' },
  ]
  // 导出表格格式
  const column = [
    { name: 'order', label: '序号' },
    { name: 'ordersId', label: '订单编号' },
    { name: 'userId', label: '用户ID' },
    { name: 'userName', label: '用户姓名' },
    { name: 'staffID', label: '医生ID' },
    { name: 'staffName', label: '医生姓名' },
    { name: 'createTime', label: '预约时间' },
    { name: 'location', label: '预约地点' },
    { name: 'status', label: '预约状态' },
    { name: 'createTime', label: '创建时间' },
    { name: 'updateTime', label: '最后修改时间' },
  ]
  // 批量删除
  const handleDeleteListClick = () => {
    ElMessageBox.confirm('请确认要批量删除该组数据 ?', '健康管理', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      // 确认删除
      if (!selectedRows.value.length) {
        ElMessage.error('暂无数据可删除')
        return
      }
      selectedRows.value.map(async (item) => {
        // 调用删除接口
        await deleteStaffOrders(item.ordersId)
      })
      freshData()
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
      await deleteStaffOrders(row.ordersId)
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
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }
  // 刷新数据
  const freshData = () => {
    isLoading.value = true
    setTimeout(async () => {
      const current = currentPage.value
      const size = pageSize.value
      const id = fuzzyFormData.id
      const name = fuzzyFormData.name
      const type = fuzzyFormData.status
      const resp = await getSearchStaffOrders(current, size, id, name, type)
      tableList.value = resp.records
      tableList.value.reverse()
      for (let i = 0; i < tableList.value.length; i++) {
        tableList.value[i].order = (currentPage.value - 1) * pageSize.value + i + 1
        tableList.value[i].createTime = formatDate(tableList.value[i].createTime)
        tableList.value[i].updateTime = formatDate(tableList.value[i].updateTime)
      }
      total.value = resp.total
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
      if (val) getTableHeight.value = 575
      else getTableHeight.value = 450
      if (isTwoFuzzy.value) getTableHeight.value -= 50
    },
    { immediate: true },
  )
  watch(
    isTwoFuzzy,
    (val) => {
      if (SettingStore.isFull) getTableHeight.value = 575
      else getTableHeight.value = 450
      if (val) getTableHeight.value -= 50
    },
    { immediate: true },
  )
  // 初始化数据
  onMounted(() => {
    freshData()
  })
  const changeStatus = async (index) => {
    const rowInfo = tableList.value[index]
    await updateStaffOrders({
      ordersId: rowInfo.ordersId,
      status: event.target.innerText
    })
    console.log('修改成功')
  }
  const selectedRows = ref([])
  // 监听表格勾选的数量
  const handleSelectionChange = (selection) => {
    selectedRows.value = selection
  }
  /**
   * 监听导出按钮
   */
  const handleExportExcel = async () => {
    // 获取全部数据
    const current = currentPage.value
    const resp = await getAllStaffOrders(current, total.value)
    tableAllList.value = resp.records
    for (let i = 0; i < tableAllList.value.length; i++) {
      tableAllList.value[i].order = (currentPage.value - 1) * pageSize.value + i + 1
      tableAllList.value[i].createTime = formatDate(tableAllList.value[i].createTime)
      tableAllList.value[i].updateTime = formatDate(tableAllList.value[i].updateTime)
    }
    // 开启弹窗
    exportExcelDialogVisible.value = !exportExcelDialogVisible.value
  }
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
      <el-scrollbar class="top" :style="{ height: `${isTwoFuzzy ? 120 : 70}px` }">
        <el-form class="el-form" :model="fuzzyFormData">
          <el-form-item label="预约ID" label-width="60" class="el-form-item" prop="id">
            <el-input v-model="fuzzyFormData.id" placeholder="请输入预约ID" style="width: 200px" />
          </el-form-item>
          <el-form-item label="用户姓名" label-width="100" class="el-form-item" prop="name">
            <el-input
              v-model="fuzzyFormData.name"
              placeholder="请输入用户姓名"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="预约状态" label-width="100" class="el-form-item" prop="type">
            <el-select v-model="fuzzyFormData.status" style="width: 120px">
              <template v-for="item in options" :key="item.value">
                <el-option :label="item.label" :value="item.value"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label-width="40">
            <el-button type="primary" @click="freshData">
              <el-icon style="margin-right: 3px"><Search /></el-icon>查询
            </el-button>
          </el-form-item>
          <el-form-item label-width="20">
            <el-button type="default" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item label-width="50">
            <div @click="isTwoFuzzy = !isTwoFuzzy" class="isTwoFuzzy">
              <span>{{ isTwoFuzzy ? '折叠' : '展开' }}</span>
              <el-icon v-if="isTwoFuzzy"><ArrowUp /></el-icon>
              <el-icon v-else><ArrowDown /></el-icon>
            </div>
          </el-form-item>
        </el-form>
        <el-form v-if="isTwoFuzzy" class="bottom">
          <el-form-item label="周期" label-width="60">
            <el-date-picker
              v-model="dateValue"
              type="daterange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
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
          <el-table-column prop="order" label="序号" width="60"></el-table-column>
          <el-table-column prop="ordersId" label="订单编号" width="100"></el-table-column>
          <el-table-column prop="userId" label="用户ID" width="150"></el-table-column>
          <el-table-column prop="userName" label="用户姓名" width="100"></el-table-column>
          <el-table-column prop="staffName" label="医生姓名" width="100"></el-table-column>
          <el-table-column prop="staffId" label="医生ID" width="100"></el-table-column>
          <el-table-column prop="location" label="预约地点" width="100"></el-table-column>
          <el-table-column label="预约状态" width="110">
            <template v-slot="{ row, $index }">
              <el-select v-model="row.status" @change="changeStatus($index)">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="170"></el-table-column>
          <el-table-column prop="updateTime" label="最后修改时间" width="170"></el-table-column>
          <el-table-column fixed="right" label="操作" width="80">
            <template #default="scope">
              <div class="optionStyle">
                <button
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

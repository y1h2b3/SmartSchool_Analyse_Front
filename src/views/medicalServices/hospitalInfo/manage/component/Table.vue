<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { ref, onMounted, watch, reactive } from 'vue'
  import TeacherInsertDialog from './InsertDialog.vue'
  import TeacherUpdateDialog from './UpdateDialog.vue'
  import DialogExportExcel from '@/components/ExportExcel/dialogExportExcel.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import dayjs from 'dayjs'
  // 用户是否屏幕放大
  import { useSettingStore } from '@/store/modules/setting'
  const settingStore = useSettingStore()
  // 获取API接口
  import {
    getAllStaffInfo,
    getPageSearchStaff,
    deleteStaffInfo,
  } from '@/api/admin/medicalServices/dangerCall.ts'

  const props = defineProps(['currentParentNode', 'currentChildrenNode'])
  const tableList = ref([]) // 当前页数据
  const tableAllList = ref([]) // 全部数据
  const tableRef = ref(null)
  // 当前表格勾选数据
  const selectedRows = ref([])
  // 当前页
  const currentPage = ref(1)
  // 当前页条数
  const pageSize = ref(20)
  // 总条数
  const total = ref(0)
  // 表格是否加载中
  const isLoading = ref<boolean>(false)
  // 是否展示新增窗口
  const insertDialogVisible = ref(false)
  // 是否展示编辑窗口
  const updateDialogVisible = ref(false)
  // 是否展示导出Excel窗口
  const exportExcelDialogVisible = ref(false)
  const rowData = ref({})
  // 导出表格格式
  const column = [
    { name: 'order', label: '序号' },
    { name: 'staffId', label: '工号' },
    { name: 'name', label: '姓名' },
    { name: 'sex', label: '性别' },
    { name: 'location', label: '职位' },
    { name: 'isActive', label: '在职情况' },
    { name: 'phone', label: '手机号' },
    { name: 'birth', label: '出生日期' },
    { name: 'note', label: '备注' },
    { name: 'createTime', label: '注册时间' },
    { name: 'updateTime', label: '最后修改时间' },
  ]
  // 多条件查询数据
  const searchForm = reactive({
    id: '',
    name: '',
    isActive: '',
  })
  const currentFresh = ref(0)
  // 在职情况选择
  const options = [
    { value: '', label: '全部' },
    { value: '1', label: '在职' },
    { value: '0', label: '休假' },
  ]
  /**
   * 监听当前树形控件指向的表格数据
   */
  watch(
    () => props.currentChildrenNode,
    () => {
      flushData(1)
    },
  )
  // 监听当前页显示条数
  const handleSizeChange = (value) => {
    pageSize.value = value
    flushData(currentFresh.value)
  }
  // 监听当前页数
  const handleCurrentChange = (value) => {
    currentPage.value = value
    flushData(currentFresh.value)
  }
  // 刷新数据
  const flushData = (index: number) => {
    isLoading.value = true
    setTimeout(async () => {
      // 获取新的数据
      const current = currentPage.value
      const size = pageSize.value
      const location = index === 0 ? '' : props.currentChildrenNode
      const id = searchForm.id
      const name = searchForm.name
      const isOnline = searchForm.isActive
      const resp = await getPageSearchStaff(current, size, location, id, name, isOnline)
      tableList.value = resp.records
      for (let i = 0; i < tableList.value.length; i++) {
        tableList.value[i].order = i + 1 + (currentPage.value - 1) * pageSize.value
        tableList.value[i].isActive = tableList.value[i].isActive === '1' ? '在职' : '休假'
        tableList.value[i].createTime = formatDate(tableList.value[i].createTime)
        tableList.value[i].updateTime = formatDate(tableList.value[i].updateTime)
      }
      total.value = resp.total
      isLoading.value = false
    }, 500)
  }
  // 监听表格勾选的数量
  const handleSelectionChange = (selection) => {
    selectedRows.value = selection
  }
  /**
   * 批量行删除数据
   */
  const handleBatchDelete = async () => {
    await ElMessageBox.confirm('请确认是否要批量删除？', '提示', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    if (!selectedRows.value.length) {
      ElMessage.error('暂无数据可删除')
      return
    }
    selectedRows.value.map(async (item) => {
      // 调用删除接口
      await deleteStaffInfo(item.staffId)
    })
    // 刷新数据
    flushData(currentFresh.value)
    ElMessage.success('删除成功')
  }
  /**
   * 行删除数据
   */
  const handleDelete = async (row) => {
    await ElMessageBox.confirm('请确认是否要删除？', '提示', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    // 调用删除接口
    await deleteStaffInfo(row.staffId)
    // 刷新数据
    flushData(currentFresh.value)
    ElMessage.success('删除成功')
  }
  /**
   * 行编辑数据
   */
  const handleUpdate = (row) => {
    rowData.value = row
    const info = tableList.value.filter((item) => {
      return (item.studentId = row.studentId)
    })
    console.log(info)
    updateDialogVisible.value = !updateDialogVisible.value
  }
  onMounted(() => {
    flushData(currentFresh.value)
  })
  const formatDate = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD hh:mm:ss')
  }
  /**
   * 监听导出按钮
   */
  const handleExportExcel = async () => {
    // 获取全部数据
    const resp = await getAllStaffInfo(1, total.value)
    tableAllList.value = resp.records
    for (let i = 0; i < tableAllList.value.length; i++) {
      tableAllList.value[i].order = i + 1 + (currentPage.value - 1) * pageSize.value
      tableAllList.value[i].isActive = tableAllList.value[i].isActive === '1' ? '在职' : '休假'
      tableList.value[i].createTime = formatDate(tableList.value[i].createTime)
      tableList.value[i].updateTime = formatDate(tableList.value[i].updateTime)
    }
    console.log(tableAllList.value)
    // 开启弹窗
    exportExcelDialogVisible.value = !exportExcelDialogVisible.value
  }
  // 重置查询条件
  const reset = () => {
    searchForm.id = ''
    searchForm.name = ''
    searchForm.isActive = ''
    // 刷新数据
    flushData(0)
  }
</script>

<template>
  <div class="content">
    <DialogExportExcel
      :exportExcelDialogVisible="exportExcelDialogVisible"
      :column="column"
      :data="tableList"
      :dataAll="tableAllList"
    ></DialogExportExcel>
    <TeacherInsertDialog
      :insertDialogVisible="insertDialogVisible"
      @flush-data="flushData"
    ></TeacherInsertDialog>
    <TeacherUpdateDialog
      :updateDialogVisible="updateDialogVisible"
      :rowData="rowData"
      @flush-data="flushData"
    >
    </TeacherUpdateDialog>
    <el-scrollbar class="top">
      <el-form class="el-form" :model="searchForm">
        <el-form-item label="工号" label-width="60" class="el-form-item" prop="studentId">
          <el-input v-model="searchForm.id" placeholder="请输入要查询的工号" style="width: 180px" />
        </el-form-item>
        <el-form-item label="姓名" label-width="60" class="el-form-item" prop="name">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入要查询的姓名"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="在职情况" label-width="90" class="el-form-item" prop="isActive">
          <el-select style="width: 90px" v-model="searchForm.isActive">
            <template v-for="item in options" :key="item.value">
              <el-option :label="item.label" :value="item.value"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label-width="40">
          <el-button type="primary" @click="flushData">
            <el-icon style="margin-right: 3px"><Search /></el-icon>查询
          </el-button>
        </el-form-item>
        <el-form-item label-width="20">
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="bottom">
      <div class="el-button-box">
        <el-button type="primary" @click="insertDialogVisible = !insertDialogVisible">
          新增医生
        </el-button>
        <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
        <el-button type="success" @click="handleExportExcel"> 导出 Excel </el-button>
      </div>
      <div class="el-table-inner">
        <el-table
          v-loading="isLoading"
          :data="tableList"
          class="el-table"
          ref="tableRef"
          :style="{
            width: `${settingStore.isCollapse ? 1400 : 1200}px`,
            height: `${settingStore.isFull ? 580 : 440}px !important`,
          }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" fit></el-table-column>
          <el-table-column fixed="left" prop="order" label="序号" width="60"></el-table-column>
          <el-table-column prop="staffId" label="工号" width="100"></el-table-column>
          <el-table-column prop="name" label="姓名" width="100"></el-table-column>
          <el-table-column prop="sex" label="性别" width="60"></el-table-column>
          <el-table-column prop="location" label="预约地点" width="120"></el-table-column>
          <el-table-column label="在职情况" width="90">
            <template v-slot="{ row }">
              <el-tag :type="row.isActive === '在职' ? 'success' : 'danger'" size="small">
                {{ row.isActive }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" width="130"></el-table-column>
          <el-table-column prop="birth" label="出生日期" width="110"></el-table-column>
          <el-table-column prop="note" label="备注" width="150"></el-table-column>
          <el-table-column prop="createTime" label="注册时间" width="180"></el-table-column>
          <el-table-column prop="updateTime" label="最后修改时间" width="180"></el-table-column>
          <el-table-column fixed="right" label="操作" width="145">
            <template #default="scope">
              <div class="optionStyle">
                <button
                  link
                  size="mini"
                  class="button primaryStyle"
                  @click="handleUpdate(scope.row)"
                >
                  <el-icon><edit /></el-icon>编辑
                </button>
                <button
                  link
                  size="mini"
                  class="button dangerStyle"
                  @click="handleDelete(scope.row)"
                >
                  <el-icon><delete /></el-icon>删除
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
            small
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :background="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
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
        }
      }
    }
    .bottom {
      flex: 1;
      background-color: #fff;
      margin-top: 14px;
      padding: 0 15px;
      box-sizing: border-box;
      .el-button-box {
        height: 80px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .el-table-inner {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .el-table {
          transition: all 0.2s;
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
          margin-top: 10px;
        }
      }
    }
  }
</style>

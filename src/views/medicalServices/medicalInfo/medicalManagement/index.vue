<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'
  import dayjs from 'dayjs'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import InsertDialog from './components/InsertDialog.vue'
  import UpdateDialog from './components/UpdateDialog.vue'
  import DialogExportExcel from '@/components/ExportExcel/dialogExportExcel.vue'
  import {
    getPageSearchDrugs,
    deleteDrugsInfo,
    getAllDrugsInfo,
  } from '@/api/admin/medicalServices/medicalManagement.ts'
  // 用户是否屏幕放大
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(20)
  const total = ref<number>(0)
  const insertDialogVisible = ref<boolean>(false) // 新增弹窗是否展示
  const updateDialogVisible = ref<boolean>(false) // 修改弹窗是否展示
  const selectedRows = ref([])
  // 监听表格勾选的数量
  const handleSelectionChange = (selection) => {
    selectedRows.value = selection
  }
  // 是否展示导出Excel窗口
  const exportExcelDialogVisible = ref(false)
  const rowData = ref({})
  const isLoading = ref<boolean>(true) // 表格是否加载
  const tableList = ref([])
  // 查询关键字
  const fuzzyFormData = reactive({
    id: '',
    name: '',
    type: '',
  })
  const userInfoRules = reactive({
    drugId: [
      {
        required: true,
        message: '药品编号不能为空',
        trigger: 'blur',
      },
    ],
    name: [
      {
        required: true,
        message: '药品名称不能为空',
        trigger: 'blur',
      },
    ],
    quantity: [
      {
        required: true,
        message: '数量不能为空',
        trigger: 'blur',
      },
    ],
    specifications: [
      {
        required: true,
        message: '规格不能为空',
        trigger: 'blur',
      },
    ],
    type: [
      {
        required: true,
        message: '类型不能为空',
        trigger: 'blur',
      },
    ],
    usage1: [
      {
        required: true,
        message: '用法不能为空',
        trigger: 'blur',
      },
    ],
    dosage: [
      {
        required: true,
        message: '剂量不能为空',
        trigger: 'blur',
      },
    ],
    manufacturer: [
      {
        required: true,
        message: '生产厂家不能为空',
        trigger: 'blur',
      },
    ],
    expirationDate: [
      {
        required: true,
        message: '药品有效期不能为空',
        trigger: 'blur',
      },
    ],
    symptoms: [
      {
        required: true,
        message: '治疗症状不能为空',
        trigger: 'blur',
      },
    ],
    price: [
      {
        required: true,
        message: '价格不能为空',
        trigger: 'blur',
      },
    ],
    notes: [
      {
        required: true,
        message: '备注不能为空',
        trigger: 'blur',
      },
    ],
    createTime: [
      {
        required: true,
        message: '上架时间不能为空',
        trigger: 'blur',
      },
    ],
    updateTime: [
      {
        required: true,
        message: '最后修改时间不能为空',
        trigger: 'blur',
      },
    ],
  })
  // 导出表格格式
  const column = [
    { name: 'order', label: '序号' },
    { name: 'drugId', label: '药品编号' },
    { name: 'name', label: '药品名称' },
    { name: 'quantity', label: '数量' },
    { name: 'specifications', label: '规格' },
    { name: 'type', label: '类型' },
    { name: 'usage1', label: '用法' },
    { name: 'dosage', label: '使用剂量' },
    { name: 'manufacturer', label: '生产厂家' },
    { name: 'expirationDate', label: '药品有效期' },
    { name: 'symptoms', label: '治疗症状' },
    { name: 'price', label: '价格' },
    { name: 'notes', label: '备注' },
    { name: 'createTime', label: '上架时间' },
    { name: 'updateTime', label: '最后修改时间' },
  ]
  const openInsertDialog = () => {
    // 开启弹窗
    insertDialogVisible.value = !insertDialogVisible.value
  }
  // 修改学生信息
  const openUpdateDialog = (index: number): void => {
    // 开启弹窗
    rowData.value = tableList.value[index]
    // 开启弹窗
    updateDialogVisible.value = !updateDialogVisible.value
  }
  // 批量删除
  const handleDeleteListClick = () => {
    ElMessageBox.confirm('请确认要批量删除该组数据 ?', '健康管理', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      // 确认删除
      selectedRows.value.map(async (item) => {
        await deleteDrugsInfo(item.drugId)
      })
      ElMessage.success('删除成功')
      freshData()
    })
  }
  // 删除操作
  const handleDeleteOneClick = (index: number) => {
    ElMessageBox.confirm('请确认要删除该数据 ?', '药品管理', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 确认删除
      console.log(tableList.value[index].drugId)
      await deleteDrugsInfo(tableList.value[index].drugId)
      ElMessage.success('删除成功')
      freshData()
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
    getType()
    isLoading.value = true
    setTimeout(async () => {
      const current = currentPage.value
      const size = pageSize.value
      const id = fuzzyFormData.id
      const name = fuzzyFormData.name
      const status = fuzzyFormData.type
      const resp = await getPageSearchDrugs(current, size, id, name, status)
      tableList.value = resp.records
      for (let i = 0; i < tableList.value.length; i++) {
        tableList.value[i].order = (currentPage.value - 1) * pageSize.value + i + 1
        tableList.value[i].notes = tableList.value[i].notes ? tableList.value[i].notes : '无'
        tableList.value[i].createTime = formatDate(tableList.value[i].createTime)
        tableList.value[i].updateTime = formatDate(tableList.value[i].updateTime)
      }
      total.value = resp.total
      isLoading.value = false
    }, 500)
  }
  // 药品类型
  const options = ref([])
  // 获取药品类型
  const getType = async () => {
    options.value = []
    options.value.push({ value: '', label: '全部' })
    const mySet = []
    const resp = await getAllDrugsInfo()
    const data = resp.records
    for (let i = 0; i < data.length; i++) {
      if (!mySet.includes(data[i].type)) {
        mySet.push(data[i].type)
        options.value.push({ value: data[i].type, label: data[i].type })
      }
    }
  }
  // 重置数据
  const reset = () => {
    fuzzyFormData.id = ''
    fuzzyFormData.name = ''
    freshData()
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
      ></DialogExportExcel>
      <InsertDialog
        :userInfoRules="userInfoRules"
        :insertDialogVisible="insertDialogVisible"
        @freshData="freshData"
      >
      </InsertDialog>
      <UpdateDialog
        :userInfoRules="userInfoRules"
        :updateDialogVisible="updateDialogVisible"
        :rowData="rowData"
        @freshData="freshData"
      >
      </UpdateDialog>
      <el-scrollbar class="top">
        <el-form class="el-form" :model="fuzzyFormData">
          <el-form-item label="药品编号" label-width="80" class="el-form-item" prop="id">
            <el-input
              v-model="fuzzyFormData.id"
              placeholder="请输入要查询的药品编号"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="药品名称" label-width="100" class="el-form-item" prop="name">
            <el-input
              v-model="fuzzyFormData.name"
              placeholder="请输入要查询的药品名称"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="药品类型" label-width="100" class="el-form-item" prop="type">
            <el-select v-model="fuzzyFormData.type" style="width: 120px">
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
        </el-form>
      </el-scrollbar>
      <div class="table-container">
        <div class="header">
          <el-button type="primary" @click="openInsertDialog" size="default">
            <el-icon style="margin-right: 3px">
              <plus />
            </el-icon>
            新增药品信息
          </el-button>
          <el-button type="danger" @click="handleDeleteListClick">
            <el-icon style="margin-right: 3px">
              <delete />
            </el-icon>
            批量删除
          </el-button>
          <el-button
            type="success"
            class="export_excel"
            @click="exportExcelDialogVisible = !exportExcelDialogVisible"
          >
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
          <el-table-column prop="order" label="序号" width="70"></el-table-column>
          <el-table-column prop="drugId" label="药品编号" width="100"></el-table-column>
          <el-table-column prop="name" label="药品名称" width="100"></el-table-column>
          <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
          <el-table-column prop="specifications" label="规格" width="100"></el-table-column>
          <el-table-column prop="type" label="类型" width="100"></el-table-column>
          <el-table-column prop="usage1" label="用法" width="120"></el-table-column>
          <el-table-column prop="dosage" label="使用剂量" width="150"></el-table-column>
          <el-table-column prop="manufacturer" label="生产厂家" width="180"></el-table-column>
          <el-table-column prop="expirationDate" label="药品有效期" width="120"></el-table-column>
          <el-table-column prop="symptoms" label="治疗症状" width="120"></el-table-column>
          <el-table-column prop="price" label="价格" width="100"></el-table-column>
          <el-table-column prop="notes" label="备注" width="150"></el-table-column>
          <el-table-column prop="createTime" label="上架时间" width="170"></el-table-column>
          <el-table-column prop="updateTime" label="最后修改时间" width="170"></el-table-column>
          <el-table-column fixed="right" label="操作" width="145">
            <template #default="scope">
              <div class="optionStyle">
                <button
                  link
                  size="mini"
                  class="button primaryStyle"
                  @click="openUpdateDialog(scope.$index)"
                >
                  <el-icon>
                    <edit />
                  </el-icon>
                  编辑
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

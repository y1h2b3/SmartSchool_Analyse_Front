<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue'
  import dayjs from 'dayjs'
  import { useUserStore } from '../../../store/modules/user'
  import { searchOrders } from '@/api/parent/order.ts'
  // 用户是否屏幕放大
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  const UserStore = useUserStore()
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(10)
  const total = ref<number>(0)
  const insertDialogVisible = ref<boolean>(false) // 新增弹窗是否展示
  const updateDialogVisible = ref<boolean>(false) // 修改弹窗是否展示
  const tableAllList = ref([])
  // 是否展示导出Excel窗口
  const exportExcelDialogVisible = ref(false)
  const rowData = ref({})
  const isLoading = ref<boolean>(true) // 表格是否加载
  const tableList = ref([])
  const isTwoFuzzy = ref(false) // 关键字搜索是否展开
  const dateValue = ref(null) // 日期时间
  // 查询关键字
  const fuzzyFormData = reactive({
    oid: '',
    uid: '',
    type: '',
    startTime: '',
    endTime: '',
  })
  // 药品类型
  const options = [
    { value: '', label: '全部' },
    { value: '已支付', label: '已支付' },
    { value: '待支付', label: '待支付' },
    { value: '已发货', label: '已发货' },
    { value: '待发货', label: '待发货' },
    { value: '已取消', label: '已取消' },
    { value: '异常', label: '异常' },
  ]
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
  // 日期格式转换
  const formatDate = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD hh:mm:ss')
  }
  // 刷新数据
  const freshData = () => {
    isLoading.value = true
    setTimeout(async () => {
      const current = currentPage.value
      const size = pageSize.value
      const oid = fuzzyFormData.oid
      const uid = UserStore.userInfo.studentId
      const type = fuzzyFormData.type
      const startTime = fuzzyFormData.startTime
      const endTime = fuzzyFormData.endTime
      const resp = await searchOrders(current, size, oid, uid, type, startTime, endTime)
      tableList.value = resp.records
      tableList.value.reverse()
      for (let i = 0; i < tableList.value.length; i++) {
        tableList.value[i].order = (currentPage.value - 1) * pageSize.value + i + 1
        tableList.value[i].time = formatDate(tableList.value[i].time)
      }
      total.value = resp.total
      isLoading.value = false
    }, 500)
  }
  // 重置数据
  const reset = () => {
    fuzzyFormData.oid = ''
    fuzzyFormData.uid = ''
    fuzzyFormData.type = ''
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
      if (isTwoFuzzy.value) getTableHeight.value -= 50
    },
    { immediate: true },
  )
  watch(
    isTwoFuzzy,
    (val) => {
      if (val) getTableHeight.value = 645
      else getTableHeight.value = 520
      if (val) getTableHeight.value -= 50
    },
    { immediate: true },
  )
  // 初始化数据
  onMounted(() => {
    freshData()
  })
  const getOrderStatusColor = (orderStatus) => {
    if (orderStatus === '已发货' || orderStatus === '已支付') {
      return 'success'
    } else if (orderStatus === '待支付' || orderStatus === '待发货') {
      return 'warning'
    } else if (orderStatus === '已取消') {
      return 'primary'
    } else if (orderStatus === '异常') {
      return 'danger'
    }
  }
  const selectedRows = ref([])
  // 监听表格勾选的数量
  const handleSelectionChange = (selection) => {
    selectedRows.value = selection
  }
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner content">
      <el-scrollbar class="top" :style="{ height: `${isTwoFuzzy ? 120 : 70}px` }">
        <el-form class="el-form" :model="fuzzyFormData">
          <el-form-item label="订单ID" label-width="60" class="el-form-item" prop="id">
            <el-input v-model="fuzzyFormData.oid" placeholder="请输入订单ID" style="width: 200px" />
          </el-form-item>
          <el-form-item label="订单状态" label-width="100" class="el-form-item" prop="type">
            <el-select v-model="fuzzyFormData.type" style="width: 100px">
              <template v-for="item in options" :key="item.value">
                <el-option :label="item.label" :value="item.value"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="周期" label-width="100">
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
        </el-form>
      </el-scrollbar>
      <div class="table-container">
        <el-table
          v-loading="isLoading"
          :data="tableList"
          class="table"
          :style="{ height: `${getTableHeight}px !important` }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed type="selection" width="40" />
          <el-table-column prop="time" label="购买时间" width="240"></el-table-column>
          <el-table-column prop="orderId" label="订单ID" width="180"></el-table-column>
          <el-table-column prop="userId" label="用户ID" width="180"></el-table-column>
          <el-table-column prop="drugName" label="药品名称" width="150"></el-table-column>
          <el-table-column prop="price" label="单价" width="100"></el-table-column>
          <el-table-column prop="quantity" label="数量" width="80"></el-table-column>
          <el-table-column prop="totalPrice" label="总金额" width="120"></el-table-column>
          <el-table-column label="购买状态">
            <template v-slot="{ row }">
              <el-tag :type="getOrderStatusColor(row.orderStatus)" size="small" style="width: 50px">
                {{ row.orderStatus }}
              </el-tag>
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

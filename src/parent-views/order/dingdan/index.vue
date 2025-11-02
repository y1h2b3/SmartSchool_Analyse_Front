<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue'
  import { searchStaffOrders} from '@/api/parent/order.ts'
  import dayjs from 'dayjs'
  // 用户是否屏幕放大
  import { useSettingStore } from '@/store/modules/setting'
  import { useUserStore } from '../../../store/modules/user'
  const SettingStore = useSettingStore()
  const UserStore = useUserStore()
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(10)
  const total = ref<number>(0)
  const isTwoFuzzy = ref(false)
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
      const name = UserStore.userInfo.studentName
      const type = fuzzyFormData.status
      const resp = await searchStaffOrders(current, size, id, name, type)
      tableList.value = resp.records
      for (let i = 0; i < tableList.value.length; i++) {
        tableList.value[i].createTime = formatDate(tableList.value[i].createTime)
      }
      total.value = resp.total
      isLoading.value = false
    }, 500)
  }
  // 重置数据
  const reset = () => {
    fuzzyFormData.id = ''
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
      if (val) getTableHeight.value = 645
      else getTableHeight.value = 520
      if (isTwoFuzzy.value) getTableHeight.value -= 50
    },
    { immediate: true },
  )
  watch(
    isTwoFuzzy,
    (val) => {
      if (SettingStore.isFull) getTableHeight.value = 645
      else getTableHeight.value = 520
      if (val) getTableHeight.value -= 50
    },
    { immediate: true },
  )
  // 初始化数据
  onMounted(() => {
    freshData()
  })
  const getStaffType = (ststus) => {
    if (ststus === '已预约') {
      return 'primary'
    } else if (ststus === '已完成') {
      return 'success'
    } else if (ststus === '已取消') {
      return 'warning'
    } else if (ststus === '异常') {
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
          <el-form-item label="订单编号" label-width="80" class="el-form-item" prop="id">
            <el-input
              v-model="fuzzyFormData.id"
              placeholder="请输入订单编号"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="预约状态" label-width="100" class="el-form-item" prop="type">
            <el-select v-model="fuzzyFormData.status" style="width: 100px">
              <template v-for="item in options" :key="item.value">
                <el-option :label="item.label" :value="item.value"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label-width="30">
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
          <el-table-column prop="createTime" label="预约时间" width="200"></el-table-column>
          <el-table-column prop="ordersId" label="订单编号" width="150"></el-table-column>
          <el-table-column prop="userId" label="用户ID" width="150"></el-table-column>
          <el-table-column prop="userName" label="用户姓名" width="150"></el-table-column>
          <el-table-column prop="staffName" label="医生名字" width="150"></el-table-column>
          <el-table-column prop="staffId" label="医生工号" width="150"></el-table-column>
          <el-table-column prop="location" label="预约地点" width="150"></el-table-column>
          <el-table-column label="预约状态">
            <template v-slot="{ row }">
              <el-tag :type="getStaffType(row.status)" size="small" style="width: 60px">
                {{ row.status }}
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
      box-sizing: border-box;
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

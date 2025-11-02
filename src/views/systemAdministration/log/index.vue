<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { onMounted, ref, reactive, watch } from 'vue'
  import { getLogsData, getAllLogsData } from '@/api/admin/systemAdministration/log.ts'
  import DialogExportExcel from '@/components/ExportExcel/dialogExportExcel.vue'
  import dayjs from 'dayjs'
  const tableList = ref([]) // 表格数据
  const tableAllList = ref([]) // 全部数据
  const currentPage = ref(1) // 当前第几页
  const pageSize = ref(10) // 当前每页条数
  const isLoading = ref(false) // 表格是否加载
  const total = ref(0) // 显示当前总条数
  const isTwoFuzzy = ref(false) // 关键字搜索是否展开
  const dateValue = ref(null) // 日期时间
  // 是否展示导出Excel窗口
  const exportExcelDialogVisible = ref(false)
  // 导出表格格式
  const column = [
    { name: 'order', label: '序号' },
    { name: 'dataId', label: '日志ID' },
    { name: 'logsType', label: '日志类型' },
    { name: 'userId', label: '操作账号' },
    { name: 'result', label: '执行结果' },
    { name: 'ip', label: '登录IP' },
    { name: 'msg', label: '结果说明' },
    { name: 'createTime', label: '操作时间' },
  ]
  watch(dateValue, (val) => {
    const startTime = val[0]
    const endTime = val[1]
    endTime.setDate(endTime.getDate() + 1)
    formData.startTime = dayjs(startTime).format('YYYY-MM-DD')
    formData.endTime = dayjs(endTime).format('YYYY-MM-DD')
    console.log(formData)
  })
  // 关键字查询
  const formData = reactive({
    id: '',
    type: '',
    result: '',
    startTime: '',
    endTime: '',
  })
  // 药品类型
  const options = [
    { value: '', label: '全部' },
    { value: 1, label: '操作成功' },
    { value: 0, label: '操作失败' },
  ]
  // 监听当前页显示条数
  const handleSizeChange = (value) => {
    pageSize.value = value
    freshData()
  }
  // 监听当前页数
  const handleCurrentChange = (value) => {
    currentPage.value = value
    freshData()
  }
  /**
   * 刷新数据
   */
  const freshData = () => {
    isLoading.value = true
    setTimeout(async () => {
      const account = formData.id
      const startTime = formData.startTime
      const endTime = formData.endTime
      const type = formData.type
      const result = formData.result
      const current = currentPage.value
      const size = pageSize.value
      let resp = null
      if (endTime === '') {
        resp = await getLogsData(current, size, account, type, result)
      } else {
        resp = await getLogsData(current, size, account, type, result, startTime, endTime)
      }
      tableList.value = resp.records
      tableList.value.map((item) => {
        item.order = (currentPage.value - 1) * pageSize.value + 1
        item.createTime = dayjs(item.createTime).format('YYYY年MM月DD日 HH:mm:ss')
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
    const resp = await getAllLogsData(1, total.value)
    tableAllList.value = resp.records
    for (let i = 0; i < tableAllList.value.length; i++) {
      tableAllList.value[i].order = i + 1 + (currentPage.value - 1) * pageSize.value
      tableAllList.value[i].status = tableAllList.value[i].status === 1 ? true : false
      tableAllList.value[i].createTime = dayjs(tableAllList.value[i].createTime).format(
        'YYYY-MM-DD HH:mm:ss',
      )
    }
    console.log(tableAllList.value)
    // 开启弹窗
    exportExcelDialogVisible.value = !exportExcelDialogVisible.value
  }
  /**
   * 清空查询关键字
   */
  const reset = () => {
    formData.id = ''
    formData.type = null
    formData.result = ''
    formData.startTime = ''
    formData.endTime = ''
    freshData()
  }
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
      <el-scrollbar class="header" :style="{ height: `${isTwoFuzzy ? 120 : 70}px` }">
        <el-form class="el-form" :model="formData">
          <el-form-item label="账号" label-width="70" class="el-form-item" prop="id">
            <el-input v-model="formData.id" placeholder="请输入要查询的账号" style="width: 200px" />
          </el-form-item>
          <el-form-item label="日志类型" label-width="100" class="el-form-item" prop="name">
            <el-input
              v-model="formData.type"
              placeholder="请输入要查询的日志类型"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="执行结果" label-width="100" class="el-form-item" prop="type">
            <el-select v-model="formData.result" style="width: 120px">
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
          <el-form-item label="记录日期" label-width="98">
            <el-date-picker
              v-model="dateValue"
              type="daterange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="table-box">
        <div class="header">
          <el-button type="success" class="export_excel" @click="handleExportExcel">
            <el-icon style="margin-right: 3px">
              <Download />
            </el-icon>
            导出 Excel
          </el-button>
        </div>
        <el-table :data="tableList" highlight-current-row class="el-table" v-loading="isLoading">
          <el-table-column label-width="60" type="expand">
            <template #default="scope">
              <div class="columnDetail">
                <div>
                  <h4>日志类型: </h4>
                  <span>{{ scope.row.logsType }}</span>
                </div>
                <div>
                  <h4>账号: </h4>
                  <span>{{ scope.row.userId }}</span>
                </div>
                <div>
                  <h4>执行结果: </h4>
                  <div class="result-scope">
                    <div
                      class="ball"
                      :class="{ success: scope.row.isSuccess === 1 ? true : false }"
                    ></div>
                    <span>{{ scope.row.result }}</span>
                  </div>
                </div>
                <div>
                  <h4>登录IP: </h4>
                  <span>{{ scope.row.ip }}</span>
                </div>
                <div>
                  <h4>结果说明: </h4>
                  <span>{{ scope.row.msg }}</span>
                </div>
                <div>
                  <h4>操作时间: </h4>
                  <span>{{ scope.row.createTime }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="日志类型" prop="logsType" min-width="180"></el-table-column>
          <el-table-column label="账号" prop="userId" min-width="180"></el-table-column>
          <el-table-column label="执行结果" prop="result" min-width="180">
            <template v-slot="scope">
              <div class="result-scope">
                <div
                  class="ball"
                  :class="{ success: scope.row.isSuccess === 1 ? true : false }"
                ></div>
                <span>{{ scope.row.result }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="登录IP"
            prop="ip"
            class="el-table-column"
            min-width="180"
          ></el-table-column>
          <el-table-column label="操作时间" prop="createTime" min-width="180"></el-table-column>
        </el-table>
        <el-scrollbar class="demo-pagination-block">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            small
            hide-on-single-page
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :background="true"
          />
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    padding: 0;
    box-shadow: none;
    background-color: #edeff2;
    display: flex;
    flex-direction: column;
    .header {
      height: 70px;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding: 18px 40px 0 0px;
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
    .table-box {
      flex: 1;
      margin-top: 17px;
      padding: 20px;
      box-sizing: border-box;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .header {
        width: 100%;
        height: 50px;
        display: flex;
        padding-bottom: 35px;
        justify-content: flex-start;
        align-items: center;
      }
      .el-table {
        .columnDetail {
          > div {
            padding-left: 30px;
            box-sizing: border-box;
            height: 40px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            h4 {
              width: 60px;
              margin-right: 30px;
            }
          }
        }
        .result-scope {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .ball {
            width: 8px;
            height: 8px;
            border-radius: 4px;
            margin-right: 5px;
            background-color: #ff4d4f; // 默认是 false
          }
          .success {
            background-color: #13ce66;
          }
        }
      }
      .demo-pagination-block {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 10px;
        box-sizing: border-box;
      }
    }
  }
</style>

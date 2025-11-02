<script lang="ts" setup>
  import { onMounted, reactive, ref, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import ExcelJS from 'exceljs'
  const props = defineProps(['exportExcelDialogVisible', 'column', 'data', 'dataAll'])
  const dialogVisible = ref(null)
  const formRef = ref(null)
  const selectVal = ref('xlsx')
  // 是否全选
  const checkAll = ref(true)
  const isIndeterminate = ref(false)
  const checkedCities = ref([])
  const cities = []
  const handleCheckAllChange = (val: boolean) => {
    checkedCities.value = val ? cities : []
    isIndeterminate.value = false
  }
  const handleCheckedCitiesChange = (value: string[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === cities.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length
  }
  const options = ref([
    { value: 'xlsx', label: 'xlsx' },
    { value: 'csv', label: 'csv' },
  ])
  const formData = reactive({
    name: '',
  })
  const fromRules = {
    name: [],
  }
  // 监听窗口是否展示
  watch(
    () => props.exportExcelDialogVisible,
    () => {
      dialogVisible.value = true
    },
  )
  const autoWidthAction = (val, width = 10) => {
    if (val == null) {
      width = 10
    } else if (val.toString().charCodeAt(0) > 255) {
      width = val.toString().length * 2
    } else {
      width = val.toString().length
    }
    return width
  }
  const exportExcel = async ({ column, data, filename, autoWidth, format }) => {
    // 创建excel
    const workbook = new ExcelJS.Workbook()
    // 设置信息
    workbook.creator = 'Me'
    workbook.title = filename
    workbook.created = new Date()
    workbook.modified = new Date()
    // 创建工作表
    const worksheet = workbook.addWorksheet(filename)
    // 设置列名
    const columnsName = []
    column.forEach((item) => {
      const obj = { header: item.label, key: item.name, width: null }
      if (autoWidth) {
        const maxArr = [autoWidthAction(item.label)]
        data.forEach((ite) => {
          const str = ite[item.name] || ''
          if (str) maxArr.push(autoWidthAction(str))
        })
        obj.width = Math.max(...maxArr) + 5
      }
      // 设置列名、键和宽度
      columnsName.push(obj)
    })
    worksheet.columns = columnsName
    // 添加行
    worksheet.addRows(data)
    // 写入文件
    const uint8Array =
      format === 'xlsx' ? await workbook.xlsx.writeBuffer() : await workbook.csv.writeBuffer()
    const blob = new Blob([uint8Array], { type: 'application/octet-binary' })
    if (window.navigator.msSaveOrOpenBlob) {
      // msSaveOrOpenBlob方法返回boolean值
      navigator.msSaveBlob(blob, filename + `.${format}`)
      // 本地保存
    } else {
      const link = document.createElement('a') // a标签下载
      link.href = window.URL.createObjectURL(blob) // href属性指定下载链接
      link.download = filename + `.${format}` // dowload属性指定文件名
      link.click() // click()事件触发下载
      window.URL.revokeObjectURL(link.href) // 释放内存
    }
  }
  /**
   * 导出Excel数据
   */
  const exportExcelAction = async (dataList) => {
    await formRef.value.validate((validate) => {
      if (!validate) return
      // 效验通过
      /* { name: 'id', width: 60, label: '序号' }, */
      const column = props.column.filter((item) => {
        return checkedCities.value.includes(item.label)
      })
      if (column.length === 0) {
        ElMessage.error('选择的字段为空')
        return
      }
      exportExcel({
        column: column,
        data: dataList,
        filename: formData.name !== '' ? formData.name : 'data',
        autoWidth: true,
        format: selectVal.value,
      })
      // 关闭弹窗
      formData.name = ''
      dialogVisible.value = false
      ElMessage.success('导出成功')
    })
  }
  onMounted(() => {
    props.column.map((item) => {
      cities.push(item.label)
      checkedCities.value.push(item.label)
    })
  })
</script>

<template>
  <el-dialog v-model="dialogVisible" title="导出数据" center width="60%">
    <el-form :model="formData" class="el-form" :rules="fromRules" ref="formRef">
      <el-form-item class="column-form-item">
        <p style="width: 100%; font-weight: 550">请选择导出数据</p>
        <el-checkbox
          value="all"
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <template v-for="city in cities" :key="city">
            <el-checkbox :label="city" :value="city">{{ city }}</el-checkbox>
          </template>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="文件名" label-width="80" prop="name">
        <el-input v-model="formData.name" placeholder="默认文件名: data" />
      </el-form-item>
      <el-form-item label="导出格式" label-width="80">
        <el-select-v2
          v-model="selectVal"
          :options="options"
          placement="top-start"
          class="selectStyle"
        />
      </el-form-item>
    </el-form>
    <div class="el-button-row">
      <el-button type="default" @click="dialogVisible = false">取消</el-button>
      <el-button type="success" @click="exportExcelAction(props.dataAll)">导出全部</el-button>
      <el-button type="success" @click="exportExcelAction(props.data)">导出当前页</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
  .el-form {
    border-top: 0.5px solid #c8cbce;
    width: 100%;
    margin-top: -20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    ::v-deep(.el-form-item) {
      width: 300px;
    }
    .selectStyle {
      width: 80px;
    }
    .column-form-item {
      width: 100%;
      margin-left: 7%;
      margin-bottom: 30px;
      .el-checkbox-group {
        width: 100%;
        .el-checkbox {
          width: 20%;
          height: 40px;
        }
      }
    }
  }
  .el-button-row {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>

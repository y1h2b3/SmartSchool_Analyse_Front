<script lang="ts" setup>
  import { ref, reactive, getCurrentInstance, watch, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  const props = defineProps(['userInfoRules', 'updateDialogVisible', 'rowData'])
  import {
    getAllDrugsInfo,
    updateDrugsInfo,
    getTypeID,
  } from '@/api/admin/medicalServices/medicalManagement.ts'
  import dayjs from 'dayjs'
  const instance = getCurrentInstance()
  const updateDialogVisible = ref<boolean>(false) // 修改弹窗是否展示
  const userInfoFormRef = ref(null)
  const userInfoForm = reactive({
    img: '',
    drugId: '',
    name: '',
    quantity: '',
    specifications: '',
    type: '',
    usage1: '',
    dosage: '',
    manufacturer: '',
    expirationDate: '',
    symptoms: '',
    price: '',
    notes: '',
    createTime: '',
    type_id: '',
  })
  const formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD')
  }
  // 提交修改操作
  const handleModifyClick = async () => {
    await userInfoFormRef.value.validate(async (validate) => {
      if (!validate) return
      // 效验通过
      userInfoForm.createTime = formatDate(userInfoForm.createTime)
      userInfoForm.expirationDate = formatDate(userInfoForm.expirationDate)
      const type = userInfoForm.type
      const resp = await getTypeID(type)
      userInfoForm.type_id = resp.typeId
      delete userInfoForm.type
      await updateDrugsInfo(userInfoForm)
      // 发送请求
      // 刷新学生数据
      instance.emit('freshData')
      // 关闭弹窗
      updateDialogVisible.value = false
      ElMessage.success('修改成功')
    })
  }
  watch(
    () => props.updateDialogVisible,
    () => {
      updateDialogVisible.value = true
    },
  )
  watch(
    () => props.rowData,
    (val) => {
      userInfoForm.drugId = val.drugId
      userInfoForm.name = val.name
      userInfoForm.quantity = val.quantity
      userInfoForm.specifications = val.specifications
      userInfoForm.type = val.type
      userInfoForm.usage1 = val.usage1
      userInfoForm.dosage = val.dosage
      userInfoForm.manufacturer = val.manufacturer
      userInfoForm.expirationDate = val.expirationDate
      userInfoForm.symptoms = val.symptoms
      userInfoForm.price = val.price
      userInfoForm.notes = val.notes
      userInfoForm.createTime = val.createTime
      console.log(val)
    },
    { immediate: true },
  )
  // 药品类型
  const options = ref([])
  // 获取药品类型
  const getType = async () => {
    options.value = []
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
  onMounted(() => {
    getType()
  })
</script>

<template>
  <el-dialog v-model="updateDialogVisible" align-center left title="编辑药品信息" width="55%">
    <el-form
      :model="userInfoForm"
      class="dialog-form"
      label-width="auto"
      :rules="props.userInfoRules"
      ref="userInfoFormRef"
    >
      <el-form-item label="药品编号" prop="drugId" class="dialog-form-item">
        <el-input v-model="userInfoForm.drugId" />
      </el-form-item>
      <el-form-item label="药品名称" prop="name" class="dialog-form-item">
        <el-input v-model="userInfoForm.name" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity" class="dialog-form-item">
        <el-input v-model="userInfoForm.quantity" />
      </el-form-item>
      <el-form-item label="规格" prop="specifications" class="dialog-form-item">
        <el-input v-model="userInfoForm.specifications" />
      </el-form-item>
      <el-form-item label="类型" prop="type" class="dialog-form-item">
        <el-select v-model="userInfoForm.type" style="width: 230px">
          <template v-for="item in options" :key="item.value">
            <el-option :label="item.label" :value="item.value"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="用法" prop="usage1" class="dialog-form-item">
        <el-input v-model="userInfoForm.usage1" />
      </el-form-item>
      <el-form-item label="使用剂量" prop="dosage" class="dialog-form-item">
        <el-input v-model="userInfoForm.dosage" />
      </el-form-item>
      <el-form-item label="生产厂家" prop="manufacturer" class="dialog-form-item">
        <el-input v-model="userInfoForm.manufacturer" />
      </el-form-item>
      <el-form-item label="药品有效期" prop="expirationDate" class="dialog-form-item">
        <el-date-picker
          v-model="userInfoForm.expirationDate"
          type="datetime"
          style="width: 230px"
        />
      </el-form-item>
      <el-form-item label="治疗症状" prop="symptoms" class="dialog-form-item">
        <el-input v-model="userInfoForm.symptoms" />
      </el-form-item>
      <el-form-item label="价格" prop="price" class="dialog-form-item">
        <el-input v-model="userInfoForm.price" />
      </el-form-item>
      <el-form-item label="备注" prop="notes" class="dialog-form-item">
        <el-input v-model="userInfoForm.notes" />
      </el-form-item>
      <el-form-item label="上架时间" prop="createTime" class="dialog-form-item">
        <el-date-picker v-model="userInfoForm.createTime" type="datetime" style="width: 230px" />
      </el-form-item>
      <el-form-item class="dialog-form-item"></el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="default" @click="updateDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleModifyClick">提交</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
  .dialog-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    .dialog-form-item {
      width: 320px;
      margin-right: 20px;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>

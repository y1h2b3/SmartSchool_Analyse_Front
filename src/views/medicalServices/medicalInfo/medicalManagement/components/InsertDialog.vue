<script lang="ts" setup>
  import { ref, reactive, getCurrentInstance, watch, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import dayjs from 'dayjs'
  import {
    getAllDrugsInfo,
    addDrugsInfo,
    getTypeID,
  } from '@/api/admin/medicalServices/medicalManagement.ts'
  const insertDialogVisible = ref<boolean>(false) // 新增弹窗是否展示
  const userInfoFormRef = ref(null)
  const userInfoForm = reactive({
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
    updateTime: '',
    typeId: '',
  })
  const props = defineProps(['userInfoRules', 'insertDialogVisible'])
  const instance = getCurrentInstance()
  // 提交新增操作
  const handleAddClick = async () => {
    await userInfoFormRef.value.validate(async (validate) => {
      if (!validate) {
        // 效验失败
        return
      }
      // 效验通过
      userInfoForm.expirationDate = dayjs(userInfoForm.expirationDate).format('YYYY-MM-DD')
      const type = userInfoForm.type
      const resp = await getTypeID(type)
      userInfoForm.typeId = resp.typeId
      await addDrugsInfo(userInfoForm)
      // 关闭弹窗
      // 发送请求
      instance.emit('freshData')
      insertDialogVisible.value = false
      ElMessage.success('新增成功')
    })
  }
  watch(
    () => props.insertDialogVisible,
    () => {
      insertDialogVisible.value = true
    },
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
  <el-dialog v-model="insertDialogVisible" align-center left title="新增药品信息" width="55%">
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
    </el-form>
    <div class="dialog-footer">
      <el-button type="default" @click="insertDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleAddClick">提交</el-button>
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

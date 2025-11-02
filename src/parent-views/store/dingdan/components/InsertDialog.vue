<script lang="ts" setup>
  import { ref, reactive, getCurrentInstance, watch, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  const props = defineProps(['userInfoRules', 'insertDialogVisible'])
  const instance = getCurrentInstance()
  const updateDialogVisible = ref<boolean>(false) // 修改弹窗是否展示
  const userInfoFormRef = ref(null)
  const userInfoForm = reactive({
    orderId: '',
    userId: '',
    drugId: '',
    drugName: '',
    price: 0,
    quantity: 1,
    totalPrice: 0,
  })
  // 提交修改操作
  const handleModifyClick = async () => {
    await userInfoFormRef.value.validate(async (validate) => {
      if (!validate) return
      // 效验通过
      console.log(userInfoForm)
      // 发送请求
      // 刷新学生数据
      instance.emit('freshData')
      // 关闭弹窗
      updateDialogVisible.value = false
      ElMessage.success('修改成功')
    })
  }
  watch(
    () => props.insertDialogVisible,
    () => {
      updateDialogVisible.value = true
    },
  )
  // 药品类型
  const options = [
    { value: '感冒药', label: '感冒药' },
    { value: '天帝', label: '天帝' },
    { value: '类型A', label: '类型A' },
    { value: '类型B', label: '类型B' },
    { value: '类型C', label: '类型C' },
  ]
  // 监听单价变量
  watch(
    () => userInfoForm.price,
    () => {
      // 计算药品价格
      userInfoForm.totalPrice = Number(userInfoForm.price) * Number(userInfoForm.quantity)
    },
  )
  // 监听单价变量
  watch(
    () => userInfoForm.quantity,
    () => {
      // 计算药品价格
      userInfoForm.totalPrice = Number(userInfoForm.price) * Number(userInfoForm.quantity)
    },
  )
</script>

<template>
  <el-dialog v-model="updateDialogVisible" align-center left title="新增药品订单" width="55%">
    <el-form
      :model="userInfoForm"
      class="dialog-form"
      label-width="auto"
      :rules="props.userInfoRules"
      ref="userInfoFormRef"
    >
      <el-form-item label="订单编号" prop="orderId" class="dialog-form-item">
        <el-input v-model="userInfoForm.orderId" />
      </el-form-item>
      <el-form-item label="用户编号" prop="userId" class="dialog-form-item">
        <el-input v-model="userInfoForm.userId" />
      </el-form-item>
      <el-form-item label="药品编号" prop="drugId" class="dialog-form-item">
        <el-input v-model="userInfoForm.drugId" />
      </el-form-item>
      <el-form-item label="药品名称" prop="drugName" class="dialog-form-item">
        <el-input v-model="userInfoForm.drugName" disabled />
      </el-form-item>
      <el-form-item label="单价" prop="price" class="dialog-form-item">
        <el-input v-model="userInfoForm.price" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity" class="dialog-form-item">
        <el-input v-model="userInfoForm.quantity" />
      </el-form-item>
      <el-form-item label="总金额" prop="totalPrice" class="dialog-form-item">
        <el-input v-model="userInfoForm.totalPrice" disabled />
      </el-form-item>
      <el-table-item class="dialog-form-item"></el-table-item>
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

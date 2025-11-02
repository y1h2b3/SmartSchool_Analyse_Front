<script lang="ts" setup>
  import { ref, reactive, getCurrentInstance, watch, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  import { updateOrders } from '@/api/admin/medicalServices/orders.ts'
  const props = defineProps(['userInfoRules', 'updateDialogVisible', 'rowData'])
  const instance = getCurrentInstance()
  const updateDialogVisible = ref<boolean>(false) // 修改弹窗是否展示
  const userInfoFormRef = ref(null)
  const userInfoForm = reactive({
    orderId: '',
    userId: '',
    drugId: '',
    drugName: '',
    orderStatus: '',
    price: 0,
    quantity: 1,
    totalPrice: 0,
  })
  // 提交修改操作
  const handleModifyClick = async () => {
    await userInfoFormRef.value.validate(async (validate) => {
      if (!validate) return
      // 效验通过
      // 发送请求
      await updateOrders({
        orderId: userInfoForm.orderId,
        orderStatus: userInfoForm.orderStatus,
      })
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
      userInfoForm.orderId = val.orderId
      userInfoForm.userId = val.userId
      userInfoForm.quantity = val.quantity
      userInfoForm.drugName = val.drugName
      userInfoForm.orderStatus = val.orderStatus
      userInfoForm.price = val.price
      userInfoForm.quantity = val.quantity
      userInfoForm.totalPrice = val.totalPrice
      console.log(val)
    },
    { immediate: true },
  )
  // 药品类型
  const options = [
    { value: '已支付', label: '已支付' },
    { value: '待支付', label: '待支付' },
    { value: '已发货', label: '已发货' },
    { value: '待发货', label: '待发货' },
    { value: '已取消', label: '已取消' },
    { value: '异常', label: '异常' },
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
  <el-dialog v-model="updateDialogVisible" align-center left title="编辑药品订单" width="55%">
    <el-form
      :model="userInfoForm"
      class="dialog-form"
      label-width="auto"
      :rules="props.userInfoRules"
      ref="userInfoFormRef"
    >
      <el-form-item label="订单编号" prop="orderId" class="dialog-form-item">
        <el-input v-model="userInfoForm.orderId" disabled />
      </el-form-item>
      <el-form-item label="用户编号" prop="userId" class="dialog-form-item">
        <el-input v-model="userInfoForm.userId" disabled />
      </el-form-item>
      <el-form-item label="药品名称" prop="drugName" class="dialog-form-item">
        <el-input v-model="userInfoForm.drugName" disabled />
      </el-form-item>
      <el-form-item label="单价" prop="price" class="dialog-form-item">
        <el-input v-model="userInfoForm.price" disabled />
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus" class="dialog-form-item">
        <el-select v-model="userInfoForm.orderStatus" style="width: 240px">
          <template v-for="item in options" :key="item.value">
            <el-option :label="item.label" :value="item.value"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="quantity" class="dialog-form-item">
        <el-input v-model="userInfoForm.quantity" disabled />
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

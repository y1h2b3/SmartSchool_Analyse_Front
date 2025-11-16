<script lang="ts" setup>
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { computed, ref, watch } from 'vue'
  import { addOrders } from '@/api/parent/order.ts'
  import { payZFB } from '@/api/pay/pay.ts'
  import { useUserStore } from '@/store/modules/user.ts'
  const UserStore = useUserStore()
  const dialogVisible = ref<boolean>(false) // 新增弹窗是否展示
  const props = defineProps(['buyDialogVisible', 'rowData'])
  watch(
    () => props.buyDialogVisible,
    () => {
      dialogVisible.value = true
    },
  )
  const wayOption = [
    {
      value: '支付宝',
      label: '支付宝',
    },
    {
      value: '现金支付',
      label: '现金支付',
    },
  ]
  const formRef = ref(null)
  // 表单数据
  const formData = ref({
    quantity: 1,
    way: '支付宝',
    totalPrice: 0,
  })
  watch(
    () => formData.value.quantity,
    (val) => {
      formData.value.totalPrice = Number(val) * parseFloat(props.rowData.price)
    },
  )
  const totalPrice = computed(() => {
    return formData.value.totalPrice.toFixed(2)
  })
  const formRules = {}
  /**
   * 支付验证
   */
  const comfirm = () => {
    formRef.value.validate(async (valid) => {
      if (!valid) {
        // 效验错误
        return
      }
      
      try {
        await ElMessageBox.confirm('请确认是否要购买？', '提示', {
          confirmButtonText: '确认购买',
          cancelButtonText: '取消',
          type: 'warning',
        })
        
        const dona_drugId = props.rowData.drugId
        const dona_money = props.rowData.price
        const dona_sum = formData.value.quantity
        const dona_userId = UserStore.userInfo.studentId
        
        // 打开支付页面
        window.open(
          `http://localhost:8081/pay/alipay?dona_drugId=${dona_drugId}&dona_money=${dona_money}&dona_sum=${dona_sum}&dona_userId=${dona_userId}`,
          '_blank',
        )
        
        // 显示提示：支付页面已打开
        ElMessage.success('支付页面已打开，请在新窗口中完成支付')
        
        // 关闭弹窗
        dialogVisible.value = false
        
      } catch (error) {
        // 用户取消或错误
        if (error !== 'cancel') {
          console.error('支付错误:', error)
          ElMessage.error('支付失败，请重试')
        }
      }
    })
  }
  watch(
    () => props.rowData,
    (val) => {
      formData.value.totalPrice = val.price
    },
  )
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    class="el-dialog"
    top="0"
    align-center
    :show-close="false"
    left
    width="60%"
  >
    <template #header>
      <div class="el-dialog__header">
        <div class="header">
          <span>药品详情</span>
        </div>
        <div>
          <el-button type="danger" @click="dialogVisible = !dialogVisible">
            <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
            关闭
          </el-button>
        </div>
      </div>
    </template>
    <div class="top">
      <el-descriptions size="default" column="3" border>
        <el-descriptions-item label="药品图片">
          <el-avatar
            shape="square"
            :size="70"
            fit="cover"
            src="./src/assets/image/index/商品.png"
            style="border-radius: 20px; background-color: #fff"
          />
        </el-descriptions-item>
        <el-descriptions-item label="药品名称">
          <template #label>
            <div class="cell-item">
              <el-icon><user /></el-icon>
              药品名称
            </div>
          </template>
          {{ props.rowData.name }}
        </el-descriptions-item>
        <el-descriptions-item label="药品类型">
          <template #label>
            <div class="cell-item">
              <el-icon><user /></el-icon>
              药品类型
            </div>
          </template>
          {{ props.rowData.type }}
        </el-descriptions-item>
        <el-descriptions-item label="用法">
          <template #label>
            <div class="cell-item">
              <el-icon><user /></el-icon>
              用法
            </div>
          </template>
          {{ props.rowData.usage1 }}
        </el-descriptions-item>
        <el-descriptions-item label="价格 ">
          <template #label>
            <div class="cell-item">
              <el-icon><user /></el-icon>
              价格
            </div>
          </template>
          {{ props.rowData.price }}
        </el-descriptions-item>
        <el-descriptions-item label="数量">
          <template #label>
            <div class="cell-item">
              <el-icon><user /></el-icon>
              数量
            </div>
          </template>
          {{ props.rowData.quantity }}
        </el-descriptions-item>
        <el-descriptions-item label="规格">
          <template #label>
            <div class="cell-item">
              <el-icon><user /></el-icon>
              规格
            </div>
          </template>
          {{ props.rowData.specifications }}
        </el-descriptions-item>
        <el-descriptions-item label="使用剂量">
          <template #label>
            <div class="cell-item">
              <el-icon><user /></el-icon>
              使用剂量
            </div>
          </template>
          {{ props.rowData.dosage }}
        </el-descriptions-item>
        <el-descriptions-item label="生产厂家">
          <template #label>
            <div class="cell-item">
              <el-icon><user /></el-icon>
              生产厂家
            </div>
          </template>
          {{ props.rowData.manufacturer }}
        </el-descriptions-item>
        <el-descriptions-item label="有效期至">
          <template #label>
            <div class="cell-item">
              <el-icon><user /></el-icon>
              有效期至
            </div>
          </template>
          {{ props.rowData.expirationDate }}
        </el-descriptions-item>
        <el-descriptions-item label="使用症状">
          <template #label>
            <div class="cell-item">
              <el-icon><user /></el-icon>
              使用症状
            </div>
          </template>
          {{ props.rowData.symptoms }}
        </el-descriptions-item>
        <el-descriptions-item label="备注">
          <template #label>
            <div class="cell-item">
              <el-icon><user /></el-icon>
              备注
            </div>
          </template>
          {{ props.rowData.notes }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-form class="el-form" :model="formData" :rules="formRules" ref="formRef">
      <el-form-item label="选择件数" label-width="100" prop="quantity" style="width: 100%">
        <el-input-number v-model="formData.quantity" :min="1" :max="10" style="width: 110px" />
      </el-form-item>
      <el-form-item label="支付方式" label-width="100" prop="way" style="width: 100%">
        <el-select v-model="formData.way" style="width: 110px">
          <template v-for="item in wayOption" :key="item.value">
            <el-option :label="item.label" :value="item.value"></el-option>
          </template>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer">
        <span class="quantity-class">已选{{ formData.quantity }}件,</span>
        <span class="totalPrice-key">合计:</span>
        <span class="totalPrice-value">￥</span>
        <span class="totalPrice-value" style="font-size: 18px; margin-right: 20px">{{
          totalPrice
        }}</span>
        <el-button type="deafault" @click="comfirm" class="pay-button">确定支付</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
  .el-dialog {
    .el-dialog__header {
      height: 5px;
      padding: 0px !important;
      font-weight: bold;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      > div:nth-child(1) {
        display: flex;
        justify-content: flex-start;
      }
      > div:nth-child(2) {
        flex: 1;
        display: flex;
        margin-right: -30px;
        justify-content: flex-end;
        .el-button {
          width: 70px;
          height: 30px;
        }
      }
    }
    .top {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .el-descriptions {
        flex: 1;
        margin-left: 15px;
        .cell-item {
          display: flex;
          align-items: center;
          .el-icon {
            margin-right: 5px;
          }
        }
      }
    }
    .el-form {
      width: 100%;
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .el-form-item {
        width: 270px;
        .el-input {
          width: 200px;
        }
      }
    }
    .footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .quantity-class {
        font-size: 11px;
        color: #989898;
      }
      .totalPrice-key {
        font-size: 11px;
        color: #000;
      }
      .totalPrice-value {
        font-size: 11px;
        color: #f4532a;
      }
      .pay-button {
        color: #fff;
        font-size: 13px;
        background-color: #f4532a;
      }
    }
  }
</style>

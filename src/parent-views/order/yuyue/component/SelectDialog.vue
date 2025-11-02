<script lang="ts" setup>
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { saveStaffOrders} from '@/api/parent/order.ts'
  import { ref, watch } from 'vue'
  import { useUserStore } from '../../../../store/modules/user'
  const UserStore = useUserStore()
  const dialogVisible = ref<boolean>(false) // 新增弹窗是否展示
  const props = defineProps(['selectDialogVisible', 'rowData'])
  watch(
    () => props.selectDialogVisible,
    () => {
      dialogVisible.value = true
    },
  )
  const formRef = ref(null)
  // 表单数据
  const formData = ref({
    time: '',
  })
  // 表单的效验规则
  const formRules = {
    time: [
      {
        required: true,
        message: '请选择预约时间段',
        trigger: 'blur',
      },
    ],
  }
  /**
   * 支付验证
   */
  const comfirm = () => {
    formRef.value.validate(async (valid) => {
      if (!valid) {
        // 效验错误
        return
      }
      await ElMessageBox.confirm('请确认是否要预约？', '提示', {
        confirmButtonText: '确认预约',
        cancelButtonText: '取消',
        type: 'warning',
      })
      const staffId = props.rowData.staffId
      const userId = UserStore.userInfo.studentId
      const time = ''
      // 调用接口
      await saveStaffOrders({
        staffId: staffId,
        userId: userId,
      })
      dialogVisible.value = false
      ElMessage.success('预约成功')
    })
  }
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    class="el-dialog"
    top="0"
    align-center
    :show-close="false"
    left
    width="50%"
  >
    <template #header>
      <div class="el-dialog__header">
        <div class="header">
          <span>心理医生详情</span>
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
      <el-avatar
        shape="square"
        :size="120"
        fit="cover"
        src="./src/assets/image/avatar.png"
        style="border-radius: 20px"
      />
      <el-descriptions size="default" column="2" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 心理咨询师工号 </div>
          </template>
          {{ props.rowData.staffId }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 姓名 </div>
          </template>
          {{ props.rowData.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 性别 </div>
          </template>
          {{ props.rowData.sex }}
        </el-descriptions-item>
        <el-descriptions-item label="联系方式: ">
          <template #label>
            <div class="cell-item"> 联系方式 </div>
          </template>
          {{ $props.rowData.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 咨询地点 </div>
          </template>
          {{ props.rowData.location }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-form class="el-form" :model="formData" :rules="formRules" ref="formRef">
      <el-form-item label="预约时间段" label-width="100" prop="time">
        <el-col :span="11">
          <el-time-picker
            v-model="formData.time"
            placeholder="请选择预约时间"
            style="width: 200px"
          />
        </el-col>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="comfirm">确定预约</el-button>
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
  }
</style>

<script lang="ts" setup>
  import { ElMessage, FormInstance } from 'element-plus'
  import { ref, watch, reactive, getCurrentInstance } from 'vue'
  import { updateParentInfo } from '@/api/admin/personnelManagement/parent.ts'

  const props = defineProps(['updateDialogVisible', 'rowData'])
  const instance = getCurrentInstance()
  const dialogVisible = ref(false)
  const studentInfoFormRef = ref<FormInstance>(null)
  const studentInfo = reactive({
    parentId: '',
    image: '1',
    name: '',
    sex: '男',
    studentId: '',
    status: false,
    phone: '',
    password: '',
  })
  const studentInfoRules = reactive({
    parentId: [
      {
        required: true,
        message: '监护人不能为空',
        trigger: 'blur',
      },
    ],
    name: [
      {
        required: true,
        message: '监护人姓名不能为空',
        trigger: 'blur',
      },
    ],
    studentId: [
      {
        required: true,
        message: '子女学号不能为空',
        trigger: 'blur',
      },
    ],
    sex: [
      {
        required: true,
        message: '性别不能为空',
        trigger: 'blur',
      },
    ],
    status: [
      {
        required: true,
        message: '账号状态不能为空',
        trigger: 'blur',
      },
    ],
    username: [
      {
        required: true,
        message: '用户名不能为空',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: '密码不能为空',
        trigger: 'blur',
      },
    ],
    phone: [
      {
        required: true,
        message: '手机号不能为空',
        trigger: 'blur',
      },
    ],
  })
  // 监听窗口是否展示
  watch(
    () => props.updateDialogVisible,
    () => {
      dialogVisible.value = true
    },
  )
  watch(
    () => props.rowData,
    (val) => {
      studentInfo.parentId = val.parentId
      studentInfo.name = val.parentName
      studentInfo.sex = val.sex
      studentInfo.studentId = val.studentId
      studentInfo.status = val.status
      studentInfo.phone = val.phone
      studentInfo.password = val.password
      studentInfo.status = val.status || false
    },
    { immediate: true },
  )
  /**
   * 提交表单
   */
  const onConfirm = async () => {
    await studentInfoFormRef.value.validate(async (validate) => {
      if (!validate) {
        // 效验失败
        return
      }
      // 效验通过
      studentInfo.status = studentInfo.status ? 0 : 1
      console.log(studentInfo)
      // 发送请求
      await updateParentInfo(studentInfo)
      instance.emit('hanldeUpdateAllFreshData')
      // 刷新数据
      instance.emit('flush-data')
      // 关闭弹窗
      dialogVisible.value = false
      ElMessage.success('修改成功')
    })
  }
</script>

<template>
  <el-dialog v-model="dialogVisible" title="编辑监护人信息" width="50%" style="padding-right: 40px">
    <el-form
      class="el-form"
      :model="studentInfo"
      :rules="studentInfoRules"
      ref="studentInfoFormRef"
    >
      <el-form-item label="监护人ID" label-width="100" prop="parentId">
        <el-input v-model="studentInfo.parentId" />
      </el-form-item>
      <el-form-item label="监护人姓名" label-width="100" prop="parentName">
        <el-input v-model="studentInfo.name" />
      </el-form-item>
      <el-form-item label="手机号" label-width="100" prop="phone">
        <el-input v-model="studentInfo.phone" />
      </el-form-item>
      <el-form-item label="密码" label-width="100" prop="password">
        <el-input v-model="studentInfo.password" />
      </el-form-item>
      <el-form-item label="子女学号" label-width="100" prop="studentId">
        <el-input v-model="studentInfo.studentId" />
      </el-form-item>
      <el-form-item label="性别" label-width="100" prop="sex">
        <el-radio-group v-model="studentInfo.sex">
          <el-radio label="男" value="男">男</el-radio>
          <el-radio label="女" value="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="账号状态" label-width="100" prop="status">
        <el-switch
          v-model="studentInfo.status"
          inline-prompt
          active-text="禁用"
          inactive-text="正常"
        />
      </el-form-item>
    </el-form>
    <div class="el-button-row">
      <el-button type="default" @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
  .el-form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    ::v-deep(.el-form-item) {
      width: 300px;
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

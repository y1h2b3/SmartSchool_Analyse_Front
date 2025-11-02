<script lang="ts" setup>
  import { ElMessage, FormInstance, dayjs } from 'element-plus'
  import { getAllStudentInfo } from '@/api/admin/personnelManagement/student.ts'
  import { addTeacherInfo, getAllTeacherInfo } from '@/api/admin/personnelManagement/teacher.ts'
  import { ref, watch, reactive, getCurrentInstance, onMounted } from 'vue'

  const props = defineProps(['insertDialogVisible'])
  const instance = getCurrentInstance()
  const dialogVisible = ref(false)
  const teacherInfoFormRef = ref<FormInstance>(null)
  const teacherInfo = reactive({
    deviceId: '',
    teacherId: '',
    image: 'a.jpg',
    password: '',
    post: '',
    clazz: '',
    status: false,
    name: '',
    phone: '',
    sex: '男',
    birth: null,
  })
  const teacherInfoRules = reactive({
    deviceId: [
      {
        required: true,
        message: '设备号不能为空',
        trigger: 'blur',
      },
    ],
    teacherId: [
      {
        required: true,
        message: '工号不能为空',
        trigger: 'blur',
      },
    ],
    post: [
      {
        required: true,
        message: '职位不能为空',
        trigger: 'blur',
      },
    ],
    name: [
      {
        required: true,
        message: '姓名不能为空',
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
    sex: [
      {
        required: true,
        message: '性别不能为空',
        trigger: 'blur',
      },
    ],
    birth: [
      {
        required: true,
        message: '出生日期不能为空',
        trigger: 'blur',
      },
    ],
    clazz: [
      {
        required: true,
        message: '管理班级不能为空',
        trigger: 'blur',
      },
    ],
  })
  // 监听窗口是否展示
  watch(
    () => props.insertDialogVisible,
    () => {
      dialogVisible.value = true
    },
  )
  /**
   * 提交表单
   */
  const onConfirm = async () => {
    await teacherInfoFormRef.value.validate(async (validate) => {
      if (!validate) {
        // 效验失败
        return
      }
      // 效验通过
      const requestData = { ...teacherInfo }
      delete requestData.status
      requestData.status = teacherInfo.status ? 0 : 1
      requestData.birth = dayjs(requestData.birth).format('YYYY-MM-DD')
      console.log(requestData)
      // 发送请求
      await addTeacherInfo(requestData)
      // 刷新数据
      instance.emit('flush-data')
      // 关闭弹窗
      dialogVisible.value = false
      ElMessage.success('新增成功')
    })
  }
  /**
   * 获取职业信息
   */
  const postKey = ref([])
  const getPost = async () => {
    postKey.value = []
    const resp = await getAllTeacherInfo()
    resp.map((item) => {
      if (!postKey.value.includes(item.post)) {
        postKey.value.push(item.post)
      }
    })
  }
  /**
   * 获取年级班级数据
   */
  const clazzKey = ref([])
  const getStudentClazz = async () => {
    // 获取所有的年级和班级信息
    const resp = await getAllStudentInfo()
    clazzKey.value = []
    clazzKey.value.push('无')
    resp.map((item) => {
      if (!clazzKey.value.includes(item.clazz)) {
        clazzKey.value.push(item.clazz)
      }
    })
  }
  onMounted(() => {
    getPost()
    getStudentClazz()
  })
</script>

<template>
  <el-dialog v-model="dialogVisible" title="新增教师信息" width="50%" style="padding-right: 40px">
    <el-form
      class="el-form"
      :model="teacherInfo"
      :rules="teacherInfoRules"
      ref="teacherInfoFormRef"
    >
      <el-form-item label="工号" label-width="100" prop="teacherId">
        <el-input v-model="teacherInfo.teacherId" />
      </el-form-item>
      <el-form-item label="姓名" label-width="100" prop="name">
        <el-input v-model="teacherInfo.name" />
      </el-form-item>
      <el-form-item label="手机号" label-width="100" prop="phone">
        <el-input v-model="teacherInfo.phone" />
      </el-form-item>
      <el-form-item label="密码" label-width="100" prop="password">
        <el-input v-model="teacherInfo.password" />
      </el-form-item>
      <el-form-item label="设备号" label-width="100" prop="deviceId">
        <el-input v-model="teacherInfo.deviceId" />
      </el-form-item>
      <el-form-item label="出生日期" prop="birth" label-width="100">
        <el-date-picker v-model="teacherInfo.birth" type="datetime" />
      </el-form-item>
      <el-form-item label="职位" label-width="100" prop="post">
        <el-select v-model="teacherInfo.post" placeholder="请选择职位">
          <template v-for="(item, index) in postKey" :key="index">
            <el-option :label="item" :value="item" />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="管理班级" label-width="100" prop="clazz">
        <el-select v-model="teacherInfo.clazz" placeholder="请选择班级">
          <template v-for="(item, index) in clazzKey" :key="index">
            <el-option :label="item" :value="item" />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="性别" label-width="100" prop="sex">
        <el-radio-group v-model="teacherInfo.sex">
          <el-radio label="男" value="男">男</el-radio>
          <el-radio label="女" value="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="账号状态" label-width="100" prop="status">
        <el-switch
          v-model="teacherInfo.status"
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

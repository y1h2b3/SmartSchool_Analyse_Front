<script lang="ts" setup>
  import { ElMessage, FormInstance } from 'element-plus'
  import dayjs from 'dayjs'
  import { addStudentInfo, getAllStudentInfo } from '@/api/admin/personnelManagement/student.ts'
  import { getTeacherID } from '@/api/admin/personnelManagement/teacher.ts'
  import { getParentID } from '@/api/admin/personnelManagement/parent.ts'
  import { ref, watch, reactive, getCurrentInstance, onMounted } from 'vue'

  const instance = getCurrentInstance()
  const props = defineProps(['insertDialogVisible'])
  const dialogVisible = ref(false)
  const studentInfoFormRef = ref<FormInstance>(null)
  const studentInfo = reactive({
    deviceId: '',
    studentId: '',
    image: 'a.jpg',
    teacherId: '',
    teacherName: '暂未查询到姓名',
    password: '',
    grade: '',
    clazz: '',
    status: false,
    name: '',
    phone: '',
    sex: '男',
    parentId: '',
    parentName: '暂未查询到姓名',
    birth: null,
  })
  const studentInfoRules = reactive({
    deviceId: [
      {
        required: true,
        message: '设备号不能为空',
        trigger: 'blur',
      },
    ],
    studentId: [
      {
        required: true,
        message: '学号不能为空',
        trigger: 'blur',
      },
    ],
    teacherId: [
      {
        required: true,
        message: '教师ID不能为空',
        trigger: 'blur',
      },
      {
        validator: async (rule, value, callback) => {
          if (value === '') {
            studentInfo.teacherName = '暂未查询到姓名'
            callback(new Error('教师ID不能为空'))
            return
          }
          const resp = await getTeacherID(value)
          console.log(resp)
          if (resp === null || resp === '') {
            studentInfo.teacherName = '暂未查询到姓名'
            callback(new Error('教师ID不存在'))
            return
          }
          studentInfo.teacherName = resp
          callback()
        },
      },
    ],
    grade: [
      {
        required: true,
        message: '年级不能为空',
        trigger: 'blur',
      },
    ],
    clazz: [
      {
        required: true,
        message: '班级不能为空',
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
    parentId: [
      {
        validator: async (rule, value, callback) => {
          if (value === '') {
            studentInfo.parentName = '暂未查询到姓名'
            callback(new Error('监护人ID不能为空'))
            return
          }
          const resp = await getParentID(value)
          if (resp === null || resp === '未找到家长') {
            studentInfo.parentName = '暂未查询到姓名'
            callback(new Error('监护人ID不存在'))
            return
          }
          studentInfo.parentName = resp
          callback()
        },
      },
    ],
    birth: [
      {
        required: true,
        message: '出生日期不能为空',
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
   * 获取年级班级数据
   */
  const gradeKey = ref([])
  const clazzKey = ref([])
  const gradeMap = ref(new Map())
  const getGradeAndClazz = async () => {
    gradeKey.value = []
    gradeMap.value.clear()
    // 获取所有的年级和班级信息
    const resp = await getAllStudentInfo()
    resp.map((item) => {
      if (!gradeMap.value.get(item.grade)) {
        gradeKey.value.push(item.grade)
        gradeMap.value.set(item.grade, [])
      }
      if (!gradeMap.value.get(item.grade).includes(item.clazz)) {
        gradeMap.value.get(item.grade).push(item.clazz)
      }
    })
  }
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
      const requestData = { ...studentInfo }
      delete requestData.parentName
      delete requestData.teacherName
      delete requestData.status
      requestData.status = studentInfo.status === true ? 1 : 0
      requestData.birth = dayjs(requestData.birth).format('YYYY-MM-DD')
      console.log(requestData)
      // 发送请求
      await addStudentInfo(requestData)
      // 刷新数据
      instance.emit('hanldeUpdateAllFreshData')
      instance.emit('flush-data')
      // 关闭弹窗
      dialogVisible.value = false
      ElMessage.success('新增成功')
    })
  }
  watch(
    () => studentInfo.grade,
    (val) => {
      clazzKey.value = gradeMap.value.get(val)
      studentInfo.clazz = clazzKey.value[0]
    },
  )
  onMounted(() => {
    getGradeAndClazz()
  })
</script>

<template>
  <el-dialog v-model="dialogVisible" title="新增学生信息" width="50%" style="padding-right: 40px">
    <el-form
      class="el-form"
      :model="studentInfo"
      :rules="studentInfoRules"
      ref="studentInfoFormRef"
    >
      <el-form-item label="学号" label-width="90" prop="studentId">
        <el-input v-model="studentInfo.studentId" />
      </el-form-item>
      <el-form-item label="姓名" label-width="90" prop="name">
        <el-input v-model="studentInfo.name" />
      </el-form-item>
      <el-form-item label="手机号" label-width="90" prop="phone">
        <el-input v-model="studentInfo.phone" />
      </el-form-item>
      <el-form-item label="密码" label-width="90" prop="password">
        <el-input v-model="studentInfo.password" />
      </el-form-item>
      <el-form-item label="设备号" label-width="90" prop="deviceId">
        <el-input v-model="studentInfo.deviceId" />
      </el-form-item>
      <el-form-item label="账号状态" label-width="100" prop="status">
        <el-switch
          v-model="studentInfo.status"
          inline-prompt
          active-text="禁用"
          inactive-text="正常"
        />
      </el-form-item>
      <el-form-item label="年级" label-width="90" prop="grade">
        <el-select v-model="studentInfo.grade" placeholder="请选择年级">
          <template v-for="(item, index) in gradeKey" :key="index">
            <el-option :label="item" :value="item" />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="班级" label-width="90" prop="clazz">
        <el-select v-model="studentInfo.clazz" placeholder="请选择班级">
          <template v-for="(item, index) in clazzKey" :key="index">
            <el-option :label="item" :value="item" />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="班主任ID" label-width="90" prop="teacherId">
        <el-input v-model="studentInfo.teacherId" />
      </el-form-item>
      <el-form-item label="班主任姓名" label-width="90" prop="teacherName">
        <el-input v-model="studentInfo.teacherName" disabled />
      </el-form-item>
      <el-form-item label="监护人ID" label-width="90" prop="parentId">
        <el-input v-model="studentInfo.parentId" />
      </el-form-item>
      <el-form-item label="监护人姓名" label-width="90" prop="parentName">
        <el-input v-model="studentInfo.parentName" disabled />
      </el-form-item>
      <el-form-item label="出生日期" prop="birth" label-width="90">
        <el-date-picker v-model="studentInfo.birth" type="datetime" />
      </el-form-item>
      <el-form-item label="性别" label-width="90" prop="sex">
        <el-radio-group v-model="studentInfo.sex">
          <el-radio label="男" value="男">男</el-radio>
          <el-radio label="女" value="女">女</el-radio>
        </el-radio-group>
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

<script lang="ts" setup>
  import { ElMessage, FormInstance, dayjs } from 'element-plus'
  import { ref, watch, reactive, getCurrentInstance, onMounted } from 'vue'
  import { updateStaffInfo, getAllStaffInfo } from '@/api/admin/medicalServices/dangerCall.ts'

  const props = defineProps(['updateDialogVisible', 'rowData'])
  const instance = getCurrentInstance()
  const dialogVisible = ref(false)
  const userInfoFormRef = ref<FormInstance>(null)
  const userInfo = reactive({
    staffId: '',
    name: '',
    phone: '',
    sex: '',
    location: '',
    isActive: '',
    note: '',
    birth: null,
  })
  const userInfoRules = reactive({
    staffId: [
      {
        required: true,
        message: '工号不能为空',
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
    phone: [
      {
        required: true,
        message: '手机号不能为空',
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
    location: [
      {
        required: true,
        message: '职位不能为空',
        trigger: 'blur',
      },
    ],
    isActive: [
      {
        required: true,
        message: '在职情况不能为空',
        trigger: 'blur',
      },
    ],
    note: [],
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
      userInfo.staffId = val.staffId
      userInfo.name = val.name
      userInfo.phone = val.phone
      userInfo.sex = val.sex
      userInfo.location = val.location
      userInfo.isActive = val.isActive
      userInfo.note = val.note
      userInfo.birth = dayjs(val.birth).toDate()
    },
    { immediate: true },
  )
  // 在职情况选择
  const options = [
    { value: '1', label: '在职' },
    { value: '0', label: '休假' },
  ]
  /**
   * 提交表单
   */
  const onConfirm = async () => {
    await userInfoFormRef.value.validate(async (validate) => {
      if (!validate) {
        // 效验失败
        return
      }
      // 效验通过
      userInfo.birth = dayjs(userInfo.birth).format('YYYY-MM-DD')
      console.log(userInfo)
      // 发送请求
      await updateStaffInfo(userInfo)
      // 刷新数据
      instance.emit('flush-data')
      // 关闭弹窗
      dialogVisible.value = false
      ElMessage.success('新增成功')
    })
  }
  const localOptions = ref([])
  onMounted(async () => {
    // 获取所有的年级和班级信息
    localOptions.value = []
    const postList = []

    const resp = await getAllStaffInfo(1, 1000000)
    resp.records.map((item) => {
      if (!postList.includes(item.location)) {
        localOptions.value.push({ value: item.location, label: item.location })
        postList.push(item.location)
      }
    })
  })
</script>

<template>
  <el-dialog v-model="dialogVisible" title="编辑" width="50%" style="padding-right: 40px">
    <el-form class="el-form" :model="userInfo" :rules="userInfoRules" ref="userInfoFormRef">
      <el-form-item label="工号" label-width="100" prop="staffId">
        <el-input v-model="userInfo.staffId" />
      </el-form-item>
      <el-form-item label="姓名" label-width="100" prop="name">
        <el-input v-model="userInfo.name" />
      </el-form-item>
      <el-form-item label="手机号" label-width="100" prop="phone">
        <el-input v-model="userInfo.phone" />
      </el-form-item>
      <el-form-item label="咨询室" label-width="100" prop="location">
        <el-select style="width: 220px" v-model="userInfo.location">
          <template v-for="item in localOptions" :key="item.value">
            <el-option :label="item.label" :value="item.value"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="在职情况" label-width="100" prop="isActive">
        <el-select style="width: 220px" v-model="userInfo.isActive">
          <template v-for="item in options" :key="item.value">
            <el-option :label="item.label" :value="item.value"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" label-width="100" prop="note">
        <el-input v-model="userInfo.note" placeholder="默认无" />
      </el-form-item>
      <el-form-item label="出生日期" prop="birth" label-width="100">
        <el-date-picker v-model="userInfo.birth" type="datetime" />
      </el-form-item>
      <el-form-item label="性别" label-width="100" prop="sex">
        <el-radio-group v-model="userInfo.sex">
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

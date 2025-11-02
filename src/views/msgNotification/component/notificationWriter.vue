<script lang="ts" setup>
  // 用户是否屏幕放大
  import { addNotifications } from '@/api/admin/msgNotification/index.ts'
  import { useSettingStore } from '@/store/modules/setting'
  import { useUserStore } from '../../../store/modules/user'
  const SettingStore = useSettingStore()
  const UserStore = useUserStore()
  import { ref, onMounted, watch, reactive, getCurrentInstance } from 'vue'
  import dayjs from 'dayjs'
  import { ElMessage } from 'element-plus'

  const instance = getCurrentInstance()
  const formRef = ref(null)
  const currentTime = ref(null)
  const writerInfoValue = ref({})
  const writerInfoOptions = ref([
    /* {
      value: '208925256',
      label: 'ing<208925256@qq.com>',
    }, */
  ])
  const recipientInfoValue = ref([])
  const recipientInfoOptions = ref([
    {
      value: '家长',
      label: '家长',
    },
    {
      value: '教师',
      label: '教师',
    },
    {
      value: '后勤',
      label: '后勤',
    },
  ])
  watch(recipientInfoValue, (val) => {
    formData.notifyGroup = '['
    for (let i = 0; i < val.length; i++) {
      formData.notifyGroup += val[i]
      if (i != val.length - 1) formData.notifyGroup += ','
    }
    formData.notifyGroup += ']'
    console.log(formData.notifyGroup)
  })
  const formData = reactive({
    publisher: '',
    notifyGroup: '',
    title: '',
    content: '',
    notifyId: Math.floor(Math.random() * 99999999),
  })
  const formRules = {
    publisher: [
      {
        validator: (rule, val, callback) => {
          callback()
        },
      },
      {
        required: true,
        message: '发布人信息不能为空',
        trigger: 'blur',
      },
    ],
    notifyGroup: [
      {
        validator: (rule, val, callback) => {
          if (val === '' || val === '[]') {
            callback(new Error('接收人不能为空'))
            return
          }
          callback()
        },
      },
      {
        required: true,
        message: '',
        trigger: 'blur',
      },
    ],
    title: [
      {
        validator: (rule, val, callback) => {
          callback()
        },
      },
      {
        required: true,
        message: '主题不能为空',
        trigger: 'blur',
      },
    ],
  }
  /**
   * 新增通知
   */
  const confirm = () => {
    formRef.value.validate(async (valid) => {
      if (!valid) {
        // 效验错误
        return
      }
      const data = formData
      console.log(data)
      await addNotifications(data)
      // 新增成功
      // 跳转到已发送页面
      instance.emit('update-navIndex', 1)
      ElMessage.success('发送成功')
    })
  }
  onMounted(() => {
    writerInfoOptions.value.push({
      value: '208925256',
      label: UserStore.userInfo.username,
    })
    // 自动选择第一个元素
    writerInfoValue.value = writerInfoOptions.value[0].value
    // 每秒更新一次时间
    setInterval(() => {
      currentTime.value = '当前北京时间：' + dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }, 1000)
  })
</script>

<template>
  <div class="content">
    <div class="header">
      <span>新通知</span>
    </div>
    <el-form class="el-form" :model="formData" :rules="formRules" ref="formRef">
      <el-form-item label="通知群体" label-width="80" class="recipient-box" prop="notifyGroup">
        <el-select-v2
          v-model="recipientInfoValue"
          multiple
          :options="recipientInfoOptions"
          style="width: 255px"
        />
      </el-form-item>
      <el-form-item label="发布人" label-width="65" prop="publisher">
        <el-input placeholder="输入发布人" v-model="formData.publisher" />
      </el-form-item>
      <el-form-item label="主&nbsp;&nbsp;&nbsp;题" label-width="65" prop="title">
        <el-input class="el-input" placeholder="输入主题" v-model="formData.title" />
      </el-form-item>
      <el-form-item prop="content">
        <el-input
          v-model="formData.content"
          type="textarea"
          placeholder="输入正文"
          :style="{ height: `${SettingStore.isFull ? 480 : 350}px` }"
        />
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button type="primary" @click="confirm">发送</el-button>
      <el-select-v2
        v-model="writerInfoValue"
        :options="writerInfoOptions"
        placement="top-start"
        style="width: 150px !important"
      />
      <span class="time">{{ currentTime }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    flex: 1;
    height: 100%;
    background-color: #fff !important;
    flex-direction: column;
    .header {
      width: 100%;
      height: 50px;
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .el-form {
      padding: 0 30px;
      box-sizing: border-box;
      .recipient-box {
        ::v-deep(.el-select-v2__wrapper) {
          border: none;
        }
      }
      .el-form-item {
        border-bottom: 1px solid #e6e8eb;
        ::v-deep(.el-form-item__error) {
          padding-top: 5px;
          padding-left: 1%;
        }
        ::v-deep(.el-input__wrapper) {
          box-shadow: none;
        }
        ::v-deep(.el-textarea__inner) {
          height: 350px !important;
          box-shadow: none;
          resize: none;
        }
      }
    }
    .footer {
      width: 100%;
      height: 60px;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .el-button {
        width: 80px;
        margin: 0 10px;
      }
      .el-select-v2 {
        margin: 0 10px;
      }
      .time {
        font-size: 13px;
        color: #a8abb2;
        position: absolute;
        right: 50px;
      }
    }
  }
</style>

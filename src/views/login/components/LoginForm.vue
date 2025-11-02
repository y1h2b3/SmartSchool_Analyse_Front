<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="0"
    v-if="isLoginWay === 1"
  >
    <el-form-item label="" prop="username">
      <el-input
        placeholder="请输入账号或手机号"
        autoComplete="on"
        style="position: relative"
        v-model="ruleForm.username"
        @keyup.enter.native="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><UserFilled /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input
        placeholder="请输入密码"
        autoComplete="on"
        @keyup.enter.native="submitForm(ruleFormRef)"
        v-model="ruleForm.password"
        :type="passwordType"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><GoodsFilled /></el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd"
            ><svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          /></div>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="role">
      <el-select v-model="ruleForm.role" placeholder="请选择角色">
        <el-option label="家长" value="家长" />
        <el-option label="教师" value="教师" />
        <el-option label="后勤" value="后勤" />
        <el-option label="管理员" value="管理员" />
      </el-select>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button
        :loading="loading"
        class="login-btn"
        type="primary"
        @click="submitForm(ruleFormRef)"
        >登录</el-button
      >
    </el-form-item>
    <el-form-item>
      <span class="msg-login" @click="goToMsgLogin">短信验证登录</span>
    </el-form-item>
  </el-form>
  <el-form ref="ruleFormRef2" :model="ruleForm2" :rules="rules2" label-width="0" v-else>
    <el-form-item label="" prop="phone">
      <el-input
        placeholder="请输入手机号"
        autoComplete="on"
        style="position: relative"
        v-model="ruleForm2.phone"
        @keyup.enter.native="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><Iphone /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="" prop="code" style="width: 100%; display: flex">
      <el-input
        placeholder="请输入验证码"
        autoComplete="on"
        @keyup.enter.native="submitForm(ruleFormRef)"
        v-model="ruleForm2.code"
        style="width: 260px"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><ChatLineRound /></el-icon>
        </template>
      </el-input>
      <el-button style="width: 120px; height: 42px; margin-left: 20px" @click="startCountdown">{{ timeNow }}</el-button>
    </el-form-item>
    <el-form-item prop="role">
      <el-select v-model="ruleForm2.role" placeholder="请选择角色">
        <el-option label="家长" value="家长" />
        <el-option label="教师" value="教师" />
        <el-option label="后勤" value="后勤" />
        <el-option label="管理员" value="管理员" />
      </el-select>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button
        :loading="loading"
        class="login-btn"
        type="primary"
        @click="submitForm2(ruleFormRef2)"
        >登录</el-button
      >
    </el-form-item>
    <el-form-item>
      <span class="msg-login" @click="goToMsgLogin">账号密码登录</span>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { ElNotification } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '../../../store/modules/user'
  import { useWeatherStore } from '../../../store/modules/weather'
  import { adminLogin, userLogin } from '@/api/login/login.ts'
  import { findAllParent } from '@/api/parent/login.ts'
  import { getSMS, checkSMS } from '@/api/login/login.ts'
  const ruleFormRef = ref<FormInstance>()
  const router = useRouter()
  const UserStore = useUserStore()
  const WeatherStore = useWeatherStore()
  const passwordType = ref('password')
  const loading = ref(false)
  const rules = reactive({
    username: [{ required: true, message: '请输入账号或手机号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
  })
  const ruleFormRef2 = ref<FormInstance>()
  // 表单数据
  const ruleForm = reactive({
    username: '',
    password: '',
    role: '',
  })
  // 表单数据
  const ruleForm2 = reactive({
    phone: '',
    code: '',
    role: '',
  })
  const rules2 = reactive({
    phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
    code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
  })
  const startCountdown = async () => {
    await getSMS(ruleForm2.phone)
    let seconds = 60
    const timer = setInterval(() => {
      seconds--
      if (seconds <= 0) {
        clearInterval(timer)
        timeNow.value = '重新发送'
      } else {
        timeNow.value = `${seconds}s后重新发送`
      }
    }, 1000)
  }
  const timeNow = ref('发送验证码')
  const showPwd = () => {
    if (passwordType.value === 'password') {
      passwordType.value = ''
    } else {
      passwordType.value = 'password'
    }
  }
  const isLoginWay = ref(1)
  const goToMsgLogin = () => {
    isLoginWay.value = isLoginWay.value === 1 ? 2 : 1
  }
  /**
   * 获取当前时间
   */
  const getTimeState = () => {
    // 获取当前时间
    const timeNow = new Date()
    // 获取当前小时
    const hours = timeNow.getHours()
    // 判断当前时间段
    if (hours >= 6 && hours <= 10) {
      return `早上好 ⛅`
    } else if (hours >= 10 && hours <= 14) {
      return `中午好 🌞`
    } else if (hours >= 14 && hours <= 18) {
      return `下午好 🌞`
    } else if (hours >= 18 && hours <= 24) {
      return `晚上好 🌛`
    } else if (hours >= 0 && hours <= 6) {
      return `凌晨好 🌛`
    }
  }
  const submitForm = (formEl: FormInstance | undefined) => {
    loading.value = true
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        // 获取用户所在地以及天气
        WeatherStore.getAddressInfo()
        // 登录
        setTimeout(async () => {
          const username = ruleForm.username
          const password = ruleForm.password
          let userInfo = ruleForm
          try {
            let resp = null
            if (ruleForm.role === '管理员') {
              resp = await adminLogin(username, password)
            } else if (ruleForm.role === '家长') {
              resp = await userLogin(username, password)
              const data = await findAllParent()
              const dataInfo = data.filter((item) => {
                return item.phone === username
              })
              userInfo = dataInfo[0]
              userInfo.username = dataInfo[0].studentName + '家长'
            } else {
              resp = await userLogin(username, password)
            }
            console.log(resp.tokenValue)
            userInfo.role = ruleForm.role
            const token = resp.tokenValue
            await UserStore.login(userInfo, token)
            UserStore.isMsg = true
            await router.push({
              path: '/',
            })
            ElNotification({
              title: getTimeState(),
              message: '欢迎登录 智慧校园健康监测与分析',
              type: 'success',
              duration: 3000,
            })
          } catch (error) {
            console.log(error)
          } finally {
            loading.value = false
          }
        }, 1000)
      } else {
        return false
      }
    })
  }
  const submitForm2 = (formEl: FormInstance | undefined) => {
    loading.value = true
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        // 获取用户所在地以及天气
        WeatherStore.getAddressInfo()
        // 登录
        setTimeout(async () => {
          const phone = ruleForm2.phone
          const code = ruleForm2.code
          let userInfo = ruleForm2
          try {
            let resp = null
            if (ruleForm2.role === '家长') {
              resp = await checkSMS(phone, code)
              const data = await findAllParent()
              const dataInfo = data.filter((item) => {
                return item.phone === phone
              })
              userInfo = dataInfo[0]
              userInfo.username = dataInfo[0].studentName + '家长'
            }
            console.log(userInfo)
            userInfo.role = ruleForm2.role
            const token = resp.tokenValue
            // const token = '1'
            await UserStore.login(userInfo, token)
            UserStore.isMsg = true
            await router.push({
              path: '/',
            })
            ElNotification({
              title: getTimeState(),
              message: '欢迎登录 智慧校园健康监测与分析',
              type: 'success',
              duration: 3000,
            })
          } catch (error) {
            console.log(error)
          } finally {
            loading.value = false
          }
        }, 1000)
      } else {
        return false
      }
    })
  }
</script>

<style lang="scss" scoped>
  .login-box {
    position: relative;
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    .login-left {
      width: 50%;
      img {
        width: 100%;
        max-width: 900px;
      }
    }
    .login-form {
      max-width: 480px;
      width: 50%;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      box-sizing: border-box;
      .el-select {
        width: 150px;
      }
      .msg-login {
        width: 100%;
        text-align: right;
        cursor: pointer;
      }
    }
    .login-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
      .title {
        margin: 0;
        font-size: 30px;
        white-space: nowrap;
      }
      .icon {
        width: 60px;
      }
    }
    :deep(.el-input__inner) {
      height: 40px;
    }
  }
  .login-btn {
    margin-top: 20px;
    width: 100%;
    height: 47px;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
    :deep(.svg-icon) {
      vertical-align: 0;
    }
  }
  .login-container {
    background-color: #f0f2f5;
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 25px 25px;
    box-sizing: border-box;
  }
  .login-dark {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  @media (max-width: 850px) {
    .login-container {
      padding: 10px;
    }
    .login-box {
      .login-form {
        width: 88%;
        .title {
          font-size: 20px;
        }
      }
    }
    .login-left {
      display: none;
    }
  }
</style>

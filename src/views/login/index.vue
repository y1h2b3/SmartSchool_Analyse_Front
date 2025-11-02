<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-form">
        <div class="login-title">
          <!-- <img class="icon" src="@/assets/logo.png" alt="logo" />
          <h2 class="title">智慧校园健康监测与分析</h2> -->
          <h2 class="title">登录</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoginForm from './components/LoginForm.vue'
  import { useUserStore } from '../../store/modules/user'
  const UserStore = useUserStore()
  import { onMounted } from 'vue'

  onMounted(() => {
    UserStore.logout()
  })
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

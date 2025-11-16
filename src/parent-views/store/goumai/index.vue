<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessageBox } from 'element-plus'
  import StoreItem from './component/StoreItem.vue'
  
  const route = useRoute()
  const router = useRouter()
  
  onMounted(() => {
    // 检查是否有支付成功参数
    const paymentSuccess = route.query.paymentSuccess
    
    if (paymentSuccess === 'true') {
      // 显示支付成功弹窗
      ElMessageBox.confirm(
        '恭喜您，支付成功！订单已创建。',
        '支付成功',
        {
          confirmButtonText: '查看订单',
          cancelButtonText: '继续购买',
          type: 'success',
          showClose: false,
          customStyle: {
            width: '450px',
          },
        }
      ).then(() => {
        // 点击“查看订单”
        router.push('/store-order')
      }).catch(() => {
        // 点击“继续购买”，清除 URL 参数
        router.replace('/store-buy')
      })
    } else if (paymentSuccess === 'false') {
      // 支付失败
      ElMessageBox.alert(
        '支付失败，请重试。',
        '支付失败',
        {
          type: 'error',
          confirmButtonText: '确定',
        }
      ).then(() => {
        router.replace('/store-buy')
      })
    }
  })
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner">
      <StoreItem></StoreItem>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .app-container-inner {
    padding: 0;
    background-color: transparent;
    box-shadow: none;
  }
</style>

<style lang="scss">
  /* 支付弹窗尺寸调整 */
  .el-message-box {
    width: 450px !important;
    
    .el-message-box__header {
      padding: 20px 20px 15px;
      
      .el-message-box__title {
        font-size: 18px;
        font-weight: 600;
      }
    }
    
    .el-message-box__content {
      padding: 20px;
      font-size: 16px;
    }
    
    .el-message-box__btns {
      padding: 15px 20px 20px;
      
      button {
        min-width: 110px;
        height: 38px;
        font-size: 15px;
        
        /* 移除按钞上的白色遮罩 */
        &::before,
        &::after {
          display: none !important;
        }
        
        /* 确保按钞颜色正常显示 */
        &.el-button--primary {
          background-color: #409eff;
          border-color: #409eff;
          color: #ffffff;
          
          &:hover {
            background-color: #66b1ff;
            border-color: #66b1ff;
          }
        }
      }
    }
  }
</style>

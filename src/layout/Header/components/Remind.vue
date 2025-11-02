<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="m-info">
    <el-popover width="200px" placement="bottom">
      <template #reference>
        <template v-if="UserStore.isMsg === true">
          <el-badge :value="1" class="item-info-pop">
            <el-icon class="bell" style="font-size: 20px"><Bell /></el-icon>
          </el-badge>
        </template>
        <template v-else>
          <el-icon class="bell" style="font-size: 20px"><Bell /></el-icon>
        </template>
      </template>
      <div>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="未读通知" name="first">
            <div class="item-child" v-if="UserStore.isMsg === true">
              <span style="color: #000; cursor: pointer; opacity: 0.6" @click="goToMsg">
                安全员 - 地震预警
              </span>
            </div>
            <el-empty image-size="40" style="height: 20px" v-else />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import type { TabsPaneContext } from 'element-plus'
  import router from '@/router/index.ts'
  import { useUserStore } from '../../../store/modules/user'
  const UserStore = useUserStore()

  const activeName = ref('first')
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
  const goToMsg = () => {
    router.push({
      path: '/msg-notice',
    })
    UserStore.setIsMsg()
  }
</script>

<style lang="scss" scoped>
  .m-info {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    .item-info-pop {
      display: flex;
      align-items: center;
    }
    .bell {
      color: black;
    }
    .item-child {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
    }
  }
  :deep(.el-divider--horizontal) {
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .transverseMenu {
    .bell {
      color: white;
    }
  }
</style>

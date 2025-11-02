<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="m-layout-header"
    :class="[
      SettingStore.themeConfig.fixedHeader ? 'zb-fixed-header' : 'zb-no-fixed-header',
      mode === 'horizontal'
        ? ''
        : isCollapse
        ? 'fixed-header-collapse'
        : 'fixed-header-no-collapse',
    ]"
  >
    <div class="header" :class="{ transverseMenu: mode === 'horizontal' }">
      <UMenu v-if="mode === 'horizontal'" />

      <div class="left" v-if="mode === 'vertical'">
        <CollapseIcon />
        <Hamburger />
      </div>

      <div class="tool-bar-right">
        <!-- <Remind class="right-item-menu" /> -->
        <ScreenFull class="right-item-menu" />
        <Avatar />
      </div>
    </div>
    <tag-views v-if="showTag" />
  </div>
</template>

<script lang="ts" setup>
  import TagViews from '../TagsView/index.vue'
  import Hamburger from './components/Hamburger.vue'
  import ScreenFull from './components/ScreenFull.vue'
  import Remind from './components/Remind'
  import CollapseIcon from './components/CollapseIcon'
  import Avatar from './components/Avatar'
  import UMenu from '../Sidebar/components/Menu.vue'
  import { computed, watch } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  import { useFullscreen } from '@vueuse/core'
  const { isFullscreen } = useFullscreen()

  const SettingStore = useSettingStore()

  const isCollapse = computed(() => !SettingStore.isCollapse)
  // menu 布局
  const mode = computed(() => SettingStore.themeConfig.mode)
  // 显示 tag
  const showTag = computed(() => SettingStore.themeConfig.showTag)

  watch(isFullscreen, (val) => {
    SettingStore.setIsFull(val)
  })
</script>

<style lang="scss" scoped>
  .mobile {
    .m-layout-header {
      left: 0 !important;
      width: 100% !important;
    }
  }
  .header {
    height: 50px;
    width: 100%;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    padding: 0 10px 0 0;
    box-sizing: border-box;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      height: 100%;
    }
    .tool-bar-right {
      display: flex;
      align-items: center;
      .right-item-menu {
        margin-right: 22px;
      }
    }
  }
  .zb-fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
  }
  .zb-no-fixed-header {
    width: 100% !important;
  }
  .m-layout-header {
    width: 100%;
    background: white;
    transition: width 0.28s;
    flex-shrink: 0;
    box-sizing: border-box;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  }
  .fixed-header-collapse {
    width: calc(100% - 60px);
  }
  .fixed-header-no-collapse {
    width: calc(100% - 210px);
  }
  .el-dropdown {
    display: flex;
    height: 100%;
    align-items: center;
  }
  .transverseMenu {
    display: flex;
    .el-menu {
      overflow: hidden;
    }
    .tool-bar-right {
      display: flex;
      justify-content: flex-end;
      min-width: 300px;
      flex-shrink: 0;
    }
  }
</style>

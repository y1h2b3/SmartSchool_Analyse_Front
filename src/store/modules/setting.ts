import { defineStore } from 'pinia'
import { useFullscreen } from '@vueuse/core'
const { isFullscreen } = useFullscreen()

export const useSettingStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'settingState',
  // state: 返回对象的函数
  state: () => ({
    // menu 是否收缩
    isCollapse: true,
    //
    withoutAnimation: false,
    // isFull 是否全屏展示
    isFull: isFullscreen.value,
    device: 'desktop',
    // 刷新当前页
    isReload: true,
    // 主题设置
    themeConfig: {
      // 菜单展示模式 默认 vertical   horizontal / vertical
      mode: 'vertical',
      // tagsView 是否展示 默认展示
      showTag: true,
      // 显示侧边栏Logo
      showLogo: true,
      // 主题颜色
      primary: '#409eff',
      // 是否只保持一个子菜单的展开
      uniqueOpened: true,
      // 固定header
      fixedHeader: true,
    },
  }),
  getters: {},
  // 可以同步 也可以异步
  actions: {
    // 设置主题
    setThemeConfig({ key, val }) {
      this.themeConfig[key] = val
    },
    // 切换 isFull
    setIsFull(value) {
      this.isFull = value
    },
    // 切换 Collapse
    setCollapse(value) {
      this.isCollapse = value
      this.withoutAnimation = false
    },
    // 关闭侧边栏
    closeSideBar({ withoutAnimation }) {
      this.isCollapse = false
      this.withoutAnimation = withoutAnimation
    },
    toggleDevice(device) {
      this.device = device
    },
    // 刷新
    setReload() {
      this.isReload = false
      setTimeout(() => {
        this.isReload = true
      }, 50)
    },
  },
})

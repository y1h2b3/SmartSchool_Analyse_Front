import { defineStore } from 'pinia'
import { usePermissionStore } from './permission'

export const useUserStore = defineStore({
  id: 'userState',
  state: () => ({
    token: null,
    userInfo: {},
    roles: [],
    isMsg: true,
  }),
  actions: {
    // 登录
    login(userInfo, token) {
      return new Promise<void>((resolve, reject) => {
        this.token = token
        this.userInfo = userInfo
        this.getRoles(userInfo.role)
        resolve()
      })
    },
    getRoles(role) {
      return new Promise((resolve, reject) => {
        this.roles = []
        this.roles.push(role)
        resolve(this.roles)
      })
    },
    getInfo(roles) {
      return new Promise((resolve, reject) => {
        this.roles = roles
        resolve(roles)
      })
    },
    // 退出
    logout() {
      return new Promise((resolve, reject) => {
        this.token = null
        this.userInfo = {}
        this.roles = []
        const PermissionStore = usePermissionStore()
        PermissionStore.clearRoutes()
        resolve(null)
      })
    },
    setIsMsg() {
      this.isMsg = false
    },
  },
  // 进行持久化存储
  persist: {
    storage: {
      getItem(key): string {
        return localStorage.getItem(key)
      },
      setItem(key, value): void {
        localStorage.setItem(key, value)
      },
    },
  },
})

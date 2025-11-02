import { defineStore } from 'pinia'
import { asyncRoutes, asyncParentRoutes, constantRoutes, asyncTeacherRoutes, asynclogisticRoutes } from '../../router/index'
import { filterKeepAlive } from '../../utils/routers'

export const usePermissionStore = defineStore({
  id: 'permissionState',
  state: () => ({
    routes: [],
    addRoutes: [],
    cacheRoutes: {},
  }),
  getters: {
    permission_routes: (state) => {
      return state.routes
    },
  },
  actions: {
    generateRoutes(roles) {
      return new Promise((resolve) => {
        let accessedRoutes = asyncRoutes || []
        if (roles && roles.length) {
          if (roles.includes('管理员')) {
            accessedRoutes = asyncRoutes || []
          } else if (roles.includes('家长')) {
            accessedRoutes = asyncParentRoutes || []
          } else if (roles.includes('后勤')) {
            accessedRoutes = asynclogisticRoutes || []
          } else if (roles.includes('教师')) {
            accessedRoutes = asyncTeacherRoutes || []
          } else {
            accessedRoutes = []
          }
        }
        this.routes = constantRoutes.concat(accessedRoutes)
        this.addRoutes = accessedRoutes
        resolve(accessedRoutes)
      })
    },
    clearRoutes() {
      this.routes = []
      this.addRoutes = []
      this.cacheRoutes = []
    },
    getCacheRoutes() {
      this.cacheRoutes = filterKeepAlive(asyncRoutes)
      return this.cacheRoutes
    },
  },
})

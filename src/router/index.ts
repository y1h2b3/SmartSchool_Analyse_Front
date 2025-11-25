import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router'
// 扩展继承属性
interface extendRoute {
  hidden?: boolean
}
/**
 * 管理端路由
 */
import adminIndexTableRouter from './modules/admin/index'
import personnelManagementRouter from './modules/admin/personnelManagement'
import healthManagementRouter from './modules/admin/healthManagement'
import msgNotificationRouter from './modules/admin/msgNotification'
import medicalServicesRouter from './modules/admin/medicalServices'
import alertNoticeRouter from './modules/admin/alertNotice'
import systemAdministrationRouter from './modules/admin/systemAdministration'
import dataAnalyticsRouter from './modules/admin/dataAnalytics'
/**
 * 用户端路由
 */
import userIndexTableRouter from './modules/user/index'
import userStoreTableRouter from './modules/user/store'
import userHealthTableRouter from './modules/user/health'
import userNoticeTableRouter from './modules/user/notice'
import userOrderTableRouter from './modules/user/order'
/**
 * 监护人端路由
 */
import parentIndexTableRouter from './modules/parent'
import parentStoreTableRouter from './modules/parent/store'
import parentHealthTableRouter from './modules/parent/health'
import parentNoticeTableRouter from './modules/parent/notice'
import parentOrderTableRouter from './modules/parent/order'
/**
 * 教师端路由
 */
import teacherIndexTableRouter from './modules/teacher'

const adminRouter = [
  /* 管理端路由 */
  ...adminIndexTableRouter,
  ...personnelManagementRouter,
  ...healthManagementRouter,
  ...msgNotificationRouter,
  ...medicalServicesRouter,
  ...alertNoticeRouter,
  ...systemAdministrationRouter,
  ...dataAnalyticsRouter,
]

const userRouter = [
  /* 用户端路由 */
  ...userIndexTableRouter,
  ...userStoreTableRouter,
  ...userHealthTableRouter,
  ...userNoticeTableRouter,
  ...userOrderTableRouter,
]

const parentRouter = [
  /* 家长端路由 */
  ...parentIndexTableRouter,
  ...parentHealthTableRouter,
  ...parentNoticeTableRouter,
  ...parentStoreTableRouter,
  ...parentOrderTableRouter,
]

const teacherRouter = [
  /* 教师端路由 */
  ...parentIndexTableRouter,
  ...parentHealthTableRouter,
  ...parentNoticeTableRouter,
  ...parentStoreTableRouter,
  ...parentOrderTableRouter,
]

export const asyncRoutes = [
  ...adminRouter,
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
]

export const asyncParentRoutes = [
  ...parentRouter,
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
]
export const asyncTeacherRoutes = [
  ...teacherRouter,
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
]
export const asynclogisticRoutes = [
  ...parentRouter,
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
]
export const constantRoutes: Array<RouteRecordRaw & extendRoute> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: { title: '登录' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

export default router

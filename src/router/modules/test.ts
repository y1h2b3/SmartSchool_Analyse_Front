import type { RouteRecordRaw } from 'vue-router'

const testRouter: Array<RouteRecordRaw> = [
  {
    path: '/test/location',
    name: 'LocationTest',
    component: () => import('@/views/test/LocationTest.vue'),
    meta: {
      title: '定位功能测试',
    },
  },
]

export default testRouter

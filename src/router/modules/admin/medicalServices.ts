import Layout from '@/layout/index.vue'

/* const medicalServicesTable = [
  {
    path: '/service',
    component: Layout,
    name: 'medicalServices',
    meta: { title: '医疗服务', keepAlive: true, icon: 'FirstAidKit' },
    children: [
      {
        path: '/medicalInfo',
        name: 'medicalInfo',
        meta: { title: '药品信息', keepAlive: true, icon: 'List' },
        children: [
          {
            path: '/medical-manage',
            component: () =>
              import('@/views/medicalServices/medicalInfo/medicalManagement/index.vue'),
            name: 'medicalManagement',
            meta: { title: '药品管理', keepAlive: true, icon: 'MenuIcon' },
          },
          {
            path: '/medical-order-manage',
            component: () => import('@/views/medicalServices/medicalInfo/medicalOrder/index.vue'),
            name: 'medicalOrder',
            meta: { title: '药品订单', keepAlive: true, icon: 'MenuIcon' },
          },
        ],
      },
      {
        path: '/hospitalInfo',
        name: 'hospitalInfo',
        meta: { title: '校医信息', keepAlive: true, icon: 'List' },
        children: [
          {
            path: '/people-manage',
            component: () => import('@/views/medicalServices/hospitalInfo/manage/index.vue'),
            name: 'manage',
            meta: { title: '校医人员', keepAlive: true, icon: 'MenuIcon' },
          },
          {
            path: '/order-manage',
            component: () => import('@/views/medicalServices/hospitalInfo/order/index.vue'),
            name: 'order',
            meta: { title: '校医预约', keepAlive: true, icon: 'MenuIcon' },
          },
        ],
      },
    ],
  },
] */

const medicalServicesTable = [
  {
    path: '/service',
    component: Layout,
    name: 'medicalServices',
    meta: { title: '医疗服务', keepAlive: true, icon: 'FirstAidKit' },
    children: [
      {
        path: '/people-manage',
        component: () => import('@/views/medicalServices/hospitalInfo/manage/index.vue'),
        name: 'manage',
        meta: { title: '医生信息管理', keepAlive: true, icon: 'MenuIcon' },
      },
      {
        path: '/order-manage',
        component: () => import('@/views/medicalServices/hospitalInfo/order/index.vue'),
        name: 'order',
        meta: { title: '预约订单管理', keepAlive: true, icon: 'MenuIcon' },
      },
    ],
  },
]
export default medicalServicesTable

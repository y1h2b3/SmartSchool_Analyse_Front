const parentOrderTable = [
  {
    path: '/order',
    name: 'order',
    component: () => import('@/layout/index.vue'),
    meta: { title: '预约服务', keepAlive: true, icon: 'FirstAidKit' },
    children: [
      {
        path: '/hospital-order',
        component: () => import('@/parent-views/order/yuyue/index.vue'),
        name: 'order',
        meta: { title: '心理咨询预约', keepAlive: true, icon: 'MenuIcon' },
      },
      {
        path: '/hospital-bill',
        component: () => import('@/parent-views/order/dingdan/index.vue'),
        name: 'bill',
        meta: { title: '预约订单', keepAlive: true, icon: 'MenuIcon' },
      },
    ],
  },
]

export default parentOrderTable

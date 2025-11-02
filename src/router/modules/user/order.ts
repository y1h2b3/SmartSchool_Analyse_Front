const userOrderTable = [
  {
    path: '/',
    name: 'order',
    component: () => import('@/layout/index.vue'),
    redirect: '/order',
    children: [
      {
        path: '/order',
        component: () => import('@/user-views/order/index.vue'),
        name: 'order',
        meta: { title: '校医预约', keepAlive: true, icon: 'Phone' },
      },
    ],
  },
]

export default userOrderTable

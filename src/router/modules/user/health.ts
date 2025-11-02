const userHealthTable = [
  {
    path: '/',
    name: 'health',
    component: () => import('@/layout/index.vue'),
    redirect: '/health',
    children: [
      {
        path: '/health',
        component: () => import('@/user-views/health/index.vue'),
        name: 'health',
        meta: { title: '我的健康', keepAlive: true, icon: 'Histogram' },
      },
    ],
  },
]

export default userHealthTable

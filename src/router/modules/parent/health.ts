const parentHealthTable = [
  /* {
    path: '/health',
    name: 'health',
    component: () => import('@/parent-views/health/index.vue'),
    meta: { title: '健康分析', keepAlive: true, icon: 'MenuIcon' },
  }, */
  {
    path: '/health',
    name: 'health',
    component: () => import('@/layout/index.vue'),
    redirect: '/health-data',
    children: [
      {
        path: '/health-data',
        component: () => import('@/parent-views/health/index.vue'),
        name: 'health-data',
        meta: { title: '健康分析', keepAlive: true, icon: 'Histogram' },
      },
    ],
  },
]

export default parentHealthTable

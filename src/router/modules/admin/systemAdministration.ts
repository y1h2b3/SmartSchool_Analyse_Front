const systemAdministrationTable = [
  {
    path: '/system',
    name: 'systemAdministration',
    component: () => import('@/layout/index.vue'),
    meta: { title: '系统管理', keepAlive: true, icon: 'Tools' },
    children: [
      {
        path: '/log',
        component: () => import('@/views/systemAdministration/log/index.vue'),
        name: 'logManagement',
        meta: { title: '日志管理', keepAlive: true, icon: 'List' },
      },
    ],
  },
]

export default systemAdministrationTable

const userBuyTable = [
  {
    path: '/',
    name: 'store',
    component: () => import('@/layout/index.vue'),
    redirect: '/store',
    children: [
      {
        path: '/store',
        component: () => import('@/user-views/store/index.vue'),
        name: 'store',
        meta: { title: '药品商店', keepAlive: true, icon: 'Shop' },
      },
    ],
  },
]

export default userBuyTable

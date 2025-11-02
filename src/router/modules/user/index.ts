const userIndexTable = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/user-views/index/index.vue'),
        name: 'index',
        meta: { title: '首页', icon: 'HomeFilled', affix: true, role: ['other'] },
      },
    ],
  },
]

export default userIndexTable

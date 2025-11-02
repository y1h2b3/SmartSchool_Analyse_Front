const userNoticeTable = [
  {
    path: '/',
    name: 'notice',
    component: () => import('@/layout/index.vue'),
    redirect: '/notice',
    children: [
      {
        path: '/notice',
        component: () => import('@/user-views/notice/index.vue'),
        name: 'notice',
        meta: { title: '我的通知', keepAlive: true, icon: 'Comment' },
      },
    ],
  },
]

export default userNoticeTable

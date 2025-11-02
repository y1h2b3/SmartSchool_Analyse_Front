const parentNoticeTable = [
  {
    path: '/notice',
    name: 'notice',
    component: () => import('@/layout/index.vue'),
    // redirect: '/notice',
    meta: { title: '我的通知', icon: 'Comment' },
    children: [
      {
        path: '/parent-notice',
        component: () => import('@/parent-views/notice/index.vue'),
        name: 'notice',
        meta: { title: '消息通知', keepAlive: true, icon: 'MenuIcon' },
      },
      {
        path: '/parent-warning',
        component: () => import('@/parent-views/warn/index.vue'),
        name: 'studentNotice',
        meta: { title: '预警通知', keepAlive: true, icon: 'MenuIcon' },
      },
    ],
  },
]

export default parentNoticeTable

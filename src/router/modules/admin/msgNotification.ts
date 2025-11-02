import Layout from '@/layout/index.vue'

const msgNotificationTable = [
  {
    path: '/notice',
    component: Layout,
    name: 'msgNotification',
    redirect: 'msgNotification/main',
    children: [
      {
        path: '/msg-notice',
        component: () => import('@/views/msgNotification/index.vue'),
        name: 'msgNotificationMain',
        meta: { title: '消息通知', keepAlive: true, icon: 'Comment' },
      },
    ],
  },
]

export default msgNotificationTable

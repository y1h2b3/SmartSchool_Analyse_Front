import Layout from '@/layout/index.vue'

const alertNoticeTable = [
  {
    path: '/warning',
    component: Layout,
    name: 'alertNotice',
    meta: { title: '预警通知', keepAlive: true, icon: 'BellFilled' },
    children: [
      {
        path: '/student-warning',
        component: () => import('@/views/alertNotice/studentNotice/index.vue'),
        name: 'studentNotice',
        meta: { title: '学生预警', keepAlive: true, icon: 'MenuIcon' },
      },
      {
        path: '/teacher-warning',
        component: () => import('@/views/alertNotice/teacherNotice/index.vue'),
        name: '/teacherNotice',
        meta: { title: '教师预警', keepAlive: true, icon: 'MenuIcon' },
      },
      {
        path: '/logistics-warning',
        component: () => import('@/views/alertNotice/logisticalNotice/index.vue'),
        name: 'logisticalNotice',
        meta: { title: '后勤预警', keepAlive: true, icon: 'MenuIcon' },
      },
    ],
  },
]

export default alertNoticeTable

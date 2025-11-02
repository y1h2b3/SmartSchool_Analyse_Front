import Layout from '@/layout/index.vue'

const healthManagementTable = [
  {
    path: '/health',
    component: Layout,
    name: 'healthManagement',
    meta: { title: '健康管理', keepAlive: true, icon: 'Suitcase' },
    children: [
      {
        path: '/student-health',
        component: () => import('@/views/healthManagement/studentHealth/index.vue'),
        name: 'studentHealth',
        meta: { title: '学生健康', keepAlive: true, icon: 'Tools' },
      },
      {
        path: '/teacher-health',
        component: () => import('@/views/healthManagement/teacherHealth/index.vue'),
        name: 'teacherHealth',
        meta: { title: '教师健康', keepAlive: true, icon: 'Tools' },
      },
      {
        path: '/logistics-health',
        component: () => import('@/views/healthManagement/logisticalHealth/index.vue'),
        name: 'logisticalHealth',
        meta: { title: '后勤健康', keepAlive: true, icon: 'Tools' },
      },
    ],
  },
]
export default healthManagementTable

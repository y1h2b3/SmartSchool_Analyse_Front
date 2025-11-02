const dataAnalyticsTable = [
  {
    path: '/data',
    name: 'dataAnalytics',
    meta: { title: '健康数据分析', keepAlive: true, icon: 'Histogram' },
    children: [
      {
        path: '/student-data',
        component: () => import('@/views/dataAnalytics/student/index.vue'),
        name: 'studentData',
        meta: { title: '学生健康分析', keepAlive: true, icon: 'MenuIcon' },
      },
      {
        path: '/teacher-data',
        component: () => import('@/views/dataAnalytics/teacher/index.vue'),
        name: 'teacherData',
        meta: { title: '教师健康分析', keepAlive: true, icon: 'MenuIcon' },
      },
      {
        path: '/logistics-data',
        component: () => import('@/views/dataAnalytics/logistics/index.vue'),
        name: 'logisticalData',
        meta: { title: '后勤健康分析', keepAlive: true, icon: 'MenuIcon' },
      },
    ],
  },
]
export default dataAnalyticsTable

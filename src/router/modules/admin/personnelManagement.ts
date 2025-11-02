import Layout from '@/layout/index.vue'

const personnelManagementTable = [
  {
    path: '/personManage',
    component: Layout,
    name: 'personnelManagement',
    meta: { title: '人员管理', keepAlive: true, icon: 'Avatar' },
    children: [
      {
        path: '/student-manage',
        component: () => import('@/views/personnelManagement/studentManagement/index.vue'),
        name: 'studentManagement',
        meta: { title: '学生管理', keepAlive: true, icon: 'Tools' },
      },
      {
        path: '/teacher-manage',
        component: () => import('@/views/personnelManagement/teacherManagement/index.vue'),
        name: 'teacherManagement',
        meta: { title: '教师管理', keepAlive: true, icon: 'Tools' },
      },
      {
        path: '/logistics-manage',
        component: () => import('@/views/personnelManagement/logisticalManagement/index.vue'),
        name: 'logisticalManagement',
        meta: { title: '后勤管理', keepAlive: true, icon: 'Tools' },
      },
      {
        path: '/parent-manage',
        component: () => import('@/views/personnelManagement/parentManagement/index.vue'),
        name: 'parentManagement',
        meta: { title: '监护人管理', keepAlive: true, icon: 'Tools' },
      },
    ],
  },
]
export default personnelManagementTable

import Layout from '@/layout/index.vue'

const paymentTestRouter = [
  {
    path: '/payment',
    component: Layout,
    name: 'paymentTest',
    meta: { title: '支付测试', keepAlive: true, icon: 'CreditCard' },
    children: [
      {
        path: '/payment-test',
        component: () => import('@/views/paymentTest/index.vue'),
        name: 'paymentTestPage',
        meta: { title: '支付功能测试', keepAlive: true, icon: 'Money' },
      },
    ],
  },
]

export default paymentTestRouter

const parentBuyTable = [
  {
    path: '/store',
    name: 'store',
    component: () => import('@/layout/index.vue'),
    meta: { title: '我的商店', keepAlive: true, icon: 'Shop' },
    children: [
      {
        path: '/store-buy',
        component: () => import('@/parent-views/store/goumai/index.vue'),
        name: 'store-buy',
        meta: { title: '药品购买', keepAlive: true, icon: 'MenuIcon' },
      },
      {
        path: '/store-order',
        component: () => import('@/parent-views/store/dingdan/index.vue'),
        name: 'store-order',
        meta: { title: '药品订单', keepAlive: true, icon: 'MenuIcon' },
      },
    ],
  },
]

export default parentBuyTable

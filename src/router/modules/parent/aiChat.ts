const parentAiChatTable = [
  {
    path: '/ai-chat',
    name: 'ai-chat',
    component: () => import('@/layout/index.vue'),
    redirect: '/ai-chat-main',
    meta: { title: 'AI助手', keepAlive: true, icon: 'ChatDotRound' },
    children: [
      {
        path: '/ai-chat-main',
        component: () => import('@/parent-views/ai-chat/index.vue'),
        name: 'ai-chat-main',
        meta: { title: '健康咨询', keepAlive: true, icon: 'MenuIcon' },
      },
    ],
  },
]

export default parentAiChatTable

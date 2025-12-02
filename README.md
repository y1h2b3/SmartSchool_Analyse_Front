# 🎓 智慧校园健康管理系统 (前端)

> 一个基于 Vue 3 + TypeScript + Vite 的现代化智慧校园健康服务平台。

[![Vue 3](https://img.shields.io/badge/Vue-3.2+-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.6+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-3.0+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.2+-409EFF?style=flat&logo=element&logoColor=white)](https://element-plus.org/)
[![Pinia](https://img.shields.io/badge/Pinia-2.0+-FFE066?style=flat&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)

## 📖 项目简介

**智慧校园健康管理系统** 是专为高校环境打造的综合性健康服务平台。本项目作为系统的前端部分，采用前沿的前端技术栈构建，旨在为学校的**管理员**、**教师**、**学生**及**家长**提供全方位的健康管理服务。

系统集成了**健康档案管理**、**在线医疗服务**、**智慧药房**、**聚合支付**及**数据可视化分析**等核心功能，致力于构建一个安全、高效、便捷的校园健康生态圈。

## ✨ 核心功能模块

### 1. 🔐 多角色权限管理 (RBAC)
- **管理员端**: 全局系统设置、人员与健康数据管理、医疗服务配置、消息通知发布。
- **用户端 (学生/教师)**: 个人健康档案查看、在线购药、订单查询、体检报告预览。
- **家长端**: 关联学生账号，实时关注子女健康状况与消费记录。

### 2. 💊 智慧药房 (在线商城)
- **药品检索**: 支持按分类、关键词搜索药品，查看详细图文介绍。
- **购物车**: 完整的购物车流程，支持批量管理与数量调整。
- **聚合支付**: 
  - 集成 **支付宝沙箱** 支付，模拟真实交易流程。
  - 支持 **书杰支付** 平台，提供多样化支付渠道。
- **订单追踪**: 实时查看订单状态（待支付、已支付、发货中等）。

### 3. 🏥 健康与医疗服务
- **健康档案**: 记录并展示师生的体检数据、病史及过敏源信息。
- **医疗服务**: 在线预约校医、查看就诊记录。
- **数据大屏**: 基于 **ECharts** 的可视化大屏，宏观展示全校健康趋势与数据统计。

### 4. 📢 消息与预警
- **通知公告**: 接收学校发布的健康通知与紧急公告。
- **健康预警**: 针对异常体征数据自动触发预警提示。
- **天气集成**: 接入 OpenWeatherMap 与高德地图 API，提供实时环境健康建议。

## 🛠️ 技术栈详情

| 类别 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **核心框架** | [Vue 3](https://vuejs.org/) | 使用 Composition API 进行逻辑复用 |
| **开发语言** | [TypeScript](https://www.typescriptlang.org/) | 强类型约束，提升代码健壮性与维护性 |
| **构建工具** | [Vite](https://vitejs.dev/) | 极速冷启动，毫秒级热更新 (HMR) |
| **UI 组件库** | [Element Plus](https://element-plus.org/) | 遵循 Material Design 的企业级组件库 |
| **状态管理** | [Pinia](https://pinia.vuejs.org/) | 轻量级、直观的新一代状态管理库 |
| **路由管理** | [Vue Router 4](https://router.vuejs.org/) | 官方路由管理器，支持动态路由权限控制 |
| **网络请求** | [Axios](https://axios-http.com/) | 封装统一拦截器，处理 Token 鉴权与异常 |
| **数据可视化** | [ECharts](https://echarts.apache.org/) | 强大的数据可视化图表库 |
| **富文本编辑** | [WangEditor](https://www.wangeditor.com/) | 轻量级 Web 富文本编辑器 |
| **样式预处理** | [Sass/SCSS](https://sass-lang.com/) | 模块化 CSS 编写 |

## 📂 项目目录结构

```bash
src/
├── api/                  # 接口请求层 (按模块划分: admin, parent, pay 等)
├── assets/               # 静态资源 (图片、字体、全局样式变量)
├── components/           # 全局通用组件
├── icons/                # SVG 图标资源
├── layout/               # 系统整体布局 (Sidebar, Navbar, TagsView)
├── parent-views/         # 家长/学生端核心业务视图 (商城, 健康, 订单)
├── router/               # 路由配置与权限路由模块
├── store/                # Pinia 状态管理仓库 (User, Cart, Permission)
├── styles/               # 全局样式文件
├── utils/                # 工具库 (Request封装, 鉴权, 格式化)
├── views/                # 管理端及基础页面视图
│   ├── admin/            # 管理员功能模块
│   ├── login/            # 登录页
│   └── ...
├── App.vue               # 应用根组件
├── main.ts               # 入口文件
└── vite.config.ts        # Vite 项目配置文件
```

## 🚀 快速开始

### 1. 环境准备
请确保本地已安装 Node.js (推荐 v16.0.0+) 和包管理器 (npm/yarn/pnpm)。

### 2. 获取代码
```bash
git clone https://github.com/your-username/smart-campus-vue.git
cd smart-campus-vue
```

### 3. 安装依赖
```bash
npm install
# 或者
yarn install
```

### 4. 项目配置
项目默认连接本地后端服务。如需修改后端地址，请编辑 `vite.config.ts` 中的 proxy 配置：

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8718', // 修改为你的后端地址
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 5. 启动开发服务
```bash
npm run dev
```
启动成功后，访问 `http://localhost:5173` 即可体验。

### 6. 生产环境构建
```bash
npm run build
```
构建产物将输出到 `docs` 目录，可直接部署至 Nginx 或其他 Web 服务器。

## 🔌 后端配套服务

本项目需要配合后端服务运行才能完整体验所有功能。
- **后端项目**: SmartCampus_SpringBoot
- **默认端口**: 8718

## 📄 开源协议

本项目采用 [MIT](LICENSE) 协议开源。

# 智慧校园健康管理系统 (前端)

## 📖 项目介绍

智慧校园健康管理系统是一个基于 **Vue 3** + **TypeScript** + **Vite** 构建的现代化前端项目。旨在为校园提供便捷的健康管理、药品购买及相关服务。

本项目集成了支付宝沙箱支付、书杰支付等多种支付方式，并包含完整的用户登录、商品浏览、购物车管理及订单处理流程。

## 🛠️ 技术栈

- **核心框架**: [Vue 3](https://vuejs.org/) (Composition API)
- **构建工具**: [Vite](https://vitejs.dev/)
- **开发语言**: [TypeScript](https://www.typescriptlang.org/)
- **UI 组件库**: [Element Plus](https://element-plus.org/)
- **路由管理**: [Vue Router](https://router.vuejs.org/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **HTTP 请求**: Axios
- **CSS 预处理**: SCSS

## 🚀 快速开始

### 1. 环境准备

请确保您的本地环境已安装 [Node.js](https://nodejs.org/) (推荐 v16+)。

### 2. 安装依赖

在项目根目录下运行：

```bash
npm install
# 或者
yarn install
# 或者
pnpm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

启动后，访问: `http://localhost:5173`

### 4. 项目打包

```bash
npm run build
```

打包后的文件将生成在 `docs` 目录下，可直接部署至 Nginx 或其他 Web 服务器。

## 📂 目录结构

```
src/
├── api/                # 后端接口定义
├── assets/             # 静态资源 (图片, 图标等)
├── components/         # 公共组件
├── layout/             # 页面布局结构
├── parent-views/       # 核心业务页面 (商店, 购买, 支付等)
├── router/             # 路由配置
├── store/              # 状态管理 (Pinia)
├── styles/             # 全局样式 (SCSS)
├── utils/              # 工具函数 (Request, Auth等)
├── views/              # 基础视图
├── App.vue             # 根组件
└── main.ts             # 入口文件
```

## ✨ 主要功能

- **用户认证**: 学生/教职工登录与鉴权
- **在线药房**: 药品浏览、搜索与详情查看
- **购物车**: 商品添加、数量调整与结算
- **支付集成**: 
  - 支持支付宝沙箱环境支付
  - 支持书杰支付平台
- **订单管理**: 订单创建、支付状态查询与历史记录
- **个人中心**: 用户信息管理与健康数据查看

## 🔌 接口配置

项目默认连接本地后端服务。如需修改，请调整 `vite.config.ts` 中的代理配置或 `.env` 环境文件。

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:8718', // 后端地址
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
  // ...
}
```

## 📄 许可证

[MIT](LICENSE)

# Smart Campus Health Management System (Web Frontend)

[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-646CFF.svg)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.x-409EFF.svg)](https://element-plus.org/)

## 📖 项目简介 (Project Introduction)

智慧校园健康管理系统（Smart Campus Health Management System）是一套专为高校设计的综合健康服务平台。本项目为系统的 **前端部分 (Web Client)**，采用现代化前端技术栈构建，为全校师生提供便捷、高效的医疗健康服务。

系统核心功能涵盖在线购药、医疗支付、健康档案管理等业务场景，通过直观友好的 UI 设计，实现从商品浏览到支付结算的完整闭环体验。

## ✨ 核心功能 (Key Features)

### 1. 🛍️ 智慧药房 (Online Pharmacy)
- **药品展示**: 图文并茂的药品详情页，支持分类筛选与搜索。
- **智能购物车**: 支持批量添加、数量调整、实时价格计算。
- **快捷下单**: 简化的购物流程，提升用户体验。

### 2. 💳 聚合支付 (Integrated Payment)
- **支付宝沙箱集成**: 完整模拟支付宝支付流程，支持扫码支付与页面跳转。
- **书杰支付支持**: 对接第三方聚合支付平台，扩展支付渠道。
- **支付状态追踪**: 实时轮询与回调处理，确保订单状态准确同步。

### 3. 📋 订单管理 (Order Management)
- **历史订单**: 用户可查看所有历史购买记录。
- **订单详情**: 展示订单号、支付方式、药品明细及物流状态。

### 4. 👤 用户中心 (User Center)
- **身份认证**: 基于 Token 的学生/教职工身份鉴权。
- **个人信息**: 管理个人基础信息及收货地址。
- **健康档案**: (扩展功能) 查看个人体检报告与健康趋势。

## 🛠️ 技术架构 (Tech Stack)

| 模块 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **核心框架** | Vue 3 | 使用 Composition API 进行逻辑复用与组织 |
| **构建工具** | Vite | 极速的冷启动与热更新体验 |
| **编程语言** | TypeScript | 强类型支持，提高代码健壮性 |
| **UI 组件库** | Element Plus | 专业的企业级 UI 组件库 |
| **路由管理** | Vue Router 4 | 单页应用路由控制 |
| **状态管理** | Pinia | 轻量级、直观的状态管理库 |
| **网络请求** | Axios | 统一拦截器封装，处理 Token 与异常 |
| **CSS 预处理** | SCSS | 模块化样式编写 |
| **图标库** | Element Plus Icons | 统一的 SVG 图标系统 |

## 🚀 快速开始 (Quick Start)

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0 或 pnpm/yarn

### 1. 克隆项目
```bash
git clone https://github.com/your-repo/smart-campus-vue.git
cd smart-campus-vue
```

### 2. 安装依赖
推荐使用 npm 或 pnpm：
```bash
npm install
# 或者
pnpm install
```

### 3. 配置文件
在项目根目录创建或修改 `.env` 文件（可选），配置后端 API 地址：
```env
# .env.development
VITE_APP_BASE_API = '/api'
```

### 4. 启动开发服务
```bash
npm run dev
```
启动成功后，浏览器访问 `http://localhost:5173` 即可看到项目首页。

### 5. 构建生产版本
```bash
npm run build
```
构建产物位于 `docs` 目录，可直接部署至 Nginx、Apache 或 CDN。

## 📂 目录结构 (Project Structure)

```bash
src/
├── api/                  # API 接口统一管理
│   ├── parent/           # 家长端/学生端接口
│   └── pay/              # 支付相关接口
├── assets/               # 静态资源 (Images, Fonts)
├── components/           # 全局公用组件
├── layout/               # 布局组件 (Header, Sidebar)
├── parent-views/         # 核心业务视图
│   ├── store/            # 商城模块
│   │   ├── goumai/       # 购买流程
│   │   └── component/    # 商城专用组件 (如支付弹窗)
│   └── ...
├── router/               # 路由配置与守卫
├── store/                # Pinia 状态仓库 (User, Cart)
├── styles/               # 全局样式与变量
├── utils/                # 工具函数 (Request, Validate)
├── views/                # 基础页面 (Login, 404)
├── App.vue               # 应用根组件
└── main.ts               # 入口文件
```

## 🔌 后端对接 (Backend Integration)

本项目默认配合 `SmartCampus_SpringBoot` 后端运行。
- **本地开发**: 请确保后端服务运行在 `http://localhost:8718`。
- **代理配置**: `vite.config.ts` 中已配置反向代理解决跨域问题：
  ```typescript
  proxy: {
    '/api': {
      target: 'http://localhost:8718',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
  ```

## 🤝 贡献指南 (Contributing)

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 版权说明 (License)

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

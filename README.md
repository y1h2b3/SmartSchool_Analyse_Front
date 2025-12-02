# 🎓 智慧校园健康管理系统 (前端)

> 一个基于 Vue 3 + TypeScript + Vite 的现代化智慧校园健康服务平台。

[![Vue 3](https://img.shields.io/badge/Vue-3.2+-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.6+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-3.0+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.2+-409EFF?style=flat&logo=element&logoColor=white)](https://element-plus.org/)
[![Pinia](https://img.shields.io/badge/Pinia-2.0+-FFE066?style=flat&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![ECharts](https://img.shields.io/badge/ECharts-5.3+-AA344D?style=flat&logo=apacheecharts&logoColor=white)](https://echarts.apache.org/)

---

## 📖 项目简介

**智慧校园健康管理系统** 是专为高校环境打造的综合性健康服务平台。本项目作为系统的前端部分，采用前沿的前端技术栈构建，旨在为学校的**管理员**、**教师**、**学生**及**家长**提供全方位的健康管理服务。

系统集成了**健康档案管理**、**在线医疗服务**、**智慧药房**、**聚合支付**及**数据可视化分析**等核心功能，致力于构建一个安全、高效、便捷的校园健康生态圈。

---

## ✨ 核心功能模块

### 1. 🔐 多角色权限管理 (RBAC)

系统采用基于角色的访问控制，支持 **4 种用户角色**，通过动态路由实现权限隔离：

| 角色 | 权限范围 | 主要功能 |
|:---:|:---|:---|
| **管理员** | 全局管理权限 | 系统设置、人员管理、健康数据管理、医疗服务配置、消息通知发布、数据分析大屏 |
| **教师** | 教师端权限 | 个人健康档案、在线购药、订单查询、健康通知 |
| **学生/家长** | 用户端权限 | 健康档案查看、智慧药房购物、订单追踪、关联子女账号 |
| **后勤** | 后勤端权限 | 药品管理、订单处理、库存管理 |

**权限控制流程：**
```
登录 → 获取用户角色 → 动态生成路由表 → 渲染对应菜单
```

### 2. 💊 智慧药房 (在线商城)

完整的电商购物流程，支持在线购药服务：

- **药品检索**: 支持按分类、关键词搜索药品，查看详细图文介绍
- **购物车**: 完整的购物车流程，支持批量管理与数量调整
- **聚合支付**: 
  - 集成 **支付宝沙箱** 支付，模拟真实交易流程
  - 支持多样化支付渠道
- **订单管理**: 
  - 订单创建、查询、追踪
  - 支持按时间范围、订单状态筛选
  - 实时查看订单状态（待支付、已支付、发货中等）

**支付接口示例：**
```typescript
// 支付宝支付接口
POST /pay/alipay
Params: { dona_drugId, dona_money, dona_sum, dona_userId }
```

### 3. 🏥 健康与医疗服务

#### 健康档案管理
- **学生健康档案**: 体检数据、病史、过敏源信息
- **教师健康档案**: 职工体检记录、健康状况追踪
- **后勤人员档案**: 后勤员工健康管理

#### 医疗服务
- **医院信息管理**: 校医院基本信息维护
- **医疗人员管理**: 医护人员信息管理
- **就诊记录**: 在线预约校医、查看就诊历史
- **紧急呼叫**: 危急情况快速联系医疗服务

#### 数据可视化大屏
基于 **ECharts** 构建的可视化大屏，宏观展示全校健康趋势：
- 每周健康预警统计（男/女生分布）
- 健康数据趋势分析
- 多维度数据图表展示

### 4. 📢 消息与预警系统

- **通知公告**: 接收学校发布的健康通知与紧急公告
- **健康预警**: 针对异常体征数据自动触发预警提示
- **天气集成**: 
  - 接入 **OpenWeatherMap API** 获取实时天气
  - 接入 **高德地图 API** 提供定位与逆地理编码服务
  - 基于天气数据提供健康建议

**天气数据功能：**
- 当前天气查询（温度、湿度、风速、能见度等）
- 5天天气预报
- 日出日落时间
- 降雨/降雪概率

### 5. 👥 人员管理

- **学生管理**: 学生基本信息、班级、健康状态
- **教师管理**: 教职工信息维护
- **后勤管理**: 后勤人员信息管理
- **账号管理**: 用户账号创建与权限分配

### 6. 📊 数据分析

- **健康数据统计**: 全校健康数据汇总分析
- **预警趋势分析**: 每周预警数据可视化
- **Excel 导出**: 支持数据导出为 Excel 文件

---

## 🛠️ 技术栈详情

### 核心技术

| 类别 | 技术选型 | 版本 | 说明 |
|:---|:---|:---:|:---|
| **核心框架** | [Vue 3](https://vuejs.org/) | 3.2+ | 使用 Composition API 进行逻辑复用 |
| **开发语言** | [TypeScript](https://www.typescriptlang.org/) | 4.6+ | 强类型约束，提升代码健壮性与维护性 |
| **构建工具** | [Vite](https://vitejs.dev/) | 3.0+ | 极速冷启动，毫秒级热更新 (HMR) |
| **UI 组件库** | [Element Plus](https://element-plus.org/) | 2.2+ | 企业级 Vue 3 组件库 |
| **状态管理** | [Pinia](https://pinia.vuejs.org/) | 2.0+ | 轻量级、直观的新一代状态管理库 |
| **路由管理** | [Vue Router 4](https://router.vuejs.org/) | 4.1+ | 官方路由管理器，支持动态路由权限控制 |
| **网络请求** | [Axios](https://axios-http.com/) | 0.27+ | 封装统一拦截器，处理 Token 鉴权与异常 |

### 可视化与编辑器

| 类别 | 技术选型 | 版本 | 说明 |
|:---|:---|:---:|:---|
| **数据可视化** | [ECharts](https://echarts.apache.org/) | 5.3+ | 强大的数据可视化图表库 |
| **水球图** | [echarts-liquidfill](https://github.com/ecomfe/echarts-liquidfill) | 3.1+ | ECharts 水球图扩展 |
| **富文本编辑** | [WangEditor](https://www.wangeditor.com/) | 5.1+ | 轻量级 Web 富文本编辑器 |
| **Markdown** | [md-editor-v3](https://github.com/imzbf/md-editor-v3) | 1.11+ | Vue 3 Markdown 编辑器 |

### 地图与定位

| 类别 | 技术选型 | 说明 |
|:---|:---|:---|
| **高德地图** | [@amap/amap-jsapi-loader](https://lbs.amap.com/) | 地图展示、定位、逆地理编码 |
| **天气服务** | [OpenWeatherMap](https://openweathermap.org/) | 实时天气与预报数据 |

### 工具库

| 类别 | 技术选型 | 说明 |
|:---|:---|:---|
| **日期处理** | [Day.js](https://day.js.org/) | 轻量级日期库 |
| **Excel 处理** | [ExcelJS](https://github.com/exceljs/exceljs) / [XLSX](https://sheetjs.com/) | Excel 文件读写与导出 |
| **剪贴板** | [Clipboard.js](https://clipboardjs.com/) | 剪贴板操作 |
| **拖拽排序** | [VueDraggable](https://github.com/SortableJS/vue.draggable.next) | 拖拽排序组件 |
| **二维码** | [vue-qr](https://github.com/Binaryify/vue-qr) | 二维码生成 |
| **图片裁剪** | [vue-cropper](https://github.com/xyxiao001/vue-cropper) | 图片裁剪组件 |
| **打印** | [print-js](https://printjs.crabbly.com/) | 打印功能 |

### 样式与构建

| 类别 | 技术选型 | 说明 |
|:---|:---|:---|
| **样式预处理** | [Sass/SCSS](https://sass-lang.com/) | 模块化 CSS 编写 |
| **代码规范** | ESLint + Prettier | 代码风格统一 |
| **Gzip 压缩** | vite-plugin-compression | 生产环境 Gzip 压缩 |
| **SVG 图标** | vite-plugin-svg-icons | SVG 图标自动注册 |

---

## 📂 项目目录结构

```bash
SmartCampus_Vue/
├── public/                     # 静态资源目录
├── src/
│   ├── api/                    # 接口请求层
│   │   ├── admin/              # 管理端接口
│   │   │   ├── alertNotice/    # 预警通知接口
│   │   │   ├── healthManagement/   # 健康管理接口
│   │   │   ├── medicalServices/    # 医疗服务接口
│   │   │   ├── msgNotification/    # 消息通知接口
│   │   │   ├── personnelManagement/# 人员管理接口
│   │   │   └── systemAdministration/# 系统管理接口
│   │   ├── login/              # 登录接口
│   │   ├── parent/             # 家长端接口
│   │   ├── pay/                # 支付接口
│   │   └── weather.ts          # 天气 API
│   │
│   ├── assets/                 # 静态资源 (图片、字体)
│   │
│   ├── components/             # 全局通用组件
│   │   ├── DataScreen/         # 数据大屏组件
│   │   ├── ExportExcel/        # Excel 导出组件
│   │   ├── SearchForm/         # 搜索表单组件
│   │   ├── SvgIcon/            # SVG 图标组件
│   │   ├── dataAnilyze1-10/    # 数据分析图表组件
│   │   ├── barEcharts/         # 柱状图组件
│   │   ├── lineEcharts/        # 折线图组件
│   │   ├── pie/                # 饼图组件
│   │   └── migrationEcharts/   # 迁移图组件
│   │
│   ├── icons/                  # SVG 图标资源
│   │
│   ├── layout/                 # 系统整体布局
│   │   ├── Header/             # 顶部导航栏
│   │   ├── Sidebar/            # 侧边栏菜单
│   │   ├── TagsView/           # 标签页导航
│   │   └── Main/               # 主内容区
│   │
│   ├── parent-views/           # 家长/学生端视图
│   │   ├── health/             # 健康档案
│   │   ├── index/              # 首页
│   │   ├── notice/             # 通知公告
│   │   ├── order/              # 订单管理
│   │   ├── store/              # 智慧药房
│   │   └── warn/               # 健康预警
│   │
│   ├── router/                 # 路由配置
│   │   ├── index.ts            # 路由主入口
│   │   └── modules/            # 路由模块
│   │       ├── admin/          # 管理端路由
│   │       ├── user/           # 用户端路由
│   │       ├── parent/         # 家长端路由
│   │       └── teacher/        # 教师端路由
│   │
│   ├── store/                  # Pinia 状态管理
│   │   ├── index.ts            # Store 入口
│   │   └── modules/
│   │       ├── user.ts         # 用户状态 (登录、Token、角色)
│   │       ├── permission.ts   # 权限状态 (动态路由)
│   │       ├── setting.ts      # 系统设置
│   │       ├── tagsView.ts     # 标签页状态
│   │       └── weather.ts      # 天气状态
│   │
│   ├── styles/                 # 全局样式文件
│   │
│   ├── utils/                  # 工具库
│   │   ├── request.ts          # Axios 请求封装
│   │   ├── amap.ts             # 高德地图工具
│   │   ├── location.ts         # 定位工具
│   │   ├── validate.ts         # 表单验证工具
│   │   ├── routers.ts          # 路由工具
│   │   └── clipboard.ts        # 剪贴板工具
│   │
│   ├── views/                  # 管理端视图
│   │   ├── login/              # 登录页
│   │   ├── home/               # 首页
│   │   ├── personnelManagement/# 人员管理
│   │   ├── healthManagement/   # 健康管理
│   │   ├── medicalServices/    # 医疗服务
│   │   ├── alertNotice/        # 预警通知
│   │   ├── msgNotification/    # 消息通知
│   │   ├── dataAnalytics/      # 数据分析
│   │   └── systemAdministration/# 系统管理
│   │
│   ├── App.vue                 # 应用根组件
│   ├── main.ts                 # 入口文件
│   └── permission.ts           # 路由权限守卫
│
├── .env                        # 环境变量
├── .env.development            # 开发环境配置
├── .env.production             # 生产环境配置
├── .env.test                   # 测试环境配置
├── index.html                  # HTML 入口
├── package.json                # 项目依赖
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
└── README.md                   # 项目说明
```

---

## 🔑 核心代码说明

### 1. 请求封装 (`src/utils/request.ts`)

基于 Axios 封装的统一请求工具，包含：
- **请求拦截器**: 自动携带 Token
- **响应拦截器**: 统一处理响应码、错误提示
- **401 处理**: Token 过期自动跳转登录

```typescript
// 请求拦截 - 自动携带 Token
request.interceptors.request.use((config) => {
  const token = userStore.token
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// 响应拦截 - 统一处理
request.interceptors.response.use((response) => {
  if (response.data.code === 200) {
    return response.data.data
  } else {
    ElMessage.error(response.data.message)
    return Promise.reject(new Error(response.data.message))
  }
})
```

### 2. 权限路由 (`src/permission.ts`)

基于角色的动态路由加载：

```typescript
router.beforeEach(async (to, from, next) => {
  const hasToken = UserStore.token
  
  if (hasToken) {
    // 已登录 - 动态加载路由
    const accessRoutes = await PermissionStore.generateRoutes(UserStore.roles)
    accessRoutes.forEach((item) => router.addRoute(item))
    next({ ...to, replace: true })
  } else {
    // 未登录 - 跳转登录页
    next(`/login?redirect=${to.path}`)
  }
})
```

### 3. 状态持久化 (`src/store/modules/user.ts`)

用户状态使用 `pinia-plugin-persistedstate` 持久化到 LocalStorage：

```typescript
export const useUserStore = defineStore({
  id: 'userState',
  state: () => ({
    token: null,
    userInfo: {},
    roles: [],
  }),
  persist: {
    storage: localStorage,
  },
})
```

### 4. 高德地图工具 (`src/utils/amap.ts`)

封装高德地图常用功能：

```typescript
// 逆地理编码 - 根据经纬度获取地址
export async function getAddressByCoordinates(latitude, longitude) {
  const url = `/amap/v3/geocode/regeo?key=${AMAP_KEY}&location=${longitude},${latitude}`
  const response = await fetch(url)
  return response.json()
}

// 高德定位
export async function getAmapLocation() {
  const AMap = await initAMap()
  const geolocation = new AMap.Geolocation({ enableHighAccuracy: true })
  // ...
}
```

---

## 🚀 快速开始

### 1. 环境准备

请确保本地已安装：
- **Node.js**: v16.0.0+ (推荐 v18+)
- **包管理器**: npm / yarn / pnpm

### 2. 获取代码

```bash
git clone https://github.com/your-username/SmartCampus_Vue.git
cd SmartCampus_Vue
```

### 3. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 4. 环境配置

项目支持多环境配置：

| 文件 | 环境 | 说明 |
|:---|:---|:---|
| `.env` | 通用 | 所有环境共享的变量 |
| `.env.development` | 开发 | 本地开发环境 |
| `.env.test` | 测试 | 测试环境 |
| `.env.production` | 生产 | 生产环境 |

**修改后端地址** (`vite.config.ts`)：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8718',  // 后端地址
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    },
    '/openweathermap': {
      target: 'https://api.openweathermap.org/',  // 天气 API
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/openweathermap/, '')
    },
    '/amap': {
      target: 'https://restapi.amap.com/',  // 高德地图 API
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/amap/, '')
    }
  }
}
```

### 5. 启动开发服务

```bash
npm run dev
```

启动成功后，访问 `http://localhost:5173` 即可体验。

### 6. 构建部署

```bash
# 开发环境构建
npm run build:dev

# 测试环境构建
npm run build:test

# 生产环境构建
npm run build:prod

# 默认构建 (生产)
npm run build
```

构建产物将输出到 `docs` 目录，可直接部署至 Nginx 或其他 Web 服务器。

### 7. 代码规范

```bash
# ESLint 检查并修复
npm run lint

# Prettier 格式化
npm run lint:prettier
```

---

## 🔌 后端配套服务

本项目需要配合后端服务运行才能完整体验所有功能。

| 项目 | 说明 |
|:---|:---|
| **后端项目** | SmartCampus_SpringBoot |
| **默认端口** | 8718 |
| **数据库** | MySQL |

### 主要接口

| 模块 | 接口前缀 | 说明 |
|:---|:---|:---|
| 登录认证 | `/Login` | 管理员/用户登录 |
| 药品管理 | `/drugs` | 药品 CRUD |
| 订单管理 | `/orders` | 订单创建、查询 |
| 支付 | `/pay` | 支付宝支付 |
| 健康档案 | `/health` | 健康数据管理 |
| 预警 | `/warning` | 健康预警 |

---

## 🌐 第三方服务配置

### 高德地图

1. 前往 [高德开放平台](https://lbs.amap.com/) 注册账号
2. 创建应用，获取 Web 端 Key
3. 修改 `src/utils/amap.ts` 中的配置：

```typescript
const AMAP_CONFIG = {
  key: 'your-amap-key',
  securityJsCode: 'your-security-code',
}
```

### OpenWeatherMap

1. 前往 [OpenWeatherMap](https://openweathermap.org/) 注册账号
2. 获取 API Key
3. 修改 `src/api/weather.ts` 中的配置：

```typescript
const OWM_CONFIG = {
  key: 'your-openweathermap-key',
}
```

---

## 📱 浏览器支持

| 浏览器 | 支持版本 |
|:---:|:---:|
| Chrome | 最新 2 个版本 |
| Firefox | 最新 2 个版本 |
| Safari | 最新 2 个版本 |
| Edge | 最新 2 个版本 |

> ⚠️ 不支持 IE 浏览器

---

## 📄 开源协议

本项目采用 [MIT](LICENSE) 协议开源。

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📞 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。

# SmartCampus 开发日志

## 2025-11-05

### 任务：天气与定位功能完善

#### 1. 定位系统优化

##### 1.1 GPS 优先策略 + 逆地理编码
- **修改文件**: `src/utils/location.ts`
- **变更**：
  - 定位优先级：GPS(高精度 5-50米) → 高德地图 → IP(备选)
  - GPS 超时时间：10秒 → 15秒
  - 新增 `getChineseAddress()` 函数：使用 OpenStreetMap Nominatim API 进行逆地理编码
  - 新增动态函数：`getTempIcon()`, `getHumidityIcon()`, `getCloudIcon()`, `getPressureIcon()`, `getWindIcon()`

##### 1.2 IP 定位 API 更换
- **原 API**: `api.ipify.org` + `api.vore.top` (国内被墙)
- **新API**: `ip-api.com` (免费、无需Key、支持中文)
- **返回数据**：
  ```javascript
  {
    status: "success",
    country: "中国",
    regionName: "广东",
    city: "广州",
    lat: 23.1291,
    lon: 113.2644
  }
  ```

##### 1.3 高德地图集成
- **新增文件**: `src/utils/amap.ts`
- **功能**: 使用高德地图 JavaScript SDK 进行定位
- **API 配置**：
  - Key: `5fd05918e767ec572cb16a99a4e647bc`
  - 安全密钥: `066fe469482ef640461c35c640e21ea3`

##### 1.4 Vite 代理配置
- **修改文件**: `vite.config.ts`
- **新增代理**：
  - `/amap` → `https://restapi.amap.com`
  - 解决 CORS 跨域问题

#### 2. 天气 API 集成

##### 2.1 OpenWeatherMap 集成
- **新增文件**: `src/api/weather.ts` (289行)
- **API Key**: `f2767ce16ef8bac65d38f9c60de0f3d5`
- **功能**：
  - `getCurrentWeather()` - 获取当前天气
  - `getWeatherForecast()` - 获取未来5天预报
  - `getFullWeatherData()` - 获取完整天气数据

- **返回数据**：
  ```typescript
  interface WeatherData {
    temp: number              // 温度 ℃
    feelsLike: number         // 体感温度
    humidity: number          // 湿度 %
    pressure: number          // 气压 hPa
    windSpeed: number         // 风速 m/s
    windDeg: number           // 风向 度
    visibility: number        // 能见度 m
    cloudiness: number        // 云量 %
    description: string       // 天气描述(中文)
    sunrise: number           // 日出时间戳
    sunset: number            // 日落时间戳
  }
  ```

##### 2.2 Vite 代理配置
- **新增代理**: `/openweathermap` → `https://api.openweathermap.org`
- **避免 CORS 问题**

#### 3. 状态管理优化

##### 3.1 Weather Store 重构
- **修改文件**: `src/store/modules/weather.ts` (231行)
- **新增状态**：
  ```typescript
  locationInfo: LocationData | null
  weatherData: WeatherData | null
  isLocating: boolean
  isFetchingWeather: boolean
  lastLocationUpdateTime: number | null
  lastWeatherUpdateTime: number | null
  ```

- **新增 Getters**：
  - `formattedAddress` - 格式化地址（仅显示市+区）
  - `needsLocationUpdate` - 判断是否需要更新定位（30分钟）
  - `needsWeatherUpdate` - 判断是否需要更新天气（10分钟）
  - `currentTempText` - 当前温度文本
  - `currentWeatherText` - 当前天气描述

- **新增 Actions**：
  - `getLocationInfo()` - 智能三级降级定位
  - `getWeatherData()` - 获取天气数据
  - `resetLocation()` / `resetWeather()` / `resetAll()` - 清除缓存

- **缓存策略**：
  - 定位缓存: 30分钟
  - 天气缓存: 10分钟
  - 数据持久化: localStorage

#### 4. UI 组件集成

##### 4.1 IndexHeader.vue 优化
- **修改文件**: `src/views/index/component/oneLevel/IndexHeader.vue`
- **功能**：
  - 显示实时位置（市+区格式）
  - 加载动画效果
  - 错误提示
  - 点击图标强制刷新
  - 使用 `formattedAddress` getter

##### 4.2 IndexCard.vue 重构
- **修改文件**: `src/views/index/component/oneLevel/IndexCard.vue`
- **显示数据**：
  - 🌡️ 室外温度 (动态图标: 35℃+ → 🥵, 25-35℃ → 🌡️, 15-25℃ → ☀️, 5-15℃ → 🌤️, <5℃ → ❄️)
  - 💧 室外湿度 (动态图标: 80%+ → 💧, 60-80% → 💦, <60% → 🌬️)
  - ☁️ 云量 (动态图标: 80%+ → ☁️, 50-80% → 🌥️, 20-50% → ⛅, <20% → ☀️)
  - 🧭 气压 (动态图标: 1020hPa+ → 🔼, 1000-1020hPa → 🧭, <1000hPa → 🔽)
  - 🍃 风速 (动态图标: ≥10m/s → 🌪️, 5-10m/s → 💨, 2-5m/s → 🍃, <2m/s → 🍁)

- **特性**：
  - Skeleton 加载动画
  - 使用 emoji 图标替代图片
  - 根据天气数据动态变化图标
  - 实时数据更新

#### 5. TypeScript 配置优化

##### 5.1 模块解析修复
- **修改文件**: `tsconfig.json`
- **新增配置**：
  ```json
  {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
  ```

##### 5.2 Vue 模块声明
- **新增文件**: `src/env.d.ts`
- **内容**: Vue 模块声明，解决 TypeScript 导入错误

#### 6. 测试页面增强

##### 6.1 清除缓存功能
- **修改文件**: `src/views/test/LocationTest.vue`
- **新增功能**：
  - 🗑️ 清除缓存按钮
  - 清除 localStorage 中的 weatherStore 数据
  - 重置 Store 状态

#### 7. 表格宽度统一

##### 7.1 修改所有表格组件宽度
- **修改文件** (5个):
  - `personnelManagement/teacherManagement/component/teacherTable.vue`
  - `medicalServices/hospitalInfo/manage/component/Table.vue`
  - `personnelManagement/logisticalManagement/component/logisticalTable.vue`
  - `personnelManagement/studentManagement/component/studentTable.vue`
  - `personnelManagement/parentManagement/component/parentTable.vue`

- **变更**: 
  - 原宽度: `915px / 1065px`
  - 新宽度: `1065px / 1200px`
  - 侧边栏收起: 1065px
  - 侧边栏展开: 1200px

#### 8. 文档创建

##### 8.1 集成指南
- **新增文件**: `docs/integration-guide.md` (334行)
- **内容**: 天气与定位功能完整使用指南

##### 8.2 集成检查清单
- **新增文件**: `docs/INTEGRATION_CHECKLIST.md` (297行)
- **内容**: 验证步骤和测试清单

#### 9. 问题解决

##### 9.1 高德地图 API Key 平台错误
- **问题**: `USERKEY_PLAT_NOMATCH` (infocode: 10009)
- **原因**: API Key 被绑定到特定平台
- **解决**: 使用免费的 ip-api.com 替代

##### 9.2 紫外线数据缺失
- **问题**: OpenWeatherMap 免费 API 不包含 UV 数据
- **解决**: 改为显示气压数据

##### 9.3 体感温度替换为风速
- **变更**: 将第5个指标从体感温度改为风速
- **原因**: 显示更多天气维度

#### 10. 技术亮点

- ✅ 三级定位降级策略
- ✅ 逆地理编码获取中文地址
- ✅ OpenWeatherMap 实时天气集成
- ✅ Pinia 状态管理与缓存
- ✅ Vite 代理解决 CORS
- ✅ Emoji 图标动态化
- ✅ Skeleton 加载动画
- ✅ TypeScript 完整类型支持

#### 11. API 配置汇总

```javascript
// 高德地图
Key: 5fd05918e767ec572cb16a99a4e647bc
安全密钥: 066fe469482ef640461c35c640e21ea3

// OpenWeatherMap
API Key: f2767ce16ef8bac65d38f9c60de0f3d5

// IP 定位
API: ip-api.com (免费无限制)

// 逆地理编码
API: nominatim.openstreetmap.org (免费)
```

#### 12. 后续优化计划

- ⚡ 天气预警功能
- ⚡ 历史天气数据图表
- ⚡ 位置分享功能
- ⚡ 离线缓存优化

---

## 2025-11-04

### 任务：实现混合定位方案

#### 背景
用户需要实现定位功能，用于获取用户的地理位置信息，以便后续集成天气 API。

#### 实现方案
采用混合定位方案：**GPS 定位优先，失败自动降级到 IP 定位**

#### 文件创建

##### 1. `src/utils/location.ts` - 定位工具模块
- **功能**：提供三个主要定位函数
  - `getGPSLocation()` - 使用浏览器 Geolocation API 获取精确位置（精度 10-100 米）
  - `getIPLocation()` - 通过 IP 地址获取位置（精度到城市级）
  - `getLocation()` - 混合方案，GPS 优先，失败降级到 IP

- **关键特性**：
  - ✅ 完整的错误处理和用户反馈
  - ✅ GPS 定位配置：高精度模式、10秒超时、不缓存
  - ✅ IP 定位两步流程：先获取 IP（api.ipify.org），再获取地理信息（api.vore.top）
  - ✅ TypeScript 类型定义（LocationData 接口）

- **返回数据结构**：
  ```typescript
  interface LocationData {
    latitude: number        // 纬度
    longitude: number       // 经度
    accuracy?: number       // 精度（仅 GPS 有）
    source: 'gps' | 'ip'   // 定位源标识
    city?: string           // 城市（仅 IP 有）
    province?: string       // 省份（仅 IP 有）
    country?: string        // 国家（仅 IP 有）
  }
  ```

##### 2. `src/store/modules/weather.ts` - 更新状态管理
集成定位功能到 Pinia store：

- **新增状态**：
  ```typescript
  locationInfo: LocationData | null  // 存储定位结果
  isLocating: boolean                 // 定位中标志
  ```

- **新增方法**：
  - `getLocationInfo()` - 异步获取定位信息，支持缓存
  - `resetLocation()` - 清除缓存，允许重新定位

- **特性**：
  - ✅ 自动缓存避免重复请求
  - ✅ 加载状态管理
  - ✅ 向后兼容旧接口 `getAddressInfo()`

#### 浏览器兼容性

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Geolocation API | ✅ 完全 | ✅ 完全 | ✅ 完全 | ✅ 完全 |
| HTTPS 要求 | ✅ 是 | ✅ 是 | ✅ 是 | ✅ 是 |

#### GPS vs IP 定位对比

| 方面 | GPS | IP |
|------|-----|-----|
| 精度 | 10-100 米 | 城市级 |
| 用户授权 | ✅ 需要 | ❌ 不需要 |
| 响应速度 | 较慢（首次10秒） | 快速（<1秒） |
| 离线可用 | ✅ 可用 | ❌ 需要网络 |
| 隐私性 | ⭐⭐⭐⭐ | ⭐⭐ |

#### 使用示例

**方式 1：在 Composition API 中使用**
```typescript
<script setup lang="ts">
import { useWeatherStore } from '@/store/modules/weather'
import { onMounted } from 'vue'

const weatherStore = useWeatherStore()

onMounted(async () => {
  const location = await weatherStore.getLocationInfo()
  if (location) {
    console.log('定位成功:', {
      纬度: location.latitude,
      经度: location.longitude,
      精度: location.accuracy,
      定位源: location.source,
    })
  }
})
</script>
```

**方式 2：直接使用工具函数**
```typescript
import { getLocation } from '@/utils/location'

const location = await getLocation()
// 返回定位信息或抛出异常
```

#### 注意事项

1. **GPS 定位要求**：
   - ✅ 支持：HTTPS 和 localhost
   - ❌ 不支持：HTTP（除 localhost 外）
   - 🔓 需要用户授权（浏览器会弹出权限对话框）

2. **IP 定位限制**：
   - 共享网络 IP 会显示错误位置
   - 精度仅到城市级别
   - 依赖外部 API 服务的可用性

3. **缓存机制**：
   - 定位结果自动缓存
   - 使用 `resetLocation()` 清除缓存后可重新定位

#### 错误场景处理

```typescript
try {
  const location = await getLocation()
} catch (error) {
  // 可能的错误：
  // - '用户拒绝了地理定位请求'
  // - '地理位置信息不可用'
  // - '获取地理位置信息超时'
  // - 'IP 定位失败: ...'
}
```

#### 后续计划

1. ✅ 完成混合定位方案
2. ⏳ 集成 OpenWeatherMap API 获取真实天气数据
3. ⏳ 将定位信息保存到服务器（用于数据分析）
4. ⏳ 根据位置提供相关的校园信息

---

## 删除文件

- ❌ 删除：`src/utils/LOCATION_USAGE.md`（内容已迁移至本日志）

---

## 测试页面实现

### 文件创建

#### 1. `src/views/test/LocationTest.vue` - 残韶测试页面
- **功能**：提供完整的残韶测试界面
  - 混合定位测试（GPS 首先）
  - 仅 GPS 定位测试
  - 仅 IP 定位测试
  - 定位信息览鲅和日志记录

- **UI 特性**：
  - 渐变背景（紫色系）
  - 定位状态实时显示
  - 详细的经纬度信息展示
  - 实时日志记录（最多 50 条）
  - 浏览器兰容性信息、协议类型等技术详情

#### 2. `src/router/modules/test.ts` - 测试路由配置
- 钢缝路由 `/test/location` 指向测试页面

#### 3. `src/router/index.ts` - 更新
- 将测试路由整合到主路由配置

### 修复了的问题

1. ✅ **SSR 兼容性问题**
   - 修复: window 对象在 SSR 下不存在
   - 方案: 使用 `typeof window !== 'undefined'` 安全检查

2. ✅ **Element Plus 按钮类型警告**
   - 修复: `type="text"` 已废弃，改用 `link`
   - 消除 Element Plus 3.0.0 开始的锻指警告

3. ✅ **IP 定位 API 响应格式兼容**
   - 擦大副后，API 响应无效
   - 修复: 处理多种响应格式，且添加了详细的回应日志

### 测试结果

#### 成功
- ✅ **GPS 定位成功**
  - 浏览器已支持 Geolocation API
  - 第一次测试成功获取经纬度信息
  - толон: `✓ GPS 定位成功 Object`

#### 待优化
- ⏳ **IP 定位**——需要验证上游 API 的响应格式

### 使用方法

访问下面地址，点击"获取定位"按钇：
```
http://localhost:5173/#/test/location
```

测试页面特点：
- 📊 混合定位测试
- 📊 单独 GPS 测试
- 📊 单独 IP 定位测试
- 📊 实时日志记录（增删改查）
- 📊 浏览器技术信息永井

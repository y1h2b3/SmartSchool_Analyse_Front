# SmartCampus 开发日志

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

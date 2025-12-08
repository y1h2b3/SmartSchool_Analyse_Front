/**
 * 地理定位工具模块 - 优化版
 * 支持 GPS、高德地图、IP 定位的智能降级方案
 * 特性：缓存机制、错误重试、超时优化、详细日志
 */

export interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  source: 'gps' | 'ip' | 'amap' | 'manual'
  city?: string
  province?: string
  country?: string
  district?: string
  address?: string
  timestamp?: number // 定位时间戳
}

// 定位缓存配置
const CACHE_KEY = 'location_cache'
const CACHE_DURATION = 30 * 60 * 1000 // 30分钟缓存（毫秒）

// 定位配置
const LOCATION_CONFIG = {
  amapTimeout: 3000, // 高德超时时间（3秒）
  ipTimeout: 5000, // IP超时时间（5秒）
  retryTimes: 2, // 重试次数
  retryDelay: 1000, // 重试延迟（1秒）
}

/**
 * 从缓存获取定位
 */
function getLocationFromCache(): LocationData | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const data: LocationData = JSON.parse(cached)
    const now = Date.now()
    
    // 检查缓存是否过期
    if (data.timestamp && (now - data.timestamp < CACHE_DURATION)) {
      return data
    }
    
    // 缓存过期，清除
    localStorage.removeItem(CACHE_KEY)
    return null
  } catch (error) {
    return null
  }
}

/**
 * 保存定位到缓存
 */
function saveLocationToCache(location: LocationData): void {
  try {
    const data = {
      ...location,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch (error) {
    // 忽略错误
  }
}

/**
 * 获取 GPS 定位信息（已禁用）
 * @param timeout 超时时间（毫秒）
 * @returns Promise<LocationData>
 */
/* 已删除 GPS 定位功能
export function getGPSLocation(timeout = 8000): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    // 检查浏览器是否支持 Geolocation API
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持地理定位功能'))
      return
    }

    const startTime = Date.now()

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const elapsed = Date.now() - startTime
        
        const location: LocationData = {
          latitude,
          longitude,
          accuracy,
          source: 'gps',
          timestamp: Date.now(),
        }
        
        resolve(location)
      },
      (error) => {
        const elapsed = Date.now() - startTime
        let errorMsg = 'GPS定位失败'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = '用户拒绝了地理定位请求'
            break
          case error.POSITION_UNAVAILABLE:
            errorMsg = '地理位置信息不可用'
            break
          case error.TIMEOUT:
            errorMsg = `GPS定位超时 (${elapsed}ms)`
            break
        }
        
        reject(new Error(errorMsg))
      },
      {
        enableHighAccuracy: true, // 高精度模式
        timeout: timeout,
        maximumAge: 0, // 不使用缓存
      },
    )
  })
}
*/

/**
 * 获取 IP 定位信息（优化版，带超时和重试）
 * @param timeout 超时时间（毫秒）
 * @returns Promise<LocationData>
 */
export function getIPLocation(timeout = LOCATION_CONFIG.ipTimeout): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    
    // 创建超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    // 使用免费的 ip-api.com 服务 (无需 Key,支持中文)
    fetch('http://ip-api.com/json/?lang=zh-CN&fields=status,message,country,countryCode,region,regionName,city,lat,lon', {
      signal: controller.signal
    })
      .then((response) => response.json())
      .then((data) => {
        clearTimeout(timeoutId)
        const elapsed = Date.now() - startTime
        
        if (data.status === 'success') {
          const location: LocationData = {
            latitude: data.lat || 0,
            longitude: data.lon || 0,
            source: 'ip',
            city: data.city || '',
            province: data.regionName || '',
            country: data.country || '',
            timestamp: Date.now(),
          }
          resolve(location)
        } else {
          reject(new Error(`IP 定位失败: ${data.message || '未知错误'}`))
        }
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        const elapsed = Date.now() - startTime
        
        if (error.name === 'AbortError') {
          reject(new Error(`IP定位超时 (${elapsed}ms)`))
        } else {
          reject(new Error(`IP定位失败: ${error.message}`))
        }
      })
  })
}

/**
 * 高德地图定位（优化版，带超时控制）
 * @param timeout 超时时间（毫秒）
 * @returns Promise<LocationData>
 */
export async function getAmapLocation(timeout = LOCATION_CONFIG.amapTimeout): Promise<LocationData> {
  const startTime = Date.now()
  
  try {
    // 动态导入高德地图模块
    const { getAmapLocation: amapLocate } = await import('./amap')
    
    // 创建超时Promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('高德定位超时')), timeout)
    })
    
    // 竞速：定位 vs 超时
    const result = await Promise.race([
      amapLocate(),
      timeoutPromise
    ])
    
    const elapsed = Date.now() - startTime
    
    const location: LocationData = {
      latitude: result.latitude,
      longitude: result.longitude,
      accuracy: result.accuracy || 300,
      source: 'amap',
      city: result.city || '',
      province: result.province || '',
      district: result.district || '',
      address: result.address || '',
      timestamp: Date.now(),
    }
    
    return location
  } catch (error: any) {
    throw new Error(`高德定位失败: ${error.message}`)
  }
}

/**
 * 使用百度逆地理编码将坐标转换为中文地址（已禁用，GPS 功能已移除）
 */
/* 已删除 GPS 相关的逆地理编码功能
async function getChineseAddress(latitude: number, longitude: number): Promise<Partial<LocationData>> {
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=zh-CN`
    
    const response = await fetch(osmUrl, {
      headers: {
        'User-Agent': 'SmartCampus/1.0'
      }
    })
    const data = await response.json()
    
    if (data.address) {
      return {
        province: data.address.state || data.address.province || '',
        city: data.address.city || data.address.county || '',
        district: data.address.suburb || data.address.town || '',
        address: data.display_name || '',
      }
    }
    return {}
  } catch (error) {
    return {}
  }
}
*/

/**
 * 智能混合定位方案（优化版）
 * 新策略：高德地图 → 默认中山（移除IP定位）
 * @param useCache 是否使用缓存（默认true）
 * @param forceAmap 是否强制使用高德（默认false）
 * @returns Promise<LocationData>
 */
export async function getLocation(useCache = true, forceAmap = false): Promise<LocationData> {
  // 检查缓存
  if (useCache) {
    const cached = getLocationFromCache()
    if (cached) {
      return cached
    }
  }
  
  // 策略1: 高德地图定位
  try {
    const amapLocation = await getAmapLocation()
    saveLocationToCache(amapLocation)
    return amapLocation
  } catch (amapError) {
    // 高德定位失败，降级到默认城市
  }

  // 策略2: 默认使用中山
  try {
    const zhongshanLocation = await getCityLocation('中山')
    saveLocationToCache(zhongshanLocation)
    return zhongshanLocation
  } catch (cityError) {
    // 获取中山位置失败
  }

  throw new Error('定位失败: 所有定位方式均不可用')
}

/**
 * 根据城市名称获取经纬度（使用高德地理编码 API）
 * @param cityName 城市名称（如："北京"、"上海"、"广州"）
 * @param timeout 超时时间（毫秒）
 * @returns Promise<LocationData>
 */
export async function getCityLocation(cityName: string, timeout = 5000): Promise<LocationData> {
  try {
    // 使用高德地图地理编码 API
    const AMAP_KEY = '97d46cfa6c03fc5506ca5990c932ae2b'
    const url = `https://restapi.amap.com/v3/geocode/geo?key=${AMAP_KEY}&address=${encodeURIComponent(cityName)}&output=json`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, {
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    const data = await response.json()
    
    if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
      const result = data.geocodes[0]
      const [lon, lat] = result.location.split(',').map(parseFloat)
      
      const location: LocationData = {
        latitude: lat,
        longitude: lon,
        source: 'manual',
        city: result.city || cityName,
        province: result.province || '',
        district: result.district || '',
        address: result.formatted_address || cityName,
        timestamp: Date.now(),
      }
      
      return location
    } else {
      throw new Error('未找到该城市，请检查城市名称')
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('城市定位超时，请重试')
    }
    throw new Error(`城市定位失败: ${error.message}`)
  }
}

/**
 * 清除定位缓存
 */
export function clearLocationCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch (error) {
    // 忽略错误
  }
}

/**
 * 根据坐标获取详细地址信息（可选）
 * @param latitude 纬度
 * @param longitude 经度
 * @returns Promise<any>
 */
export function getAddressByCoordinates(
  latitude: number,
  longitude: number,
): Promise<any> {
  // 可以使用高德地图、百度地图等服务
  // 这里仅作示例
  return new Promise((resolve, reject) => {
    // 示例：使用高德地图逆地理互编
    // 需要配置高德地图 API Key
    resolve({
      latitude,
      longitude,
    })
  })
}

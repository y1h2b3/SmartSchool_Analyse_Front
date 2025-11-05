/**
 * 地理定位工具模块
 * 支持 GPS 定位和 IP 定位的混合方案
 */

export interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  source: 'gps' | 'ip' | 'amap'
  city?: string
  province?: string
  country?: string
  district?: string
  address?: string
}

/**
 * 获取 GPS 定位信息
 * @returns Promise<LocationData>
 */
export function getGPSLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    // 检查浏览器是否支持 Geolocation API
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持地理定位功能'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        resolve({
          latitude,
          longitude,
          accuracy,
          source: 'gps',
        })
      },
      (error) => {
        let errorMsg = '定位失败'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = '用户拒绝了地理定位请求'
            break
          case error.POSITION_UNAVAILABLE:
            errorMsg = '地理位置信息不可用'
            break
          case error.TIMEOUT:
            errorMsg = '获取地理位置信息超时'
            break
        }
        reject(new Error(errorMsg))
      },
      {
        enableHighAccuracy: true, // 高精度模式
        timeout: 10000, // 10秒超时
        maximumAge: 0, // 不使用缓存
      },
    )
  })
}

/**
 * 获取 IP 定位信息 (使用免费公共 API)
 * @returns Promise<LocationData>
 */
export function getIPLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    // 使用免费的 ip-api.com 服务 (无需 Key,支持中文)
    fetch('http://ip-api.com/json/?lang=zh-CN&fields=status,message,country,countryCode,region,regionName,city,lat,lon')
      .then((response) => response.json())
      .then((data) => {
        console.log('✅ IP 定位响应:', data)
        
        if (data.status === 'success') {
          resolve({
            latitude: data.lat || 0,
            longitude: data.lon || 0,
            source: 'ip',
            city: data.city || '',
            province: data.regionName || '',
            country: data.country || '',
          })
        } else {
          reject(new Error(`IP 定位失败: ${data.message || '未知错误'}`))
        }
      })
      .catch((error) => {
        reject(new Error(`IP 定位失败: ${error.message}`))
      })
  })
}

/**
 * 高德地图定位
 */
export async function getAmapLocation(): Promise<LocationData> {
  try {
    const { getAmapLocation: amapLocate } = await import('./amap')
    const result = await amapLocate()
    
    return {
      latitude: result.latitude,
      longitude: result.longitude,
      accuracy: result.accuracy,
      source: 'amap',
      city: result.city,
      province: result.province,
      district: result.district,
      address: result.address,
    }
  } catch (error: any) {
    throw new Error(`高德定位失败: ${error.message}`)
  }
}

/**
 * 混合定位方案：优先 IP（有中文地址） → 高德地图 → GPS
 * @returns Promise<LocationData>
 */
export async function getLocation(): Promise<LocationData> {
  // 1. 优先尝试 IP 定位（直接返回中文地址）
  try {
    const ipLocation = await getIPLocation()
    console.log('✓ IP 定位成功', ipLocation)
    return ipLocation
  } catch (ipError) {
    console.warn('✗ IP 定位失败:', ipError)
  }

  // 2. IP 失败，尝试高德地图定位
  try {
    const amapLocation = await getAmapLocation()
    console.log('✓ 高德定位成功', amapLocation)
    return amapLocation
  } catch (amapError) {
    console.warn('✗ 高德定位失败:', amapError)
  }

  // 3. 最后尝试 GPS 定位
  try {
    const gpsLocation = await getGPSLocation()
    console.log('✓ GPS 定位成功', gpsLocation)
    return gpsLocation
  } catch (gpsError) {
    console.warn('✗ GPS 定位失败:', gpsError)
  }

  // 2. GPS 失败，尝试高德地图定位
  try {
    const amapLocation = await getAmapLocation()
    console.log('✓ 高德定位成功', amapLocation)
    return amapLocation
  } catch (amapError) {
    console.warn('✗ 高德定位失败:', amapError)
  }

  // 3. 最后尝试 IP 定位
  try {
    const ipLocation = await getIPLocation()
    console.log('✓ IP 定位成功', ipLocation)
    return ipLocation
  } catch (ipError) {
    console.error('✗ IP 定位失败:', ipError)
  }

  throw new Error('定位失败: 所有定位方式均不可用')
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

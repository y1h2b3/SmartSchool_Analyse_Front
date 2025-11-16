/**
 * 地理定位工具模块
 * 支持 GPS 定位和 IP 定位的混合方案
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
        timeout: 15000, // 延长到15秒
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
 * 使用百度逆地理编码将坐标转换为中文地址(免费无限制)
 */
async function getChineseAddress(latitude: number, longitude: number): Promise<Partial<LocationData>> {
  try {
    // 使用百度地图API（无key限制）
    const url = `https://api.map.baidu.com/reverse_geocoding/v3/?ak=YOUR_BAIDU_KEY&output=json&coordtype=wgs84ll&location=${latitude},${longitude}`
    
    // 备选: 使用 Nominatim (OpenStreetMap 免费服务)
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=zh-CN`
    
    const response = await fetch(osmUrl, {
      headers: {
        'User-Agent': 'SmartCampus/1.0'
      }
    })
    const data = await response.json()
    
    console.log('🗺️ 逆地理编码响应:', data)
    
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
    console.warn('⚠️ 逆地理编码失败:', error)
    return {}
  }
}

/**
 * 混合定位方案:GPS(高精度) → 高德地图 → IP(备选)
 * @returns Promise<LocationData>
 */
export async function getLocation(): Promise<LocationData> {
  // 🎯 策略1: GPS 定位 (精度最高 5-50米,需要用户授权)
  try {
    const gpsLocation = await getGPSLocation()
    console.log('✅ GPS 定位成功:', gpsLocation)
    
    // GPS 获取到坐标后,用逆地理编码获取中文地址
    const address = await getChineseAddress(gpsLocation.latitude, gpsLocation.longitude)
    
    return {
      ...gpsLocation,
      ...address,
    }
  } catch (gpsError) {
    console.warn('⚠️ GPS 定位失败(可能未授权):', gpsError)
  }

  // 🎯 策略2: 高德地图定位 (精度 100-500米)
  try {
    const amapLocation = await getAmapLocation()
    console.log('✅ 高德定位成功:', amapLocation)
    return amapLocation
  } catch (amapError) {
    console.warn('⚠️ 高德定位失败:', amapError)
  }

  // 🎯 策略3: IP 定位 (城市级精度,可能不准)
  try {
    const ipLocation = await getIPLocation()
    console.log('✅ IP 定位成功:', ipLocation)
    return ipLocation
  } catch (ipError) {
    console.error('❌ IP 定位失败:', ipError)
  }

  throw new Error('定位失败: 所有定位方式均不可用')
}

/**
 * 根据城市名称获取经纬度（地理编码）
 * 使用 OpenStreetMap Nominatim API
 * @param cityName 城市名称（如："北京"、"上海"、"广州"）
 * @returns Promise<LocationData>
 */
export async function getCityLocation(cityName: string): Promise<LocationData> {
  try {
    // 使用 Nominatim 地理编码服务（免费）
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&accept-language=zh-CN&limit=1`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SmartCampus/1.0'
      }
    })
    
    const data = await response.json()
    console.log('🗺️ 城市地理编码响应:', data)
    
    if (data && data.length > 0) {
      const result = data[0]
      
      // 获取详细地址信息
      const addressParts = result.display_name.split(', ')
      
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        source: 'manual',
        city: cityName,
        address: result.display_name,
        country: addressParts[addressParts.length - 1] || '',
      }
    } else {
      throw new Error('未找到该城市，请检查城市名称')
    }
  } catch (error: any) {
    console.error('❌ 城市地理编码失败:', error)
    throw new Error(`城市定位失败: ${error.message}`)
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

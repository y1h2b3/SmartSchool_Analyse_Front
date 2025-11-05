/**
 * 高德地图工具模块
 * 提供定位、地理编码、逆地理编码等功能
 */

import AMapLoader from '@amap/amap-jsapi-loader'

// 高德地图配置
const AMAP_CONFIG = {
  key: '5fd05918e767ec572cb16a99a4e647bc',
  securityJsCode: '066fe469482ef640461c35c640e21ea3',
  version: '2.0',
  plugins: ['AMap.Geocoder', 'AMap.Geolocation'],
}

// 全局 AMap 实例（单例）
let AMap: any = null

/**
 * 初始化高德地图
 */
async function initAMap(): Promise<any> {
  if (AMap) return AMap

  try {
    AMap = await AMapLoader.load({
      key: AMAP_CONFIG.key,
      version: AMAP_CONFIG.version,
      plugins: AMAP_CONFIG.plugins,
      securityJsCode: AMAP_CONFIG.securityJsCode,
    })
    console.log('✓ 高德地图初始化成功')
    return AMap
  } catch (error) {
    console.error('✗ 高德地图初始化失败:', error)
    throw new Error(`高德地图初始化失败: ${error}`)
  }
}

/**
 * 逆地理编码 - 根据经纬度获取地址（使用 REST API）
 */
export async function getAddressByCoordinates(
  latitude: number,
  longitude: number,
): Promise<any> {
  try {
    // 使用高德 Web 服务 API（REST API）
    const location = `${longitude},${latitude}`
    const url = `/amap/v3/geocode/regeo?key=${AMAP_CONFIG.key}&location=${location}&output=json`
    
    console.log('🔍 高德 REST API 请求:', url)
    
    const response = await fetch(url)
    const data = await response.json()
    
    console.log('🔍 高德 REST API 响应:', data)
    
    if (data.status === '1' && data.info === 'OK') {
      const regeocode = data.regeocode
      const addressComponent = regeocode.addressComponent
      
      return {
        success: true,
        address: regeocode.formatted_address,
        province: addressComponent.province,
        city: addressComponent.city || addressComponent.province, // 如果没有 city，使用 province
        district: addressComponent.district,
        township: addressComponent.township,
        street: addressComponent.streetNumber?.street || '',
        adcode: addressComponent.adcode,
      }
    } else {
      throw new Error(`高德逆地理编码失败: ${data.info}`)
    }
  } catch (error) {
    console.error('✗ 高德 REST API 错误:', error)
    throw error
  }
}

/**
 * 高德地图定位
 */
export async function getAmapLocation(): Promise<any> {
  try {
    const AMap = await initAMap()
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      convert: true, // 自动转换为高德坐标
    })

    return new Promise((resolve, reject) => {
      geolocation.getCurrentPosition((status: string, result: any) => {
        if (status === 'complete') {
          const position = result.position
          const addressComponent = result.addressComponent || {}
          
          resolve({
            success: true,
            latitude: position.lat,
            longitude: position.lng,
            accuracy: result.accuracy,
            address: result.formattedAddress || '',
            province: addressComponent.province || '',
            city: addressComponent.city || '',
            district: addressComponent.district || '',
          })
        } else {
          reject(new Error(result.message || '高德定位失败'))
        }
      })
    })
  } catch (error) {
    console.error('✗ 高德定位异常:', error)
    throw error
  }
}

export default {
  initAMap,
  getAddressByCoordinates,
  getAmapLocation,
}

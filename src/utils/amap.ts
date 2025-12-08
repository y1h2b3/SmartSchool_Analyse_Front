/**
 * 高德地图工具模块
 * 提供定位、地理编码、逆地理编码等功能
 */

import AMapLoader from '@amap/amap-jsapi-loader'

// 高德地图配置
const AMAP_CONFIG = {
  key: '97d46cfa6c03fc5506ca5990c932ae2b',
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
    // 清理可能存在的旧实例
    if (window.AMap) {
      AMap = window.AMap
      return AMap
    }

    AMap = await AMapLoader.load({
      key: AMAP_CONFIG.key,
      version: AMAP_CONFIG.version,
      plugins: AMAP_CONFIG.plugins,
      securityJsCode: AMAP_CONFIG.securityJsCode,
    })
    return AMap
  } catch (error) {
    console.error('高德地图初始化错误:', error)
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
    
    const response = await fetch(url)
    const data = await response.json()
    
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
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 0,
      convert: true,
      showButton: false,
      showMarker: false,
      showCircle: false,
      panToLocation: false,
      zoomToAccuracy: false,
      noIpLocate: 0,
      noGeoLocation: 0,
    })

    return new Promise((resolve, reject) => {
      geolocation.getCurrentPosition((status: string, result: any) => {
        if (status === 'complete') {
          const position = result.position
          const addressComponent = result.addressComponent || {}
          
          const hasAddressComponent = addressComponent && Object.keys(addressComponent).length > 0
          const hasFormattedAddress = result.formattedAddress && result.formattedAddress.trim() !== ''
          
          // 如果高德没有返回地址信息，使用高德逆地理编码 API
          if (!hasAddressComponent && !hasFormattedAddress) {
            const location = `${position.lng},${position.lat}`
            const regeoUrl = `https://restapi.amap.com/v3/geocode/regeo?key=${AMAP_CONFIG.key}&location=${location}&output=json`
            
            fetch(regeoUrl, {
              signal: AbortSignal.timeout(8000)
            })
              .then(res => res.json())
              .then(data => {
                
                if (data.status === '1' && data.regeocode) {
                  const regeocode = data.regeocode
                  const addrComp = regeocode.addressComponent || {}
                  
                  resolve({
                    success: true,
                    latitude: position.lat,
                    longitude: position.lng,
                    accuracy: result.accuracy,
                    address: regeocode.formatted_address || '',
                    province: addrComp.province || '',
                    city: addrComp.city || addrComp.province || '',
                    district: addrComp.district || '',
                    township: addrComp.township || '',
                    street: addrComp.streetNumber?.street || '',
                  })
                } else {
                  // 高德 API 也失败，返回坐标
                  resolve({
                    success: true,
                    latitude: position.lat,
                    longitude: position.lng,
                    accuracy: result.accuracy,
                    address: '',
                    province: '',
                    city: '',
                    district: '',
                    township: '',
                    street: '',
                  })
                }
              })
              .catch(error => {
                // API 失败，仅返回坐标
                resolve({
                  success: true,
                  latitude: position.lat,
                  longitude: position.lng,
                  accuracy: result.accuracy,
                  address: '',
                  province: '',
                  city: '',
                  district: '',
                  township: '',
                  street: '',
                })
              })
          } else {
            // 高德返回了地址信息，直接使用
            let city = addressComponent.city || ''
            let province = addressComponent.province || ''
            let district = addressComponent.district || ''
            
            // 如果高德没有返回city，尝试从formattedAddress解析
            if (!city && result.formattedAddress) {
              const match = result.formattedAddress.match(/^(.+?省)?(.+?市)/)
              if (match) {
                if (match[1]) province = match[1]
                if (match[2]) city = match[2]
              }
            }
            
            // 处理直辖市和地级市（如中山市）
            if (!city && province && province.includes('市')) {
              city = province
            }
            
            resolve({
              success: true,
              latitude: position.lat,
              longitude: position.lng,
              accuracy: result.accuracy,
              address: result.formattedAddress || '',
              province: province,
              city: city,
              district: district,
              township: addressComponent.township || '',
              street: addressComponent.street || '',
            })
          }
        } else {
          reject(new Error(result.message || '高德定位失败'))
        }
      })
    })
  } catch (error) {
    throw error
  }
}

export default {
  initAMap,
  getAddressByCoordinates,
  getAmapLocation,
}

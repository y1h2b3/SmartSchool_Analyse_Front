import { defineStore } from 'pinia'
import { getLocation, getGPSLocation, getAmapLocation, getIPLocation, type LocationData } from '@/utils/location'
import { getFullWeatherData, getCurrentWeather, type WeatherData } from '@/api/weather'

export const useWeatherStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'weatherStore',
  // state: 返回对象的函数
  state: () => ({
    locationInfo: null as LocationData | null,
    weatherData: null as WeatherData | null,
    addressInfo: null,
    isLocating: false,
    isFetchingWeather: false,
    lastLocationUpdateTime: null as number | null,
    lastWeatherUpdateTime: null as number | null,
  }),
  getters: {
    // 获取当前位置的格式化地址（仅显示市+区）
    formattedAddress: (state) => {
      if (!state.locationInfo) return '未知位置'
      const { city, district } = state.locationInfo
      
      // 仅显示市和区
      if (city && district) {
        return `${city} ${district}`
      }
      return city || district || '未知位置'
    },
    // 判断是否需要更新定位（超过 30 分钟）
    needsLocationUpdate: (state) => {
      if (!state.lastLocationUpdateTime) return true
      const now = Date.now()
      const thirtyMinutes = 30 * 60 * 1000
      return now - state.lastLocationUpdateTime > thirtyMinutes
    },
    // 判断是否需要更新天气（超过 10 分钟）
    needsWeatherUpdate: (state) => {
      if (!state.lastWeatherUpdateTime) return true
      const now = Date.now()
      const tenMinutes = 10 * 60 * 1000
      return now - state.lastWeatherUpdateTime > tenMinutes
    },
    // 获取当前温度文本
    currentTempText: (state) => {
      if (!state.weatherData) return '--℃'
      return Math.round(state.weatherData.temp) + '℃'
    },
    // 获取当前天气描述
    currentWeatherText: (state) => {
      if (!state.weatherData) return '未知'
      return state.weatherData.description
    },
  },
  actions: {
    /**
     * 获取定位信息（智能三级降级：GPS → 高德 → IP）
     */
    async getLocationInfo(forceUpdate = false): Promise<LocationData | null> {
      // 如果有缓存且不强制更新，直接返回
      if (this.locationInfo && !forceUpdate) return this.locationInfo

      this.isLocating = true
      try {
        const location = await getLocation()
        this.locationInfo = location
        this.lastLocationUpdateTime = Date.now()
        console.log('✅ 定位成功:', location)
        return location
      } catch (error: any) {
        console.error('❌ 定位失败:', error)
        return null
      } finally {
        this.isLocating = false
      }
    },

    /**
     * 仅使用 GPS 定位
     */
    async getGPSLocationOnly(): Promise<LocationData | null> {
      this.isLocating = true
      try {
        const location = await getGPSLocation()
        this.locationInfo = location
        this.lastLocationUpdateTime = Date.now()
        return location
      } catch (error) {
        console.error('GPS 定位失败:', error)
        return null
      } finally {
        this.isLocating = false
      }
    },

    /**
     * 仅使用高德地图定位
     */
    async getAmapLocationOnly(): Promise<LocationData | null> {
      this.isLocating = true
      try {
        const location = await getAmapLocation()
        this.locationInfo = location
        this.lastLocationUpdateTime = Date.now()
        return location
      } catch (error) {
        console.error('高德地图定位失败:', error)
        return null
      } finally {
        this.isLocating = false
      }
    },

    /**
     * 仅使用 IP 定位
     */
    async getIPLocationOnly(): Promise<LocationData | null> {
      this.isLocating = true
      try {
        const location = await getIPLocation()
        this.locationInfo = location
        this.lastLocationUpdateTime = Date.now()
        return location
      } catch (error) {
        console.error('IP 定位失败:', error)
        return null
      } finally {
        this.isLocating = false
      }
    },

    /**
     * 获取实时天气数据
     */
    async getWeatherData(forceUpdate = false): Promise<WeatherData | null> {
      // 如果有缓存且不需要更新，直接返回
      if (this.weatherData && !forceUpdate && !this.needsWeatherUpdate) {
        return this.weatherData
      }

      // 先确保有定位信息
      if (!this.locationInfo) {
        await this.getLocationInfo()
      }

      if (!this.locationInfo) {
        console.error('❌ 缺少定位信息，无法获取天气')
        return null
      }

      this.isFetchingWeather = true
      try {
        const weather = await getFullWeatherData(
          this.locationInfo.latitude,
          this.locationInfo.longitude,
        )
        this.weatherData = weather
        this.lastWeatherUpdateTime = Date.now()
        console.log('✅ 天气数据获取成功:', weather)
        return weather
      } catch (error: any) {
        console.error('❌ 天气数据获取失败:', error)
        return null
      } finally {
        this.isFetchingWeather = false
      }
    },

    /**
     * 获取当前天气（只有当前，没有预报）
     */
    async getCurrentWeatherOnly(forceUpdate = false): Promise<WeatherData | null> {
      if (!this.locationInfo) {
        await this.getLocationInfo()
      }

      if (!this.locationInfo) {
        return null
      }

      this.isFetchingWeather = true
      try {
        const weather = await getCurrentWeather(
          this.locationInfo.latitude,
          this.locationInfo.longitude,
        )
        this.weatherData = weather
        this.lastWeatherUpdateTime = Date.now()
        return weather
      } catch (error) {
        console.error('❌ 天气获取失败:', error)
        return null
      } finally {
        this.isFetchingWeather = false
      }
    },

    /**
     * 获取地址信息（兼容旧接口）
     */
    getAddressInfo() {
      return new Promise((resolve, reject) => {
        if (this.addressInfo) return resolve(this.addressInfo)
        // 获取ip地址
        fetch('https://api.ipify.org?format=json')
          .then((response) => response.json())
          .then((data) => {
            const ip = data.ip
            //通过ip地址获取所在地
            fetch(`https://api.vore.top/api/IPdata?ip=${ip}`).then((res) =>
              res.json().then((info) => {
                this.addressInfo = info
                resolve(this.addressInfo)
              }),
            )
          })
          .catch((error) => {
            console.log(error)
            this.addressInfo = null
            reject(this.addressInfo)
          })
      })
    },

    /**
     * 重置所有信息（清除缓存）
     */
    resetAll() {
      this.locationInfo = null
      this.weatherData = null
      this.addressInfo = null
      this.lastLocationUpdateTime = null
      this.lastWeatherUpdateTime = null
      console.log('🗑️ 已清除所有缓存')
    },

    /**
     * 仅重置定位信息
     */
    resetLocation() {
      this.locationInfo = null
      this.addressInfo = null
      this.lastLocationUpdateTime = null
      console.log('🗑️ 已清除定位缓存')
    },

    /**
     * 重置天气信息
     */
    resetWeather() {
      this.weatherData = null
      this.lastWeatherUpdateTime = null
      console.log('🗑️ 已清除天气缓存')
    },
  },
  persist: {
    storage: {
      getItem(key): string {
        return localStorage.getItem(key)
      },
      setItem(key, value): void {
        localStorage.setItem(key, value)
      },
    },
  },
})

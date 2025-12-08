import { defineStore } from 'pinia'
import { getLocation, getAmapLocation, getIPLocation, getCityLocation, clearLocationCache, type LocationData } from '@/utils/location'
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
     * 获取定位信息（智能降级：高德 → 默认中山）
     */
    async getLocationInfo(forceUpdate = false): Promise<LocationData | null> {
      // 如果有缓存且不强制更新，直接返回
      if (this.locationInfo && !forceUpdate) return this.locationInfo

      this.isLocating = true
      try {
        const location = await getLocation()
        this.locationInfo = location
        this.lastLocationUpdateTime = Date.now()
        return location
      } catch (error: any) {
        return null
      } finally {
        this.isLocating = false
      }
    },

    /**
     * 仅使用 GPS 定位（已禁用，GPS 功能已移除）
     */
    /* 已删除 GPS 定位功能
    async getGPSLocationOnly(): Promise<LocationData | null> {
      this.isLocating = true
      try {
        const location = await getGPSLocation()
        this.locationInfo = location
        this.lastLocationUpdateTime = Date.now()
        return location
      } catch (error: any) {
        console.error('GPS定位失败:', error)
        return null
      } finally {
        this.isLocating = false
      }
    },
    */

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
        return null
      } finally {
        this.isLocating = false
      }
    },

    /**
     * 手动设置城市位置（通过城市名称）
     * @param cityName 城市名称（如："北京"、"上海"、"广州"）
     */
    async setLocationByCity(cityName: string): Promise<LocationData | null> {
      if (!cityName || cityName.trim() === '') {
        throw new Error('城市名称不能为空')
      }

      this.isLocating = true
      try {
        const location = await getCityLocation(cityName)
        this.locationInfo = location
        this.lastLocationUpdateTime = Date.now()
        return location
      } catch (error: any) {
        throw error
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
        return weather
      } catch (error: any) {
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
      // 清除 localStorage 中的定位缓存
      clearLocationCache()
    },

    /**
     * 仅重置定位信息
     */
    resetLocation() {
      this.locationInfo = null
      this.addressInfo = null
      this.lastLocationUpdateTime = null
      // 清除 localStorage 中的定位缓存
      clearLocationCache()
    },

    /**
     * 重置天气信息
     */
    resetWeather() {
      this.weatherData = null
      this.lastWeatherUpdateTime = null
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

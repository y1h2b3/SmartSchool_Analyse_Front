import { defineStore } from 'pinia'
import { getLocation, type LocationData } from '@/utils/location'

export const useWeatherStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'weatherStore',
  // state: 返回对象的函数
  state: () => ({
    locationInfo: null as LocationData | null,
    addressInfo: null,
    isLocating: false,
  }),
  actions: {
    /**
     * 获取定位信息（混合方案：GPS 优先，失败降级到 IP 定位）
     */
    async getLocationInfo(): Promise<LocationData | null> {
      if (this.locationInfo) return this.locationInfo

      this.isLocating = true
      try {
        const location = await getLocation()
        this.locationInfo = location
        return location
      } catch (error) {
        console.error('定位失败:', error)
        return null
      } finally {
        this.isLocating = false
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
     * 重置定位信息（清除缓存）
     */
    resetLocation() {
      this.locationInfo = null
      this.addressInfo = null
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

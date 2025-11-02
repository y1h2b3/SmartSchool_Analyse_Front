import { defineStore } from 'pinia'

export const useWeatherStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'weatherStore',
  // state: 返回对象的函数
  state: () => ({
    weatherInfo: null,
    addressInfo: null,
  }),
  actions: {
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

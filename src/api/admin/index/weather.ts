import { ref } from 'vue'
/**
 * 平均每小时获取一次数据
 */

// 获取当前天气信息
export function getAddress() {
  return ''
}
const weatherInfo = ref({})

// 获取天气信息
const getWeather = () => {
  // 获取ip地址
  fetch('https://api.ipify.org?format=json')
    .then((response) => response.json())
    .then((data) => {
      const ip = data.ip
      //通过ip地址获取所在地
      fetch(`https://api.vore.top/api/IPdata?ip=${ip}`).then((res) =>
        res.json().then((info) => {
          weatherInfo.value = info
        }),
      )
    })
    .catch((error) => {
      console.error(error)
      weatherInfo.value = null
    })
}
export function getWeatherData() {
  getWeather()
  console.log(weatherInfo.value)
}

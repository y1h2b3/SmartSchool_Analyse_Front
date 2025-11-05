/**
 * 天气 API 模块
 * 集成 OpenWeatherMap API 获取实时天气数据
 */

// OpenWeatherMap 配置
const OWM_CONFIG = {
  key: 'f2767ce16ef8bac65d38f9c60de0f3d5',
  baseUrl: 'https://api.openweathermap.org/data/2.5',
  baseUrlProxy: '/openweathermap/data/2.5', // 使用代理避免跨域
}

/**
 * 天气数据接口
 */
export interface WeatherData {
  // 基本信息
  location: string // 位置名称
  latitude: number
  longitude: number
  timezone: string

  // 当前天气
  temp: number // 温度 (°C)
  feelsLike: number // 体感温度
  humidity: number // 湿度 (%)
  pressure: number // 气压 (hPa)
  windSpeed: number // 风速 (m/s)
  windDeg: number // 风向 (度)
  windGust?: number // 阵风速度 (m/s)
  visibility: number // 能见度 (m)
  cloudiness: number // 云量 (%)
  uvIndex?: number // 紫外线指数

  // 天气描述
  main: string // 主要天气（如：Clear、Clouds、Rain）
  description: string // 详细描述
  icon: string // 天气图标代码

  // 额外信息
  sunrise: number // 日出时间 (unix时间戳)
  sunset: number // 日落时间 (unix时间戳)
  rainVolume?: number // 降雨量 (mm)
  snowVolume?: number // 降雪量 (mm)

  // 预报数据
  forecast?: ForecastItem[]

  // 更新时间
  dt: number // 数据时间戳
  updateTime: string // 更新时间 (ISO 8601)
}

/**
 * 预报项接口
 */
export interface ForecastItem {
  dt: number // 时间戳
  temp: number
  feelsLike: number
  humidity: number
  pressure: number
  windSpeed: number
  main: string
  description: string
  icon: string
  rainProbability: number // 降雨概率 (0-1)
  rainVolume?: number
}

/**
 * 根据经纬度获取当前天气
 */
export async function getCurrentWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${OWM_CONFIG.baseUrlProxy}/weather?lat=${latitude}&lon=${longitude}&appid=${OWM_CONFIG.key}&units=metric&lang=zh_cn`,
    )

    if (!response.ok) {
      throw new Error(`天气 API 错误: ${response.status}`)
    }

    const data = await response.json()

    console.log('✓ 获取当前天气成功:', data)

    return {
      location: data.name || `${data.coord.lat.toFixed(2)},${data.coord.lon.toFixed(2)}`,
      latitude: data.coord.lat,
      longitude: data.coord.lon,
      timezone: data.timezone ? `UTC+${data.timezone / 3600}` : 'UTC+0',

      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDeg: data.wind.deg,
      windGust: data.wind.gust,
      visibility: data.visibility,
      cloudiness: data.clouds.all,

      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,

      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      rainVolume: data.rain?.['1h'] || 0,
      snowVolume: data.snow?.['1h'] || 0,

      dt: data.dt,
      updateTime: new Date(data.dt * 1000).toISOString(),
    }
  } catch (error) {
    console.error('✗ 获取天气失败:', error)
    throw error
  }
}

/**
 * 根据经纬度获取天气预报（5天）
 */
export async function getWeatherForecast(
  latitude: number,
  longitude: number,
): Promise<ForecastItem[]> {
  try {
    const response = await fetch(
      `${OWM_CONFIG.baseUrlProxy}/forecast?lat=${latitude}&lon=${longitude}&appid=${OWM_CONFIG.key}&units=metric&lang=zh_cn`,
    )

    if (!response.ok) {
      throw new Error(`天气预报 API 错误: ${response.status}`)
    }

    const data = await response.json()

    console.log('✓ 获取天气预报成功:', data)

    return data.list.map((item: any) => ({
      dt: item.dt,
      temp: item.main.temp,
      feelsLike: item.main.feels_like,
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      windSpeed: item.wind.speed,
      main: item.weather[0].main,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      rainProbability: item.pop, // 降雨概率
      rainVolume: item.rain?.['3h'] || 0,
    }))
  } catch (error) {
    console.error('✗ 获取天气预报失败:', error)
    throw error
  }
}

/**
 * 获取完整天气数据（当前 + 预报）
 */
export async function getFullWeatherData(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  try {
    const current = await getCurrentWeather(latitude, longitude)

    try {
      const forecast = await getWeatherForecast(latitude, longitude)
      current.forecast = forecast
    } catch (error) {
      console.warn('获取预报失败，仅返回当前天气:', error)
    }

    return current
  } catch (error) {
    console.error('✗ 获取完整天气数据失败:', error)
    throw error
  }
}

/**
 * 天气图标映射（OpenWeatherMap 图标 -> 本地描述）
 */
export function getWeatherDescription(
  iconCode: string,
): {
  icon: string
  label: string
  color: string
} {
  const descriptions: Record<
    string,
    { icon: string; label: string; color: string }
  > = {
    // 晴天
    '01d': { icon: '☀️', label: '晴', color: '#FFD700' },
    '01n': { icon: '🌙', label: '晴', color: '#191970' },

    // 少云
    '02d': { icon: '⛅', label: '少云', color: '#B0C4DE' },
    '02n': { icon: '🌤️', label: '少云', color: '#2F4F7F' },

    // 多云
    '03d': { icon: '☁️', label: '多云', color: '#A9A9A9' },
    '03n': { icon: '☁️', label: '多云', color: '#696969' },

    // 阴天
    '04d': { icon: '🌧️', label: '阴', color: '#808080' },
    '04n': { icon: '🌧️', label: '阴', color: '#505050' },

    // 小雨
    '09d': { icon: '🌦️', label: '小雨', color: '#4682B4' },
    '09n': { icon: '🌦️', label: '小雨', color: '#36648B' },

    // 中雨
    '10d': { icon: '🌧️', label: '中雨', color: '#1E90FF' },
    '10n': { icon: '🌧️', label: '中雨', color: '#0047AB' },

    // 雷暴
    '11d': { icon: '⛈️', label: '雷暴', color: '#FF6347' },
    '11n': { icon: '⛈️', label: '雷暴', color: '#DC143C' },

    // 雪
    '13d': { icon: '❄️', label: '雪', color: '#87CEEB' },
    '13n': { icon: '❄️', label: '雪', color: '#4A90E2' },

    // 雾
    '50d': { icon: '🌫️', label: '雾', color: '#D3D3D3' },
    '50n': { icon: '🌫️', label: '雾', color: '#808080' },
  }

  return (
    descriptions[iconCode] || { icon: '❓', label: '未知', color: '#999999' }
  )
}

/**
 * 格式化温度显示
 */
export function formatTemperature(temp: number, precision: number = 1): string {
  return temp.toFixed(precision) + '°C'
}

/**
 * 格式化风速
 */
export function formatWindSpeed(speed: number): string {
  return speed.toFixed(1) + ' m/s'
}

/**
 * 格式化时间
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 格式化日期
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  })
}

export default {
  getCurrentWeather,
  getWeatherForecast,
  getFullWeatherData,
  getWeatherDescription,
  formatTemperature,
  formatWindSpeed,
  formatTime,
  formatDate,
}

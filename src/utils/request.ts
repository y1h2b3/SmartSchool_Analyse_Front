import axios from 'axios'
import { useUserStore } from '@/store/modules/user.ts'
import { ElMessage } from 'element-plus'
// import { useRouter } from 'vue-router'
import router from '@/router'

const userStore = useUserStore()
// const router = useRouter()

//创建一个新的axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

request.interceptors.request.use(
  (request) => {
    const token = userStore.token
    if (token) {
      request.headers.Authorization = token
    }
    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)
request.interceptors.response.use(
  (response) => {
    const code = response.data.code
    if (code === 200) {
      if (response.config.url.includes('/login')) {
        ElMessage.success('登录成功')
      }
      return response.data.data
    } else {
      const msg = response.data.message
      ElMessage.error(msg)
      // userStore.logout()
      return Promise.reject(new Error(msg))
    }
  },
  async (error) => {
    if (error.response.status === 401) {
      //令牌过期了
      ElMessage.warning('登录超时')
      await userStore.logout()
      router.push('/login')
      return Promise.reject(error)
    }
    ElMessage.error(error.message)
    return Promise.reject(error)
  },
)
export default request

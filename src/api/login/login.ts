import request from '@/utils/request.ts'

/**
 * 管理员登录
 */
export function adminLogin(name, pwd) {
  return request({
    url: '/Login/Admin',
    method: 'get',
    params: {
      name,
      pwd,
    },
  })
}
/**
 * 普通用户登录
 */
export function userLogin(phone, pwd) {
  return request({
    url: '/Login/User',
    method: 'get',
    params: {
      phone,
      pwd,
    },
  })
}

/**
 * 获取验证码
 */
export function getSMS(phone) {
  return request({
    url: '/getSMS',
    method: 'get',
    params: {
      phone,
    },
  })
}

/**
 * 校验验证码
 */
export function checkSMS(phone, code) {
  return request({
    url: '/checkSMS',
    method: 'get',
    params: {
      phone,
      code,
    },
  })
}

/**
 * 校验验证码
 */
export function Logout() {
  return request({
    url: '/Logout',
    method: 'get',
  })
}

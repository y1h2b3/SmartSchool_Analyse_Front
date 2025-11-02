// http://localhost:8081/pay/alipay?dona_drugId=O123&dona_money=32.21&dona_sum=3&dona_userId=S1231312

import request from '@/utils/request.ts'

/**
 * 获取所有药品信息
 */
export function payZFB(dona_drugId, dona_money, dona_sum, dona_userId) {
  return request({
    url: '/pay/alipay',
    method: 'get',
    params: {
      dona_drugId,
      dona_money,
      dona_sum,
      dona_userId,
    },
  })
}

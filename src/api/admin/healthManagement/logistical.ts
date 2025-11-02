import request from '@/utils/request.ts'

/**
 * 获取分页数据
 */
export function getLogisticalHealthPage(current, size, id, name) {
  return request({
    url: '/LogisticsUserHealth',
    method: 'get',
    params: {
      current,
      size,
      orders: 'measure_time',
      isAsc: false,
      id,
      name,
    },
  })
}

/**
 * 删除数据
 */
export function deleteLogisticalHealthById(userId) {
  return request({
    url: `/userHealth/${userId}`,
    method: 'delete',
  })
}

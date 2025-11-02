import request from '@/utils/request.ts'

/**
 * 获取全部数据
 */
export function getAllLogsData(current, size) {
  return request({
    url: '/logsData',
    method: 'get',
    params: {
      current,
      size,
    },
  })
}
/**
 * 获取分页查询的数据
 */
export function getLogsData(current, size, account, type, result, startTime, endTime) {
  return request({
    url: '/searchLogsData',
    method: 'get',
    params: {
      current,
      size,
      orders: 'create_time',
      isAsc: true,
      type,
      result,
      account,
      startTime,
      endTime,
    },
  })
}

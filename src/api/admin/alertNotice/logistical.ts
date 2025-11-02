import request from '@/utils/request.ts'

export function getAllLogisticalHealthWarningNotifications() {
  return request({
    url: '/logisticsHealthWarningNotifications2',
    method: 'get',
  })
}

export function getPageLogisticalHealthWarningNotifications(
  current,
  size,
  id,
  level,
  startTime,
  endTime,
) {
  return request({
    url: '/logisticsSearchHealthWarningNotifications',
    method: 'get',
    params: {
      current,
      size,
      id,
      level,
      startTime,
      endTime,
    },
  })
}

export function deleteLogisticalHealthWarningNotifications(id) {
  return request({
    url: `/HealthWarningNotifications/${id}`,
    method: 'delete',
  })
}

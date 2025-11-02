import request from '@/utils/request.ts'

export function getAllStudentHealthWarningNotifications() {
  return request({
    url: '/studentHealthWarningNotifications2',
    method: 'get',
  })
}

export function getPageStudentHealthWarningNotifications(
  current,
  size,
  id,
  level,
  startTime,
  endTime,
) {
  return request({
    url: '/StudentSearchHealthWarningNotifications',
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

export function deleteStudentHealthWarningNotifications(id) {
  return request({
    url: `/HealthWarningNotifications/${id}`,
    method: 'delete',
  })
}

export function getWarnById(id) {
  return request({
    url: `/IdHealthWarningNotifications/${id}`,
    method: 'get',
  })
}

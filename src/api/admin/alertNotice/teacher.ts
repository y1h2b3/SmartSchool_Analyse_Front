import request from '@/utils/request.ts'

export function getAllTeacherHealthWarningNotifications() {
  return request({
    url: '/teacherHealthWarningNotifications2',
    method: 'get',
  })
}

export function getPageTeacherSearchHealthWarningNotifications(
  current,
  size,
  id,
  level,
  startTime,
  endTime,
) {
  return request({
    url: '/teacherHealthWarningNotifications',
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

export function deleteTeacherHealthWarningNotifications(id) {
  return request({
    url: `/HealthWarningNotifications/${id}`,
    method: 'delete',
  })
}

import request from '@/utils/request.ts'

export function getStudentToTal() {
  return request({
    url: '/getStudentTotal',
    method: 'get',
  })
}

export function getParentToTal() {
  return request({
    url: '/getParentToTal',
    method: 'get',
  })
}

export function getTeacherToTal() {
  return request({
    url: '/getTeacherToTal',
    method: 'get',
  })
}

export function getLogisticsToTal() {
  return request({
    url: '/getLogisticsToTal',
    method: 'get',
  })
}
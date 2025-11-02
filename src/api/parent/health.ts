import request from '@/utils/request.ts'

export function fianllStepsTtop(time) {
  return request({
    url: '/FianllStepsTtop',
    method: 'get',
    params: {
      time,
    },
  })
}

/**
 * 根据关键字学生查询用户健康
 */
export function searchStudentUserHealthType(current, size, id) {
  return request({
    url: '/StudentUserHealth',
    method: 'get',
    params: {
      current,
      size,
      id,
    },
  })
}

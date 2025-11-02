import request from '@/utils/request.ts'

/**
 * 获取分页数据
 */
export function getStudentHealthPage(current, size, id, name) {
  return request({
    url: '/StudentUserHealth',
    method: 'get',
    params: {
      current,
      size,
      id,
      name,
    },
  })
}

/**
 * 删除数据
 */
export function deleteStudentHealthById(userId) {
  return request({
    url: `/userHealth/${userId}`,
    method: 'delete',
  })
}

import request from '@/utils/request.ts'

export function findAllParent() {
  return request({
    url: '/parent2',
    method: 'get',
  })
}

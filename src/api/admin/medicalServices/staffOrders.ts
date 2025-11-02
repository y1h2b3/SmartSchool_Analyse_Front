import request from '@/utils/request.ts'

export function getAllStaffOrders(current, size) {
  return request({
    url: '/staffOrders',
    method: 'get',
    params: {
      current,
      size,
    },
  })
}

export function getSearchStaffOrders(current, size, id, name, type) {
  return request({
    url: '/searchStaffOrders',
    method: 'get',
    params: {
      current,
      size,
      id,
      name,
      type,
    },
  })
}

export function deleteStaffOrders(id) {
  return request({
    url: `/removeStaffOrders/${id}`,
    method: 'delete',
  })
}

export function updateStaffOrders(data) {
  return request({
    url: '/updateStaffOrders',
    method: 'put',
    data,
  })
}

import request from '@/utils/request.ts'

export function getAllOrders(size) {
  return request({
    url: '/searchOrders',
    method: 'get',
    params: {
      current: 1,
      size,
    },
  })
}

export function getSearchOrders(current, size, oid, uid, type) {
  return request({
    url: '/searchOrders',
    method: 'get',
    params: {
      current,
      size,
      oid,
      uid,
      type,
    },
  })
}

export function addOrders(data) {
  return request({
    url: '/orders',
    method: 'post',
    data,
  })
}

export function updateOrders(data) {
  return request({
    url: '/orders',
    method: 'put',
    data,
  })
}

export function deleteOrders(oid) {
  return request({
    url: `/orders/${oid}`,
    method: 'delete',
  })
}

import request from '@/utils/request.ts'

export function addOrders(data) {
  return request({
    url: '/orders',
    method: 'post',
    data,
  })
}

export function searchOrders(current, size, oid, uid, type, startTime, endTime) {
  return request({
    url: '/searchOrders',
    method: 'get',
    params: {
      current,
      size,
      oid,
      uid,
      type,
      startTime,
      endTime,
    },
  })
}

export function searchStaffOrders(current, size, id, name, type) {
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

export function searchStaffType(isOnline) {
  return request({
    url: '/searchStaff',
    method: 'get',
    params: {
      isOnline,
    },
  })
}

export function saveStaffOrders(data) {
  return request({
    url: '/saveStaffOrders',
    method: 'post',
    data,
  })
}

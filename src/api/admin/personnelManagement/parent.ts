import request from '@/utils/request.ts'

export function getParentID(id) {
  return request({
    url: `/searchParentID?id=${id}`,
  })
}

export function getAllParentInfo() {
  return request({
    url: '/parent2',
    method: 'get',
  })
}

export function getPageParentInfo(currenPage, pageSize, clazz, PName, SName) {
  return request({
    url: '/searchParent',
    method: 'get',
    params: {
      current: currenPage,
      size: pageSize,
      clazz,
      PName,
      SName,
    },
  })
}

export function updateParentInfo(data) {
  return request({
    url: '/Parent',
    method: 'put',
    data,
  })
}

export function deleteParentInfo(pid) {
  return request({
    url: `/Parent/${pid}`,
    method: 'delete',
  })
}

export function addParentInfo(data) {
  return request({
    url: '/Parent',
    method: 'post',
    headers: { 'content-type': 'application/json' },
    data,
  })
}

import request from '@/utils/request.ts'

/**
 * 获取所有药品信息
 */
export function getAllDrugsInfo() {
  return request({
    url: '/drugs',
    method: 'get',
    params: {
      current: 1,
      size: 999999999,
    },
  })
}

/**
 * 获取分页药品信息
 */
export function getPageSearchDrugs(current, size, id, name, status) {
  return request({
    url: '/searchDrugs',
    method: 'get',
    params: {
      current,
      size,
      id,
      name,
      status,
    },
  })
}

/**
 * 修改药品信息
 */
export function updateDrugsInfo(data) {
  return request({
    url: '/drugs',
    method: 'put',
    data: data,
  })
}

/**
 * 删除药品信息
 */
export function deleteDrugsInfo(id) {
  return request({
    url: `/drugs/${id}`,
    method: 'delete',
  })
}

/**
 * 新增药品信息
 */
export function addDrugsInfo(data) {
  return request({
    url: '/drugs',
    method: 'post',
    headers: { 'content-type': 'application/json' },
    data: data,
  })
}

export function getTypeID(name) {
  return request({
    url: '/getTypeID',
    method: 'get',
    params: {
      name,
    },
  })
}

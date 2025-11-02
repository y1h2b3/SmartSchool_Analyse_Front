import request from '@/utils/request.ts'

/**
 * 获取所有的教师信息
 * @returns 教师信息
 */
export function getAllLogisticalInfo() {
  return request({
    url: '/logistics2',
    method: 'get',
  })
}

/**
 * 获取分页中的教师信息
 * @returns 教师信息
 */
export function getPageLogisticalInfo(currenPage, pageSize, post, id, name) {
  return request({
    url: '/searchLogistics',
    method: 'get',
    params: {
      current: currenPage,
      size: pageSize,
      orders: 'logistics_id',
      isAsc: true,
      post,
      id,
      name,
    },
  })
}

/**
 * 修改后勤信息
 * @returns 是否成功
 */
export function updateLogisticalInfo(data) {
  return request({
    url: '/logistics',
    method: 'put',
    data: data,
  })
}

/**
 * 删除教师信息
 * @returns 是否成功
 */
export function deleteLogisticalInfo(logisticalId) {
  return request({
    url: `/logistics/${logisticalId}`,
    method: 'delete',
  })
}

/**
 * 新增教师信息
 */
export function addLogisticalInfo(logistical) {
  return request({
    url: '/logistics',
    method: 'post',
    headers: { 'content-type': 'application/json' },
    data: logistical,
  })
}

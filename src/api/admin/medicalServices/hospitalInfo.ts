import request from '@/utils/request.ts'

/**
 * 获取所有校医人员信息
 */
export function getAllStaffInfo() {
  return request({
    url: '/staff',
    method: 'get',
  })
}

/**
 * 获取分页校医人员信息
 */
export function getPageSearchStaff(current, size, key, value) {
  return request({
    url: '/searchStaff',
    method: 'get',
    params: {
      current,
      size,
      key,
      value,
    },
  })
}

/**
 * 修改校医人员信息
 * @returns 是否成功
 */
export function updateStaffInfo(data) {
  return request({
    url: '/staff',
    method: 'put',
    data: data,
  })
}

/**
 * 删除校医人员信息
 */
export function deleteStaffInfo(id) {
  return request({
    url: `/staff/${id}`,
    method: 'delete',
  })
}

/**
 * 新增校医人员信息
 */
export function addStaffInfo(data) {
  return request({
    url: '/staff',
    method: 'post',
    headers: { 'content-type': 'application/json' },
    data: data,
  })
}

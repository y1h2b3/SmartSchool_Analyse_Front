import request from '@/utils/request.ts'

/**
 * 获取所有的教师信息
 * @returns 教师信息
 */
export function getAllTeacherInfo() {
  return request({
    url: '/teacher2',
    method: 'get',
  })
}

/**
 * 获取分页中的教师信息
 * @returns 教师信息
 */
export function getPageTeacherInfo(currenPage, pageSize, post, id, name) {
  return request({
    url: '/searchTeacherType',
    method: 'get',
    params: {
      current: currenPage,
      size: pageSize,
      orders: 'teacher_id',
      isAsc: true,
      post,
      id,
      name,
    },
  })
}

/**
 * 修改教师信息
 * @returns 是否成功
 */
export function updateTeacherInfo(data) {
  return request({
    url: '/teacher',
    method: 'put',
    data: data,
  })
}

/**
 * 删除教师信息
 * @returns 是否成功
 */
export function deleteTeacherInfo(teacherId) {
  return request({
    url: `/teacher/${teacherId}`,
    method: 'delete',
  })
}

/**
 * 根据教师ID查询教师姓名
 */
export function getTeacherID(id) {
  return request({
    url: `/searchTeacherID?id=${id}`,
  })
}

/**
 * 新增教师信息
 */
export function addTeacherInfo(teacher) {
  return request({
    url: '/teacher',
    method: 'post',
    headers: { 'content-type': 'application/json' },
    data: teacher,
  })
}

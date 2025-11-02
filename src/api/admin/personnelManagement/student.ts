import request from '@/utils/request.ts'

/**
 * 获取所有的学生信息
 * @returns 学生信息
 */
export function getAllStudentInfo() {
  return request({
    url: '/student2',
    method: 'get',
  })
}

/**
 * 获取分页中的学生信息
 * @returns 学生信息
 */
export function getPageStudentInfo(currenPage, pageSize, clazz, id, name) {
  return request({
    url: '/searchStudent',
    method: 'get',
    params: {
      current: currenPage,
      size: pageSize,
      clazz,
      id,
      name,
    },
  })
}

/**
 * 修改学生信息
 * @returns 是否成功
 */
export function updateStudentInfo(data) {
  return request({
    url: '/student',
    method: 'put',
    data: data,
  })
}

/**
 * 删除学生信息
 * @returns 是否成功
 */
export function deleteStudentInfo(studnetId) {
  return request({
    url: `/student/${studnetId}`,
    method: 'delete',
  })
}
/**
 * 新增学生信息
 */
export function addStudentInfo(student) {
  return request({
    url: '/student',
    method: 'post',
    headers: { 'content-type': 'application/json' },
    data: student,
  })
}

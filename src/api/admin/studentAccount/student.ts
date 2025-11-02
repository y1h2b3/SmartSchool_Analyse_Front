import axios from 'axios'

/**
 * 获取分页中的学生信息
 * @returns 学生信息
 */
export function getStudentInfo() {
  return axios.request({
    url: '/api/student',
    method: 'get',
    data: {
      current: 1,
      size: 10,
      isAsc: true,
      orders: 'studentId',
    },
  })
}

/**
 * 修改学生信息
 * @param data 要修改的学生数据
 */
export function updateStudentInfo(data) {
  return axios.request({
    url: '/api/student',
    method: 'put',
    data,
  })
}

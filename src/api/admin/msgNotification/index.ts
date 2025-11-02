import request from '@/utils/request.ts'

/**
 * 获取所有消息通知
 */
export function getNotifications(current, size, user) {
  return request({
    url: '/notifications',
    method: 'get',
    params: {
      current,
      size,
      orders: 'create_time',
      isAsc: true,
      user,
    },
  })
}
/**
 * 根据id删除消息通知
 */
export function deleteNotificationsById(id) {
  return request({
    url: `/notifications/${id}`,
    method: 'delete',
  })
}

/**
 * 发送消息通知
 */
export function addNotifications(data) {
  return request({
    url: '/notifications',
    method: 'post',
    data,
  })
}

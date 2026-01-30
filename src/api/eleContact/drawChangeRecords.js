import request from '../../utils/request'

// 查看订单图档历史记录
export function getOrderBomDrawHisPage(query) {
  return request.post(`/order/detail/getOrderBomDrawHisPage`,query)
}

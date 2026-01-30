import request from '../../utils/request'

// 分页查询工件成本
export function orderWorkpieceCost(query) {
  return request.post(`/order/bom/orderWorkpieceCost`,query)
}

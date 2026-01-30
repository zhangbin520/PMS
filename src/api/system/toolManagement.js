import request from '../../utils/request'

// 分页查询刀具成本
export function getOrderToolCostPage(query) {
  return request.post(`/order/cost/getOrderToolCostPage`,query)
}

// 查询刀具成本list
export function getOrderToolCostList(query) {
  return request.post(`/order/cost/getOrderToolCostList`,query)
}

// 新增修改刀具成本
export function saveOrUpdateOrderToolCost(query) {
  return request.post(`/order/cost/saveOrUpdateOrderToolCost`,query)
}

// 批量删除刀具成本
export function delOrderToolCost(query) {
  return request.post(`/order/cost/delOrderToolCost`,query)
}

// 批量删除刀具成本
export function exportOrderToolCost(query) {
  return request.post(`/order/cost/exportOrderToolCost`,query)
}

// 刀具成本明细
export function getOrderToolCostDetailList(query) {
  return request.post(`/order/cost/getOrderToolCostDetailList`,query)
}

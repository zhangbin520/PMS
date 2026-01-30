import request from '../../utils/request'

// 分页查询工时成本
export function listTimeCost(query) {
  return request.post(`/order/bom/getOrderBomPage`,query)
}

// 分页查询工件
export function listWorkpiece(query) {
  return request.post(`/order/detail/getOrderBomDetailPage`,query)
}

// 分页查询工时
export function listWorktime(query) {
  return request.post(`/order/process/getOrderBomProcessPage`,query)
}

// 导出工时成本
export function exportManHourCost(query) {
  return request.post(`/order/bom/exportManHourCost`,query)
}

// 计划成本与实际成本对比
export function costComparison(query) {
  return request.post(`/order/bom/costComparison`,query)
}

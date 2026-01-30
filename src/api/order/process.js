import request from '../../utils/request'

// 保存工时工艺
export function saveEquipmentCrafts(query) {
  return request.post(`/order/process/saveOrUpdateOrderBomProcess`,query)
}

// 分页查询工艺
export function listEquipmentCrafts(query) {
  return request.post(`/process/manHour/getProcessManHourPage`,query)
}

// 分页查询成本
export function queryCost(query) {
  return request.post(`/order/detail/getOrderBomDetail`,query)
}

// 位置交换
export function dragSort(query) {
  return request.post(`/order/process/dragSort`,query)
}

// 删除工序
export function delOrderBomProcess(query) {
  return request.post(`/order/process/delOrderBomProcess`,query)
}


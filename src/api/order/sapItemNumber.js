import request from '../../utils/request'

// 分页查看订单sap配置
export function getOrderBomSapItemPage(query) {
  return request.post(`/order/sap/getOrderBomSapItemPage`,query)
}

// 分页查看订单sap配置
export function exportSapItemNumber(query) {
  return request.post(`/order/sap/export`,query)
}

// 分页查看订单sap配置
export function delBatchOrderBomSapItem(query) {
  return request.post(`/order/sap/delBatchOrderBomSapItem`,query)
}

// 新增修改订单sap配置
export function saveOrUpdateOrderBomSapItem(query) {
  return request.post(`/order/sap/saveOrUpdateOrderBomSapItem`,query)
}

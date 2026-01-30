import request from '../../utils/request'

// 分页查询订单预备出货列表
export function getOrderBomShipmentPage(query) {
  return request.post(`/order/shipment/getOrderBomShipmentPage`,query)
}

// 分页查询订单出货列表
export function getShipmentPage(query) {
  return request.post(`/order/shipment/getShipmentPage`,query)
}

// 保存
export function saveShipment(query) {
  return request.post(`/order/shipment/saveShipment`,query)
}

// 修改出货数量
export function updateShipmentQuantity(query) {
  return request.post(`/order/shipment/updateShipmentQuantity`,query)
}

// 编辑
export function shipmentEdit(query) {
  return request.post(`/order/shipment/edit`,query)
}

// 取消
export function shipmentCancel(query) {
  return request.post(`/order/shipment/cancel`,query)
}

//定账
export function bookEntry(query) {
  return request.post(`/order/shipment/bookEntry`,query)
}

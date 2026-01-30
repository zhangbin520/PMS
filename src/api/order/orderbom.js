import request from '../../utils/request'
import updownloadrequest from '@/utils/updownloadrequest'

// 分页获取订单BOM
export function listOrderBom(query) {
  return request.post(`/order/bom/getOrderBomPage`,query)
}

// 查询订单BOM详情
export function getOrderBom(query) {
  return request.post(`/order/bom/getOrderBom`,query)
}

// 新增订单BOM
export function addOrderBom(query) {
  return request.post(`/order/bom/saveOrUpdateOrderBom`,query)
}

// 修改订单BOM
export function updateOrderBom(query) {
  return request.post(`/order/bom/saveOrUpdateOrderBom`,query)
}

// 删除订单BOM
export function deleteOrderBom(query) {
  return request.post(`/order/bom/delOrderBom`,query)
}

// 翻单
export function copyOrderBom(query) {
  return request.post(`/order/bom/copyOrderBom`,query)
}

// 产能预估
export function estimateCapacity(query) {
  return request.post(`/order/bom/copyOrderBom`,query)
}

// 分页获取订单BOM明细
export function listBomDetail(query) {
  return request.post(`/order/detail/getOrderBomDetailPage`,query)
}

// 获取订单BOM明细详情
export function getBomDetail(query) {
  return request.post(`/order/detail/getOrderBomDetail`,query)
}

// 新增订单BOM明细
export function addBomDetail(query) {
  return request.post(`/order/detail/saveOrUpdateOrderBomDetail`,query)
}

// 编辑订单BOM明细
export function updateBomDetail(query) {
  return request.post(`/order/detail/saveOrUpdateOrderBomDetail`,query)
}

// 批量转生产单
export function turnManyProduction(query) {
  return request.post(`/order/detail/batchTransferToProductionOrder`,query)
}

// 删除BOM明细
export function deleteBomDetail(query) {
  return request.post(`/order/detail/delCancelOrderBomDetail`,query)
}

// 比对客户订单号是否存在
export function checkCustomerOrderNo(query) {
  return request.post(`/order/bom/checkCustomerOrderNo`,query)
}

// BOM导入订单
export function importOrderBom(data) {
  return request.post(`/order/bom/importOrderBomAndDetail`,data)
}

// BOM订单下载模板
export function importTemplate() {
  return request.post(`/order/bom/importTemplate`)
}

// BOM明细导入
export function importOrderBomDetail(data) {
  return request.post(`/order/detail/importOrderBomDetail`,data)
}

// BOM明细下载模板
export function importTemplateB() {
  return request.post(`/order/detail/importTemplate`)
}

// 查看工件图档
export function getDrawingFile(data) {
  return request.post(`/order/detail/getDrawingFile`,data)
}

// 查看公共图档
export function getPublicDrawingFile(data) {
  return request.post(`/order/detail/getPublicDrawingFile`,data)
}

// 删除图档
export function delDrawingFile(data) {
  return request.post(`/order/detail/delDrawingFile`,data)
}

// 导出订单bom
export function exportBom(data) {
  return request.post(`/order/bom/exportBom`,data)
}

// 导出订单bom明细
export function exportBomDetail(data) {
  return request.post(`/order/detail/exportBomDetail`,data)
}

// 检查派工单是否已完结
export function checkDispatchOrderIsOver(data) {
  return request.post(`/order/bom/checkDispatchOrderIsOver`,data)
}

// 修改订单完结状态
export function editOrderState(data) {
  return request.post(`/order/bom/editOrderState`,data)
}

// 判断生产单是否存在图档
export function isDraw(data) {
  return request.post(`/order/detail/isDraw`,data)
}

// 客户图档上传
export function uploadFormFile(formData) {
  return updownloadrequest({
    method: 'POST',
    url: '/order/bom/uploadDrawingFile',   //填写自己的接口
    data: formData ,       //填写包装好的formData对象
    timeout: 80 * 1000,
  })
}

// 客户图档上传
export function uploadDrawingFile(formData) {
  return updownloadrequest({
    method: 'POST',
    url: '/order/detail/uploadDrawingFile',   //填写自己的接口
    data: formData ,       //填写包装好的formData对象
    timeout: 80 * 1000,
  })
}

// // 客户图档上传
// export function uploadFormFile(formData) {
//   return request({
//     method: 'POST',
//     url: '/order/bom/uploadDrawingFile',   //填写自己的接口
//     data: formData ,       //填写包装好的formData对象
//     timeout: 80 * 1000,
//   })
// }
//
// // 客户图档上传
// export function uploadDrawingFile(formData) {
//   return request({
//     method: 'POST',
//     url: '/order/detail/uploadDrawingFile',   //填写自己的接口
//     data: formData ,       //填写包装好的formData对象
//     timeout: 80 * 1000,
//   })
// }

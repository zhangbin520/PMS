import request from '../../utils/request'

// 分页钢件半自动化页面
export function getBaseSteelPartsSemiAutomaticPage(query) {
  return request.post(`/base/semiAutomation/getBaseSteelPartsSemiAutomaticPage`,query)
}
// 根据（设备编号、工件类型）获取设备具体信息
export function getEqByDeviceNoAndType(data) {
  return request.post(`/base/semiAutomation/getEqByDeviceNoAndType`,data)
}
// 根据生产单号获取详情
export function getOrderBomDetailByOrderNo(data) {
  return request.post(`/base/semiAutomation/getOrderBomDetailByOrderNo`,data)
}
// 钢件完工
export function steelPartsFinish(query) {
  return request.post(`/base/semiAutomation/steelPartsFinish`,query)
}
// 钢件开始
export function steelPartsStart(query) {
  return request.post(`/base/semiAutomation/steelPartsStart`,query)
}
// 未完成报工
export function steelPartsIncompleteWorkReport(query) {
  return request.post(`/base/semiAutomation/steelPartsIncompleteWorkReport`,query)
}
// 恢复
export function steelPartsRecovery(query) {
  return request.post(`/base/semiAutomation/steelPartsRecovery`,query)
}
// 工单完成比例
export function steelPartsWorkOrderCompletionRatio(query) {
  return request.post(`/base/semiAutomation/steelPartsWorkOrderCompletionRatio`,query)
}

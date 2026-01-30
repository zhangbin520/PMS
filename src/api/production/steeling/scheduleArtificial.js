import request from "../../../utils/request";

// 分页查询钢件加工Aps排产
export function listScheduleArtificial(query) {
  return request.post(`/prod/artificial/getProdScheduleArtificialPage`,query)
}

// 钢件加工Aps排产
export function apsScheduleArtificial(data) {
  return request.post(`/prod/artificial/manualTransferToAps`,data)
}

// 派工查询
export function getDispatch(data) {
  return request.post(`/prod/artificial/dispatch`,data)
}

// 展示查询
export function process(data) {
  return request.post(`/prod/artificial/process`,data)
}

// 确认生产
export function confirmProduction(data) {
  return request.post(`/prod/artificial/confirmProduction`,data)
}

// 确认排期
export function confirmScheduling(data) {
  return request.post(`/prod/artificial/confirmScheduling`,data)
}

// 一键派工
export function oneButtonDispatch(data) {
  return request.post(`/prod/artificial/oneButtonDispatch`,data)
}

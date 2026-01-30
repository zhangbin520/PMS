import request from "../../../utils/request";

// 分页查询钢件加工Aps排产
export function listScheduleAps(query) {
  return request.post(`/prod/aps/getProdScheduleApsPage`,query)
}

// 钢件加工APS-转人工
export function apsTransferToLabor(data) {
  return request.post(`/prod/aps/apstransferToLabor`,data)
}

// 钢件加工APS-查看瓶颈工序
export function getBottleneckProcess(data) {
  return request.post(`/prod/aps/getBottleneckProcess`,data)
}

// 钢件加工APS-开始排产、确认当前排产
export function startScheduling(data) {
  return request.post(`/prod/aps/startScheduling`,data)
}

// APS-拖动排序
export function apsDragSort(data) {
  return request.post(`/prod/aps/apsDragSort`,data)
}

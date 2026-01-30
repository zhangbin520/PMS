import request from "../../../utils/request";

// 分页查询钢件加工待排产
export function listScheduleWait(query) {
  return request.post(`/prod/wait/getProdSpScheduleWaitPage`,query)
}

// 查询钢件加工待排产
export function getScheduleWait(data) {
  return request.post(`/prod/wait/getProdSpScheduleWait`,data)
}

// 钢件加工待排产-APS批量
export function apsScheduleWait(data) {
  return request.post(`/prod/wait/batchAps`,data)
}

// 钢件加工待排产-转人工
export function laborScheduleWait(data) {
  return request.post(`/prod/wait/transferToLabor`,data)
}

// 分页查询bom工艺(工时成本查看工时)
export function listProdProcess(data) {
  return request.post(`/order/process/getOrderBomProcessPage`,data)
}


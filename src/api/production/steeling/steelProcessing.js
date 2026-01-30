import request from '../../../utils/request'

// 分页查询钢件加工待排产
export function listSteelProcess(query) {
  return request.post(`/prod/wait/getProdSpScheduleWaitPage`,query)
}

// 分页查询钢件加工
export function listSteelProcessing(query) {
  return request.post(`/prod/steelparts/getProdScheduleSteelpartsPage`,query)
}

// 生产暂停
export function productionSuspension(data) {
  return request.post(`/prod/steelparts/productionSuspension`,data)
}

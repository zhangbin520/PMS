import request from '../../../utils/request'

// 分页查询电极加工待排产
export function listElectrodeAwait(query) {
  return request.post(`/prod/schedulingWait/getProdElSchedulingWaitPage`,query)
}

// 批量转APS排产
export function turnManyAps(query) {
  return request.post(`/prod/schedulingWait/elBatchAps`,query)
}

// 转人工待排产
export function elTransferToLabor(query) {
  return request.post(`/prod/schedulingWait/elTransferToLabor`,query)
}

// 分页查询电极Process工艺
export function listElectrode(query) {
  return request.post(`/cam/electrodeProcess/getCamElectrodeProcessPage`,query)
}

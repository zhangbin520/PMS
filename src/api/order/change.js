import request from '../../utils/request'
import updownloadrequest from '@/utils/updownloadrequest'

// 分页查询变更管理
export function listChangeBom(query) {
  return request.post(`/order/detail/getOrderBomDetailVoPage`,query)
}

// 分页查询加工履历
export function listExperence(query) {
  return request.post(`/process/hisDetail/getProcessHisDetailList`,query)
}

// 恢复加工
export function processRecovery(query) {
  return request.post(`/order/detail/batchResumeProcessing`,query)
}

// 批量恢复
 
export function batchRecovery(query) {
  return request.post(`/order/detail/batchRecovery`,query)
}
// 取消工单
export function processCancel(query) {
  return request.post(`/order/detail/delCancelOrderBomDetail`,query)
}

// 变更文档
export function wordChange(query) {
  return request.post(`/order/detail/changeDocument`,query)
}

// 变更管理批量转生产单
export function changeTransferToProductionOrder(query) {
  return request.post(`/order/detail/changeTransferToProductionOrder`,query)
}

// 获取BOM明细变更使用
export function getOrderBomDetailById(query) {
  return request.post(`/order/detail/getOrderBomDetailById`,query)
}

// 修改版次
export function editVersionNo(query) {
  return request.post(`/order/detail/editVersionNo`,query)
}


// 变更图档
export function updateDrawingFile(formData) {
  return updownloadrequest({
    method: 'POST',
    url: '/order/detail/updateDrawingFile', //填写自己的接口
    data: formData, //填写包装好的formData对象
    timeout: 18*10000,
  })
}

// // 变更图档
// export function updateDrawingFile(formData) {
//   return request({
//     method: 'POST',
//     url: '/order/detail/updateDrawingFile', //填写自己的接口
//     data: formData, //填写包装好的formData对象
//     timeout: 18*10000,
//   })
// }

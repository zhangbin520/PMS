import request from '@/utils/request'

// 分页查询派工单生产进度
export function getProdScheduleDispatchOrderPage(query) {
  return request.post(`/prod/schedule/getProdScheduleDispatchOrderPage`,query)
}

// 钢件各工段Total
export function eachSectionSteelPartsTotal(query) {
  return request({
    url: '/prod/schedule/eachSectionSteelPartsTotal',
    method: 'POST',
    data: query ,
    timeout: 180 * 1000,
  })
}

// 电极各工段Total
export function electrodeSectionsTotal(query) {
  return request.post(`/prod/schedule/electrodeSectionsTotal`,query)
}

// 新增关注派工单进度
export function saveProdDispatchFollow(query) {
  return request.post(`/prod/schedule/saveProdDispatchFollow`,query)
}

// 分页查询派工单特别关注
export function getProdDispatchFollowPage(query) {
  return request.post(`/prod/schedule/getProdDispatchFollowPage`,query)
}

// 导出查询派工单特别关注
export function getProdDispatchFollowExport(query) {
  return request.post(`/prod/schedule/getProdDispatchFollowExport`,query)
}


// 取消(可批量)关注派工单任务进度
export function delProdDispatchFollow(query) {
  return request.post(`/prod/schedule/delProdDispatchFollow`,query)
}

// 派工单进度已完成/关注总数/钢件汇总-总工时/钢件汇总-剩余工时/电极汇总-总工时/电极汇总-剩余工时
export function getSchedule(query) {
  return request.post(`/prod/schedule/index`,query)
}

// 分页未加工的订单明细
export function getUnprocessedOrderDetail(query) {
  return request({
    url: '/prod/task/getUnprocessedOrderDetail',
    method: 'POST',
    data: query ,
    timeout: 180 * 1000,
  })
}

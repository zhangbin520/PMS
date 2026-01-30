import request from '@/utils/request'

// 分页查询生产进度
export function getProdSchedulePage(query) {
  return request({
    method: 'POST',
    url: '/prod/schedule/getProdSchedulePage',
    data: query ,
    timeout: 180 * 1000,
  })
}

// 报工记录
export function prodWorkFinishRecord(query) {
  return request.post(`/prod/schedule/prodWorkFinishRecord`,query)
}

// 导出生产进度
export function exportProdSchedule(query) {
  return request({
    method: 'POST',
    url: '/prod/schedule/exportProdSchedule',
    data: query ,
    timeout: 180 * 1000,
  })
}

// 新增关注任务进度
export function saveProdScheduleFollow(query) {
  return request.post(`/prod/schedule/saveProdScheduleFollow`,query)
}

// 取消(可批量)关注任务进度
export function delProdScheduleFollow(query) {
  return request.post(`/prod/schedule/delProdScheduleFollow`,query)
}

// 分页查询特别关注
export function getProdScheduleFollowPage(query) {
  return request.post(`/prod/schedule/getProdScheduleFollowPage`,query)
}

// 查询特别关注nameList
export function getProdScheduleFollowNameList(query) {
  return request.post(`/prod/schedule/getProdScheduleFollowNameList`,query)
}

export function getProdSchedulePlanPage(query) {
  return request({
    method: 'POST',
    url: '/prod/schedule/getProdScheduleFollowPlanPage',
    data: query ,
    timeout: 180 * 1000,
  })
}

export function getProdSchedulePlan(query) {
  return request({
    method: 'POST',
    url: '/prod/schedule/getProdSchedulePlan',
    data: query ,
    timeout: 180 * 1000,
  })
}
export function getProdPlanEl(query) {
  return request({
    method: 'POST',
    url: '/prod/schedule/getProdPlanEl',
    data: query ,
    timeout: 180 * 1000,
  })
}

export function updateProdPlanEl(query) {
  return request({
    method: 'POST',
    url: '/prod/schedule/updateProdPlanEl',
    data: query ,
    timeout: 180 * 1000,
  })
}

export function getEquipmentSectionOne(query) {
  return request({
    method: 'POST',
    url: '/prod/schedule/getEquipmentSectionOne',
    data: query ,
    timeout: 180 * 1000,
  })
}

// 查询所有部门
export function getEquipmentSectionDept() {
  return request.post(`/prod/schedule/getEquipmentSectionDept`)
}
// 查询所有部门下的设备
export function getDeptIdEquipmentSection(query) {
  return request.post(`/prod/schedule/getDeptIdEquipmentSection`,query)
}
// 查询设备下的看板数据
export function getMoldProcessingAll(query) {
  return request.post(`/prod/schedule/getMoldProcessingAll`,query)
}

// 模具进度总览看板主数据查询
export function getMoldProcessOverview(query) {
  return request.post(`/prod/schedule/getMoldProcessOverview`,query)
}


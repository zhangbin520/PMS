import request from '../../utils/request'

// 查询职位类别列表
export function typePost(query) {
    return request.post(`/position/category/getPositionCategoryList`,query)
}

// 查询职位信息列表
export function listPost(query) {
  return request.post(`/position/info/getPositionInfoPage`,query)
}

// 查询职位级别列表
export function levelPost(query) {
  return request.post(`/position/level/getPositionLevelList`,query)
}

// 查询职位类别详细
export function getTypePost(query) {
  return request.post('/position/category/getPositionCategory',query)
}

// 查询职位信息详细
export function getListPost(query) {
  return request.post('/position/info/getPositionInfo',query)
}

// 查询职位信息详细
export function getListPostList() {
  return request.post('/position/info/getPositionInfoList')
}

// 查询职位级别详细
export function getLevelPost(query) {
  return request.post('/position/level/getPositionLevel',query)
}

// 新增职位类别
export function addTypePost(data) {
  return request.post('/position/category/saveOrUpdatePositionCategory',data)
}

// 新增职位信息
export function addListPost(data) {
  return request.post('/position/info/saveOrUpdatePosition',data)
}

// 新增职位级别
export function addLevelPost(data) {
  return request.post('/position/level/saveOrUpdatePositionLevel',data)
}

// 修改职位类别
export function updateTypePost(data) {
  return request.post('/position/category/saveOrUpdatePositionCategory',data)
}

// 修改职位信息
export function updateListPost(data) {
  return request.post('/position/info/saveOrUpdatePosition',data)
}

// 修改职位级别
export function updateLevelPost(data) {
  return request.post('/position/level/saveOrUpdatePositionLevel',data)
}

// 删除职位类别
export function delTypePost(query) {
  return request.post('/position/category/delPositionCategory',query)
}

// 删除职位信息
export function delListPost(query) {
  return request.post('/position/info/delPositionInfo',query)
}

// 删除职位级别
export function delLevelPost(query) {
  return request.post('/position/level/delPositionInfo',query)
}

// 导出
export function exportPost(query) {
  return request.post('/position/level/export',query)
}

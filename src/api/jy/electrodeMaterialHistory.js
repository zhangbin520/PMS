import request from '@/utils/request'

// 查询电极物料出入库记录列表
export function listElectrodeMaterialHistory(query) {
  return request({
    url: '/jy/electrodeMaterialHistory/list',
    method: 'get',
    params: query
  })
}

// 查询电极物料出入库记录详细
export function getElectrodeMaterialHistory(id) {
  return request({
    url: '/jy/electrodeMaterialHistory/' + id,
    method: 'get'
  })
}

// 新增电极物料出入库记录
export function addElectrodeMaterialHistory(data) {
  return request({
    url: '/jy/electrodeMaterialHistory',
    method: 'post',
    data: data
  })
}

// 修改电极物料出入库记录
export function updateElectrodeMaterialHistory(data) {
  return request({
    url: '/jy/electrodeMaterialHistory',
    method: 'put',
    data: data
  })
}

// 删除电极物料出入库记录
export function delElectrodeMaterialHistory(id) {
  return request({
    url: '/jy/electrodeMaterialHistory/' + id,
    method: 'delete'
  })
}

// 导出电极物料出入库记录
export function exportElectrodeMaterialHistory(query) {
  return request({
    url: '/jy/electrodeMaterialHistory/export',
    method: 'get',
    params: query
  })
}
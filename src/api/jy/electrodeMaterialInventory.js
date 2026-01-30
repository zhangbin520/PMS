import request from '@/utils/request'

// 查询电极物料盘库记录列表
export function listElectrodeMaterialInventory(query) {
  return request({
    url: '/jy/electrodeMaterialInventory/list',
    method: 'get',
    params: query
  })
}

// 查询电极物料盘库记录详细
export function getElectrodeMaterialInventory(id) {
  return request({
    url: '/jy/electrodeMaterialInventory/' + id,
    method: 'get'
  })
}

// 新增电极物料盘库记录
export function addElectrodeMaterialInventory(data) {
  return request({
    url: '/jy/electrodeMaterialInventory',
    method: 'post',
    data: data
  })
}

// 修改电极物料盘库记录
export function updateElectrodeMaterialInventory(data) {
  return request({
    url: '/jy/electrodeMaterialInventory',
    method: 'put',
    data: data
  })
}

// 删除电极物料盘库记录
export function delElectrodeMaterialInventory(id) {
  return request({
    url: '/jy/electrodeMaterialInventory/' + id,
    method: 'delete'
  })
}

// 导出电极物料盘库记录
export function exportElectrodeMaterialInventory(query) {
  return request({
    url: '/jy/electrodeMaterialInventory/export',
    method: 'get',
    params: query
  })
}
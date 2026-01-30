import request from '@/utils/request'

// 查询电极物料列表
export function listElectrodeMaterial(query) {
  return request({
    url: '/jy/steelMaterial/list',
    method: 'get',
    params: query
  })
}

// 查询电极物料详细
export function getElectrodeMaterial(id) {
  return request({
    url: '/jy/steelMaterial/' + id,
    method: 'get'
  })
}

// 新增电极物料
export function addElectrodeMaterial(data) {
  return request({
    url: '/jy/electrodeMaterial',
    method: 'post',
    data: data
  })
}

// 修改电极物料
export function updateElectrodeMaterial(data) {
  return request({
    url: '/jy/electrodeMaterial',
    method: 'put',
    data: data
  })
}

// 删除电极物料
export function delElectrodeMaterial(id) {
  return request({
    url: '/jy/steelMaterial/' + id,
    method: 'delete'
  })
}

// 导出电极物料
export function exportElectrodeMaterial(query) {
  return request({
    url: '/jy/steelMaterial/export',
    method: 'get',
    params: query
  })
}
export function allTexture() {
  return request({
    url: '/jy/steelMaterial/allTexture' ,
    method: 'get'
  })
}
export function incomeElectrodeMaterial(data) {
  return request({
    url: '/jy/steelMaterial/income',
    method: 'post',
    data: data
  })
}
export function inventoryElectrodeMaterial(data) {
  return request({
    url: '/jy/steelMaterial/inventory',
    method: 'post',
    data: data
  })
}
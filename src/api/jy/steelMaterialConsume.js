import request from '@/utils/request'

// 查询电极用料列表
export function listElectrodeMaterialConsume(query) {
  return request({
    url: '/jy/steelMaterialConsume/list',
    method: 'get',
    params: query
  })
}

// 查询电极用料详细
export function getElectrodeMaterialConsume(id) {
  return request({
    url: '/jy/steelMaterialConsume/' + id,
    method: 'get'
  })
}

// 新增电极用料
export function addElectrodeMaterialConsume(data) {
  return request({
    url: '/jy/steelMaterialConsume',
    method: 'post',
    data: data
  })
}

// 修改电极用料
export function updateElectrodeMaterialConsume(data) {
  return request({
    url: '/jy/steelMaterialConsume',
    method: 'put',
    data: data
  })
}

// 删除电极用料
export function delElectrodeMaterialConsume(id) {
  return request({
    url: '/jy/steelMaterialConsume/' + id,
    method: 'delete'
  })
}

// 导出电极用料
export function exportElectrodeMaterialConsume(query) {
  return request({
    url: '/jy/steelMaterialConsume/export',
    method: 'get',
    params: query
  })
}
export function outcomeElectrodeMaterialConsume(data) {
  return request({
    url: '/jy/steelMaterialConsume/outcome',
    method: 'post',
    data: data
  })
}
export function actualElectrodeMaterialConsume(data) {
  return request({
    url: '/jy/steelMaterialConsume/actual',
    method: 'post',
    data: data
  })
}
import request from '@/utils/request'

// 查询电极用料列表
export function listElectrodeMaterialConsume(query) {
  return request({
    url: '/jy/electrodeMaterialConsume/list',
    method: 'get',
    params: query
  })
}

// 查询电极用料详细
export function getElectrodeMaterialConsume(id) {
  return request({
    url: '/jy/electrodeMaterialConsume/' + id,
    method: 'get'
  })
}

// 新增电极用料
export function addElectrodeMaterialConsume(data) {
  return request({
    url: '/jy/electrodeMaterialConsume',
    method: 'post',
    data: data
  })
}

// 修改电极用料
export function updateElectrodeMaterialConsume(data) {
  return request({
    url: '/jy/electrodeMaterialConsume',
    method: 'put',
    data: data
  })
}

// 删除电极用料
export function delElectrodeMaterialConsume(id) {
  return request({
    url: '/jy/electrodeMaterialConsume/' + id,
    method: 'delete'
  })
}

// 导出电极用料
export function exportElectrodeMaterialConsume(query) {
  return request({
    url: '/jy/electrodeMaterialConsume/export',
    method: 'get',
    params: query
  })
}
export function outcomeElectrodeMaterialConsume(data) {
  return request({
    url: '/jy/electrodeMaterialConsume/outcome',
    method: 'post',
    data: data
  })
}
export function outcomeElectrodeConsume(data) {
  return request({
    url:'http://10.123.17.31:80/automation-api/home/AssignHolderToServer',
    method: 'post',
    data: data,
  })
}
export function actualElectrodeMaterialConsume(data) {
  return request({
    url: '/jy/electrodeMaterialConsume/actual',
    method: 'post',
    data: data
  })
}

// 查询电极编号
export function getCamElectrodeByProdOrderNoEleNo(query) {
  return request.post(`/cam/electrodeBom/getCamElectrodeByProdOrderNoEleNo`,query)
}

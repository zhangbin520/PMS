import request from '@/utils/request'

// 查询电极管理列表
export function listElectrodeMange(query) {
  return request({
    url: '/jy/electrodeMange/list',
    method: 'get',
    params: query
  })
}

// 查询电极管理详细
export function getElectrodeMange(id) {
  return request({
    url: '/jy/electrodeMange/' + id,
    method: 'get'
  })
}
export function rfidElectrodeMange(query) {
  return request({
    url: '/jy/electrodeMange/rfid',
    method: 'get',
    params: query
  })
}
// 新增电极管理
export function addElectrodeMange(data) {
  return request({
    url: '/jy/electrodeMange',
    method: 'post',
    data: data
  })
}

// 修改电极管理
export function updateElectrodeMange(data) {
  return request({
    url: '/jy/electrodeMange',
    method: 'put',
    data: data
  })
}

// 删除电极管理
export function delElectrodeMange(id) {
  return request({
    url: '/jy/electrodeMange/' + id,
    method: 'delete'
  })
}

// 导出电极管理
export function exportElectrodeMange(query) {
  return request({
    url: '/jy/electrodeMange/export',
    method: 'get',
    params: query
  })
}

export function optElectrode(data) {
  return request({
    url: '/jy/electrodeMange/optElectrode',
    method: 'post',
    data: data
  })
}
export function getCamElectrodeBom(data) {
  return request({
    url: '/cam/electrodeBom/getCamElectrodeBomByProdOrderNo',
    method: 'post',
    data: data
  })
}

export function getCamSparkList(data) {
  return request({
    url: '/cam/electrodeBom/getCamElectricSparkByEleNo',
    method: 'post',
    data: data
  })
}

export function getCamElectrodeProcess(data) {
  return request({
    url: '/cam/electrodeBom/getCamElectrodeProcessByElectrodeNo',
    method: 'post',
    data: data
  })
}
export function reProduction(data) {
  return request({
    url: '/cam/electrodeBom/reProduction',
    method: 'post',
    data: data
  })
}
export function canOut(data) {
  return request({
    url: '/prod/task/checkProdWorkFinish',
    method: 'post',
    data: data
  })
}
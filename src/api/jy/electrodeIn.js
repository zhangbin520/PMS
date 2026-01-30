import request from '@/utils/request'

// 查询电极待入库列表
export function listElectrodeIn(query) {
  return request({
    url: '/jy/electrodeIn/list',
    method: 'get',
    params: query
  })
}

// 查询电极待入库详细
export function getElectrodeIn(id) {
  return request({
    url: '/jy/electrodeIn/' + id,
    method: 'get'
  })
}
export function rfidElectrodeIn(id) {
  return request({
    url: '/jy/electrodeIn/rfid/' + id,
    method: 'get'
  })
}
// 新增电极待入库
export function addElectrodeIn(data) {
  return request({
    url: '/jy/electrodeIn',
    method: 'post',
    data: data
  })
}

// 修改电极待入库
export function updateElectrodeIn(data) {
  return request({
    url: '/jy/electrodeIn',
    method: 'put',
    data: data
  })
}

// 删除电极待入库
export function delElectrodeIn(id) {
  return request({
    url: '/jy/electrodeIn/' + id,
    method: 'delete'
  })
}

// 导出电极待入库
export function exportElectrodeIn(query) {
  return request({
    url: '/jy/electrodeIn/export',
    method: 'get',
    params: query
  })
}

//检测生产单是否完成
export function checkProdWorkFinish(query) {
  return request.post(`/prod/task/checkProdWorkFinish`,query)
}

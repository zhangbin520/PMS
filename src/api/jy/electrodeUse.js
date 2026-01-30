import request from '@/utils/request'

// 查询电极已用物料列表
export function listElectrodeUse(query) {
  return request({
    url: '/mes/electrodeUse/list',
    method: 'get',
    params: query
  })
}

// 查询电极已用物料详细
export function getElectrodeUse(id) {
  return request({
    url: '/mes/electrodeUse/' + id,
    method: 'get'
  })
}

// 新增电极已用物料
export function addElectrodeUse(data) {
  return request({
    url: '/mes/electrodeUse',
    method: 'post',
    data: data
  })
}

// 修改电极已用物料
export function updateElectrodeUse(data) {
  return request({
    url: '/mes/electrodeUse',
    method: 'put',
    data: data
  })
}

// 删除电极已用物料
export function delElectrodeUse(id) {
  return request({
    url: '/mes/electrodeUse/' + id,
    method: 'delete'
  })
}

// 导出电极已用物料
export function exportElectrodeUse(query) {
  return request({
    url: '/mes/electrodeUse/export',
    method: 'get',
    params: query
  })
}

export function rfidElectrodeUse(rfid) {
  return request({
    url: '/mes/electrodeUse/rfidElectrodeUse/' + rfid,
    method: 'get'
  })
}

export function delElectrodeUseCondition(id) {
  return request({
    url: '/mes/electrodeUse/delElectrodeUseCondition/' + id,
    method: 'delete'
  })
}
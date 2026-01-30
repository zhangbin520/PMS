import request from '@/utils/request'

// 查询电极记录列表
export function listElectrodeHistory(query) {
  return request({
    url: '/jy/electrodeHistory/list',
    method: 'get',
    params: query
  })
}

// 查询电极记录详细
export function getElectrodeHistory(id) {
  return request({
    url: '/jy/electrodeHistory/' + id,
    method: 'get'
  })
}

// 新增电极记录
export function addElectrodeHistory(data) {
  return request({
    url: '/jy/electrodeHistory',
    method: 'post',
    data: data
  })
}

// 修改电极记录
export function updateElectrodeHistory(data) {
  return request({
    url: '/jy/electrodeHistory',
    method: 'put',
    data: data
  })
}

// 删除电极记录
export function delElectrodeHistory(id) {
  return request({
    url: '/jy/electrodeHistory/' + id,
    method: 'delete'
  })
}

// 导出电极记录
export function exportElectrodeHistory(query) {
  return request({
    url: '/jy/electrodeHistory/export',
    method: 'get',
    params: query
  })
}
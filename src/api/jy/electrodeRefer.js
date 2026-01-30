import request from '@/utils/request'

// 查询引用记录列表
export function listElectrodeRefer(query) {
  return request({
    url: '/jy/electrodeRefer/list',
    method: 'get',
    params: query
  })
}

// 查询引用记录详细
export function getElectrodeRefer(id) {
  return request({
    url: '/jy/electrodeRefer/' + id,
    method: 'get'
  })
}

// 新增引用记录
export function addElectrodeRefer(data) {
  return request({
    url: '/jy/electrodeRefer',
    method: 'post',
    data: data
  })
}

// 修改引用记录
export function updateElectrodeRefer(data) {
  return request({
    url: '/jy/electrodeRefer',
    method: 'put',
    data: data
  })
}

// 删除引用记录
export function delElectrodeRefer(id) {
  return request({
    url: '/jy/electrodeRefer/' + id,
    method: 'delete'
  })
}

// 导出引用记录
export function exportElectrodeRefer(query) {
  return request({
    url: '/jy/electrodeRefer/export',
    method: 'get',
    params: query
  })
}

export function allElectrodeRefer(query) {
  return request({
    url: '/jy/electrodeRefer/allElectrodeRefer',
    method: 'get',
    params: query
  })
}
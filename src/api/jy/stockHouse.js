import request from '@/utils/request'

// 查询stockHouse列表
export function listStockHouse(query) {
  return request({
    url: '/jy/stockHouse/list',
    method: 'get',
    params: query
  })
}

// 查询stockHouse详细
export function getStockHouse(id) {
  return request({
    url: '/jy/stockHouse/' + id,
    method: 'get'
  })
}

// 新增stockHouse
export function addStockHouse(data) {
  return request({
    url: '/jy/stockHouse',
    method: 'post',
    data: data
  })
}

// 修改stockHouse
export function updateStockHouse(data) {
  return request({
    url: '/jy/stockHouse',
    method: 'put',
    data: data
  })
}

// 删除stockHouse
export function delStockHouse(id) {
  return request({
    url: '/jy/stockHouse/' + id,
    method: 'delete'
  })
}

// 导出stockHouse
export function exportStockHouse(query) {
  return request({
    url: '/jy/stockHouse/export',
    method: 'get',
    params: query
  })
}
export function allStockHouse(query) {
  return request({
    url: '/jy/stockHouse/all',
    method: 'get',
    params: query
  })
}
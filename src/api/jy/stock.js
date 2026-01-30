import request from '@/utils/request'

// 查询stock列表
export function listStock(query) {
  return request({
    url: '/jy/stock/list',
    method: 'get',
    params: query
  })
}

// 查询stock详细
export function getStock(id) {
  return request({
    url: '/jy/stock/' + id,
    method: 'get'
  })
}

// 新增stock
export function addStock(data) {
  return request({
    url: '/jy/stock',
    method: 'post',
    data: data
  })
}

// 修改stock
export function updateStock(data) {
  return request({
    url: '/jy/stock',
    method: 'put',
    data: data
  })
}

// 删除stock
export function delStock(id) {
  return request({
    url: '/jy/stock/' + id,
    method: 'delete'
  })
}

// 导出stock
export function exportStock(query) {
  return request({
    url: '/jy/stock/export',
    method: 'get',
    params: query
  })
}

export function allStock(query) {
  return request({
    url: '/jy/stock/all',
    method: 'get',
    params: query
  })
}

export function addBatch(data) {
  return request({
    url: '/jy/stock/addBatch',
    method: 'post',
    data: data
  })
}
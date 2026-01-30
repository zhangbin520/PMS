import request from '@/utils/request'

// 查询mac列表
export function listMac(query) {
  return request({
    url: '/jy/mac/list',
    method: 'get',
    params: query
  })
}

// 查询mac详细
export function getMac(id) {
  return request({
    url: '/jy/mac/' + id,
    method: 'get'
  })
}
export function detail(id) {
  return request({
    url: '/jy/mac/detail/' + id,
    method: 'get'
  })
}
// 新增mac
export function addMac(data) {
  return request({
    url: '/jy/mac',
    method: 'post',
    data: data
  })
}

// 修改mac
export function updateMac(data) {
  return request({
    url: '/jy/mac',
    method: 'put',
    data: data
  })
}

// 删除mac
export function delMac(id) {
  return request({
    url: '/jy/mac/' + id,
    method: 'delete'
  })
}

// 导出mac
export function exportMac(query) {
  return request({
    url: '/jy/mac/export',
    method: 'get',
    params: query
  })
}

export function exportMacDetail(id) {
  return request({
    url: '/jy/mac/detail/export/'+id,
    method: 'get'
  })
}
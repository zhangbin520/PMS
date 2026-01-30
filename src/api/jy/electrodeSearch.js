import request from '@/utils/request'

// 查询电极搜索列表
export function listElectrodeSearch(query) {
  return request({
    url: '/jy/electrodeSearch/list',
    method: 'get',
    params: query
  })
}
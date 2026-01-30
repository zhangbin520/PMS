import request from '@/utils/request'

// 查询task列表
export function listTask(query) {
  return request({
    url: '/jy/task/list',
    method: 'get',
    params: query
  })
}

// 查询task详细
export function getTask(id) {
  return request({
    url: '/jy/task/' + id,
    method: 'get'
  })
}
export function detail(id) {
  return request({
    url: '/jy/task/detail/' + id,
    method: 'get'
  })
}
export function getPlan() {
  return request({
    url: '/jy/task/plan',
    method: 'get'
  })
}
// 新增task
export function addTask(data) {
  return request({
    url: '/jy/task',
    method: 'post',
    data: data
  })
}

// 修改task
export function updateTask(data) {
  return request({
    url: '/jy/task',
    method: 'put',
    data: data
  })
}

// 删除task
export function delTask(id) {
  return request({
    url: '/jy/task/' + id,
    method: 'delete'
  })
}

// 导出task
export function exportTask(query) {
  return request({
    url: '/jy/task/export',
    method: 'get',
    params: query
  })
}

export function exportTaskDetail(id) {
  return request({
    url: '/jy/task/detail/export/'+id,
    method: 'get'
  })
}
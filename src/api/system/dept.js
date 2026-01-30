import request from '../../utils/request'

// 查询组织机构列表
export function listDept(query) {
  return request.post(`/system/dept/getSysDeptPage`,query)
}

// 查询组织机构列表
export function listRoot(query) {
  return request.post('/system/dept/getSysDept',query)
}

// 查询组织机构详细
export function getDept(query) {
  return request.post('/system/dept/getSysDeptList',query)
}

// 查询组织机构下拉树结构
export function treeselect() {
  return request({
    url: '/system/dept/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询组织机构树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增组织机构
export function addDept(data) {
  return request.post('/system/dept/saveSysDept',data)
}

// 修改组织机构
export function updateDept(data) {
  return request.post('/system/dept/saveOrUpdateSysDept',data)
}

// 修改上下级组织机构
export function adjustDeptPosition(query) {
  return request.post('/system/dept/adjustmentSysDept',query)
}

// 调整上下位置
export function adjustDept() {
  return request({
    url: '/system/dept/adjustPosition' ,
    method: 'post'
  })
}

// 修改上下级组织机构
export function updateDeptstatus(query) {
  return request.post('/system/dept/editStatusSysDept',query)
}


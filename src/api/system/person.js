import request from '@/utils/request'

// 分页查询员工信息列表
export function listPerson(query) {
  return request.post(`/person/info/getPersonInfoPage`,query)
}

// 分页查询员工信息详细
export function getPerson(query) {
  return request.post('/person/info/getPersonInfo',query)
}

// 分页查询加工任务权限列表
export function listTaskPermissionList(query) {
  return request.post(`/person/info/getProcessingTaskPermissionList`,query)
}

// 新增员工信息
export function addPerson(query) {
  return request.post('/person/info/savePerson',query)
}

// 修改员工信息
export function updatePerson(query) {
  return request.post('/person/info/editPerson',query)
}

// 调岗或晋升
export function upOrDownPerson(query) {
  return request.post('/person/info/employeeRransferAndPromotion',query)
}

// 员工离职
export function leavePerson(query) {
  return request.post('/person/info/resignationAndReEmployment',query)
}

// 员工二次入职
export function entryPerson(query) {
  return request.post('/person/info/resignationAndReEmployment',query)
}

// 员工停岗
export function stopPerson(query) {
  return request.post('/person/info/stopAndResumeWork',query)
}

// 员工复岗
export function recoverPerson(query) {
  return request.post('/person/info/stopAndResumeWork',query)
}

// 员工查看下级
export function viewPersonSub(query) {
  return request.post('/person/info/viewSubordinates',query)
}

// 员工查看上级
export function viewPersonSup(query) {
  return request.post('/person/info/viewSuperior',query)
}

// 区域接口
export function RegionList(query) {
  return request.post('/system/region/getSysRegionList',query)
}

//岗位经历
export function postExperience(query) {
  return request.post('/person/info/postExperience',query)
}

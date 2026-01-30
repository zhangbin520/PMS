import request from "../../utils/request";

// 分页查询工序工时
export function listProcess(query) {
  return request.post(`/process/manHour/getProcessManHourPage`,query)
}

// 查询工序工时list
export function getProcessManHourList(query) {
  return request.post(`/process/manHour/getProcessManHourList`,query)
}

// 查询工序工时
export function getProcess(data) {
  return request.post(`/process/manHour/getProcessManHour`,data)
}

// 分页查询工件类型
export function getProcessWorkpieceType(data) {
  return request.post(`/process/manHour/getProcessWorkpieceTypePage`,data)
}

// 新增工序工时
export function addProcess(data) {
  return request.post(`/process/manHour/saveOrUpdateProcessManHour`,data)
}

// 新增工件类型
export function addWorkpieceType(data) {
  return request.post(`/process/manHour/saveProcessWorkpieceType`,data)
}

// 修改工序工时
export function updateProcess(data) {
  return request.post(`/process/manHour/saveOrUpdateProcessManHour`,data)
}

// 启用停用工序
export function changeProcessStatus(data) {
  return request.post(`/process/manHour/enableDisableOperation`,data)
}

// 删除工序工时
export function delProcess(data) {
  return request.post(`/process/manHour/delProcessManHour`,data)
}

// 删除工件类型
export function delWorkpieceType(data) {
  return request.post(`/process/manHour/delProcessWorkpieceType`,data)
}

// 导出工序工时
export function exportProcess(data) {
  return request.post(`/process/manHour/export`,data)
}

// 保存工艺组
export function setProcessGroup(data) {
  return request.post(`/process/manHour/setProcessGroup`,data)
}

// 分页查看工艺组
export function getGroupPage(query) {
  return request.post(`/process/manHour/getGroupPage`,query)
}

// 分页查看工艺组工艺列表
export function getGroupProcessPage(data) {
  return request.post(`/process/manHour/getGroupProcessPage`,data)
}

// 编辑工艺组-新增工艺
export function editGroupAddProcess(data) {
  return request.post(`/process/manHour/editGroupAddProcess`,data)
}

// 编辑工艺组-删除组
export function delGroup(data) {
  return request.post(`/process/manHour/delGroup`,data)
}

// 编辑工艺组-删除工艺
export function delAProcess(data) {
  return request.post(`/process/manHour/delProcess`,data)
}

// 群组所属工艺列表
export function getGroupAllProcess(data) {
  return request.post(`/process/manHour/getGroupAllProcessList`,data)
}

//修改工艺组
export function editProcessGroup(data) {
  return request.post(`/process/manHour/editProcessGroup`,data)
}

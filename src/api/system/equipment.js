import request from "../../utils/request";

// 分页查询设备工段
export function listEquipment(query) {
  return request.post(`/equipment/section/getEquipmentSectionPage`,query)
}

// 分页查询设备工段
export function getEquipmentSectionList(query) {
  return request.post(`/equipment/section/getEquipmentSectionList`,query)
}

// 查询设备工段信息
export function getEquipment(data) {
  return request.post(`/equipment/section/getEquipmentSection`,data)
}

// 新增设备工段
export function addEquipment(data) {
  return request.post(`/equipment/section/saveOrUpdateEquipmentSection`,data)
}

// 修改设备工段
export function updateEquipment(data) {
  return request.post(`/equipment/section/saveOrUpdateEquipmentSection`,data)
}

// 启用停用状态修改
export function changeEquipmentStatus(data) {
  return request.post(`/equipment/section/oNoffEquipmentSection`,data)
}

// 删除设备工段
export function delEquipment(data) {
  return request.post(`/equipment/section/delEquipmentSection`,data)
}

// 导出设备工段
export function exportEquipment(data) {
  return request.post(`/equipment/section/export`,data)
}

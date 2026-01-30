import request from '@/utils/request'

// 分页查询仓库信息列表
export function listWarehouse(query) {
  return request.post(`/warehouse/info/getWarehouseInfoPage`,query)
}

// 查询仓库信息列表
export function getWarehouse(query) {
  return request.post(`/warehouse/info/getWarehouseInfo`,query)
}

// 分页查询库位信息
export function listWareLocation(query) {
  return request.post(`/warehouse/location/getWarehouseLocationPage`,query)
}

// 分页查询库位信息列表
export function wareLocationList(query) {
  return request.post(`/warehouse/location/getWarehouseLocationList`,query)
}

// 查询库位信息列表
export function getWareLocation(query) {
  return request.post(`/warehouse/location/getWarehouseLocation`,query)
}

// 修改仓库信息列表
export function updateWarehouse(query) {
  return request.post(`/warehouse/info/saveOrUpdateWarehouse`,query)
}

// 增加仓库信息列表
export function addWarehouse(query) {
  return request.post(`/warehouse/info/saveOrUpdateWarehouse`,query)
}

// 修改库位信息列表
export function updateWareLocation(query) {
  return request.post(`/warehouse/location/saveOrUpdateWarehouseLocation`,query)
}

// 增加库位信息列表
export function addWareLocation(query) {
  return request.post(`/warehouse/location/saveOrUpdateWarehouseLocation`,query)
}

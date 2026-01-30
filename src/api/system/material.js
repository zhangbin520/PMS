import request from '../../utils/request'

// 获取物料列表
export function listMaterial(query) {
  return request.post(`/material/detail/getMaterialDetailPage`,query)
}

// 查询物料列表
export function getListMaterial(query) {
  return request.post(`/material/detail/getMaterialDetail`,query)
}

// 新增物料列表
export function addListMaterial(query) {
  return request.post(`/material/detail/saveOrUpdateMaterialDetail`,query)
}

// 修改物料列表
export function updateListMaterial(query) {
  return request.post(`/material/detail/saveOrUpdateMaterialDetail`,query)
}

// 查询物料分类列表
export function listMaterialType(query) {
  return request.post(`/material/type/getMaterialTypeList`,query)
}

// 新增物料分类列表
export function addMaterialType(query) {
  return request.post(`/material/type/saveMaterialType`,query)
}

// 修改物料分类列表
export function updateMaterialType(query) {
  return request.post(`/material/type/editMaterialType`,query)
}

//物料入库详情
export function enterStorageList(query) {
  return request.post(`/material/warehousing/getMaterialWarehousingPage`,query)
}

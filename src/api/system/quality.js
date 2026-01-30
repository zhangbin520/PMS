import request from '../../utils/request'

// 分页获取材质配置
export function listQuality(query) {
  return request.post(`/material/config/getMaterialConfigPage`,query)
}

// 获取材质配置详情
export function getListQuality(query) {
  return request.post(`/material/config/getMaterialConfig`,query)
}


// 新增材质配置
export function addQuality(query) {
  return request.post(`/material/config/saveOrUpdateMaterialConfig`,query)
}

// 修改材质配置
export function updateQuality(query) {
  return request.post(`/material/config/saveOrUpdateMaterialConfig`,query)
}

// 删除材质配置
export function deleteQuality(query) {
  return request.post(`/material/config/delMaterialConfig`,query)
}

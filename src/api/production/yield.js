import request from "../../utils/request";

// 分页查询良品率
export function getProdYieldPage(query) {
  return request.post(`/prod/yield/getProdYieldPage`,query)
}

// 导入良品率
export function importProdYield(query) {
  return request.post(`/prod/yield/importProdYield`,query)
}

// 导出良品率模板
export function exportProdYield(query) {
  return request.post(`/prod/yield/exportProdYield`,query)
}

// 新增良品率
export function saveProdYield(query) {
  return request.post(`/prod/yield/saveOrUpdateProdYield`,query)
}

// 修改良品率
export function updateProdYield(query) {
  return request.post(`/prod/yield/saveOrUpdateProdYield`,query)
}

// 批量删除良品率
export function delProdYield(query) {
  return request.post(`/prod/yield/delProdYield`,query)
}

// 新增组织架构
export function getSysDeptByCodeList(query) {
  return request.post(`/system/dept/getSysDeptByCodeList`,query)
}

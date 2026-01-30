import request from "../../utils/request";

// 分页查询物料入库
export function listWarehousing(query) {
  return request.post(`/material/warehousing/getMaterialWarehousingPage`,query)
}

// 查询物料入库详情
export function getWarehousing(data) {
  return request.post(`/material/warehousing/getMaterialWarehousing`,data)
}

// 新增物料入库
export function addWarehousing(data) {
  return request.post(`/material/warehousing/addReceipt`,data)
}

// 取消物料入库
export function cancelWarehousing(data) {
  return request.post(`/material/warehousing/cancelWarehousing`,data)
}

// 入库列表入库
export function stockInList(data) {
  return request.post(`/material/warehousing/stockInList`,data)
}

// 导出入库列表
export function exportWarehousing(data) {
  return request.post(`/material/warehousing/export`,data)
}

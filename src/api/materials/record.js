import request from "../../utils/request";

// 分页查询记录
export function listRecord(query) {
  return request.post(`/material/record/getMaterialRecordPage`,query)
}

// 获取记录
export function getRecord(data) {
  return request.post(`/material/record/getMaterialRecord`,data)
}

// 导出记录
export function exportRecord(data) {
  return request.post(`/material/record/export`,data)
}

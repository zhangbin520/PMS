import request from '../../utils/request'

// 分页文件格式列表
export function listFiles(query) {
  return request.post(`/system/file/getSysFilePage`,query)
}

// 文件格式列表新增
export function updateFiles(query) {
  return request.post(`/system/file/editSysFile`,query)
}

// 文件格式列表修改
export function addFiles(query) {
  return request.post(`/system/file/editSysFile`,query)
}

// 文件格式列表删除
export function delFiles(query) {
  return request.post(`/system/file/delSysFile`,query)
}

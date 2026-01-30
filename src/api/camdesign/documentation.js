import request from '../../utils/request'

// 分页查询程序文档
export function listProgramDocPage(query) {
  return request.post(`/cam/nc/programDocPage`,query)
}

// 分页查询工艺列表
export function listProcessPage(query) {
  return request.post(`/cam/nc/viewProcessPage`,query)
}

// 分页查看设计图档
export function viewDesignDoc(query) {
  return request.post(`/cam/nc/viewDesignDoc`,query)
}
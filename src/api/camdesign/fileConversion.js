import request from '../../utils/request'

// 分页查询文件转换失败记录
export function getCamFileConvertPage(query) {
  return request.post(`/cam/convert/getCamFileConvertPage`,query)
}

// 文件转换
export function fileConvert(query) {
  return request.post(`/cam/convert/convert`,query)
}

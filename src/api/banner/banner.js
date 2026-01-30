import request from '../../utils/request'

// 分页查询程序文档
export function getSysBannerList(query) {
  return request.post(`/system/banner/getSysBannerList`,query)
}

// 分页查询程序文档
export function bannerPage(query) {
  return request.post(`/banner/page'`,query)
}
//上传系统Banner
export function uploadSysBanner(query) {
  return request.post(`/system/banner/uploadSysBanner`,query)
}
//删除Banner
export function delSysBanner(query) {
  return request.post(`/banner/delSysBanner`,query)
}

export function saveContent(query) {
  return request.post(`banner/saveContent`,query)
}

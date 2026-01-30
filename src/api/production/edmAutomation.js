import request from '@/utils/request'

//生成程式
export function uploadCamElectrodeKnifeLibrary(query) {
  return request.post(`/cam/cam-electrode-knife-library/uploadCamElectrodeKnifeLibrary`,query)
}

//CMM量测分页查询
export function getCmmSparkPointPage(query) {
  return request.post(`/cmm/cmm/getCmmSparkPointPage`,query)
}

//CMM量测查询list
export function getCmmSparkPointList(query) {
  return request.post(`/cmm/cmm/getCmmSparkPointList`,query)
}

// 修改   。。  特采
export function updateCmmMeasureResult(query) {
  return request.post(`/cmm/cmm/updateCmmMeasureResult`,query)
}

//EDM下载文件到机床
export function DownloadEDMIn(query) {
  return request.post(`/iot/iot/DownloadEDMIn`,query)
}

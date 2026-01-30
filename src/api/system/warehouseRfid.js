import request from '@/utils/request'

//分页查询电极刀库号绑定
export function getCamElectrodeKnifeLibraryPage(query) {
  return request.post(`/cam/cam-electrode-knife-library/getCamElectrodeKnifeLibraryPage`,query)
}

//获取电极刀库号绑定
export function getCamElectrodeKnifeLibrary(query) {
  return request.post(`/cam/cam-electrode-knife-library/getCamElectrodeKnifeLibrary`,query)
}

//新增修改电极刀库号绑定
export function editCamElectrodeKnifeLibrary(query) {
  return request.post(`/cam/cam-electrode-knife-library/editCamElectrodeKnifeLibrary`,query)
}

//批量删除电极刀库号绑定
export function delBatchCamElectrodeKnifeLibrary(query) {
  return request.post(`/cam/cam-electrode-knife-library/delBatchCamElectrodeKnifeLibrary`,query)
}

import request from '../../utils/request'
import updownloadrequest from '@/utils/updownloadrequest'

// 电子联络单
export function electronicContactList(query) {
  return request.post(`/prod/schedule/electronicContactList`,query)
}

// 保存电子联络单工段交接事宜
export function editCamEleContactListRemark(query) {
  return request.post(`/prod/schedule/editCamEleContactListRemark`,query)
}

// 根据钢件生产单号查询电极生产单号
export function getCamElectrodeProdOrderNo(query) {
  return request.post(`/cam/electrodeBom/getCamElectrodeProdOrderNo`,query)
}

// 分页查看量测文件(电极)
export function getMeasurementFilePage(query) {
  return request.post(`/cmm/cmm/getCmmUploadPage`,query)
}

// 分页查看量测文件(钢件)
export function getMeasurementSteelFilePage(query) {
  return request.post(`/cmm/cmm/getCmmSteelUploadPage`,query)
}

// 量测报告上传
export function uploadMeasurementFile(formData) {
  return updownloadrequest({
    method: 'POST',
    url: '/prod/schedule/uploadMeasurementFile',   //填写自己的接口
    data: formData ,       //填写包装好的formData对象
    timeout: 60 * 1000,
  })
}


// 分页查看量测文件(钢件)
export function getOrderBomMeasurementFilePage(query) {
  return updownloadrequest.post(`/prod/schedule/getOrderBomMeasurementFilePage`,query)
}


// 上传电极量测文件
export function upMeasurementFile(query) {
  return updownloadrequest.post(`/prod/schedule/uploadMeasurementFile`,query)
}

//上传钢件量测文件
export function uploadOrderBomMeasurementFile(query) {
  return updownloadrequest.post(`/prod/schedule/uploadOrderBomMeasurementFile`,query)
}

// // 上传钢件量测文件
// export function uploadOrderBomMeasurementFile(query) {
//   return request.post(`/prod/schedule/uploadOrderBomMeasurementFile`,query)
// }
//
// // 上传电极量测文件
// export function upMeasurementFile(query) {
//   return request.post(`/prod/schedule/uploadMeasurementFile`,query)
// }
//
// // 分页查看量测文件(钢件)
// export function getOrderBomMeasurementFilePage(query) {
//   return request.post(`/prod/schedule/getOrderBomMeasurementFilePage`,query)
// }
//
// // 量测报告上传
// export function uploadMeasurementFile(formData) {
//   return request({
//     method: 'POST',
//     url: '/prod/schedule/uploadMeasurementFile',   //填写自己的接口
//     data: formData ,       //填写包装好的formData对象
//     timeout: 60 * 1000,
//   })
// }

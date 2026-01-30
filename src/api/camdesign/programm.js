import request from '../../utils/request'
import updownloadrequest from '@/utils/updownloadrequest'


// 分页查询变更的NC编程任务
export function listProgrammeChange(query) {
  return request.post(`/cam/nc/pageQueryChangeList`,query)
}

// 分页查询NC编程任务
export function listProgramme(query) {
  return request.post(`/cam/nc/getCamNcPage`,query)
}

// 复用电极
export function reUseElectrodeTake(query) {
  return request.post(`/cam/nc/reUseElectrodeTake`,query)
}

// 分页查询NC编程已领取任务
export function getCamNcReceivedPage(query) {
  return request.post(`/cam/nc/getCamNcReceivedPage`,query)
}

export function delCamFile(query) {
  return request.post(`/cam/nc/delCamFile`,query)
}
export function getCamFileList(query) {
  return request.post(`/cam/nc/getCamFileList`,query)
}

// 分页查询NC编程已完成任务
export function getCamNcFinishPage(query) {
  return request.post(`/cam/nc/getCamNcFinishPage`,query)
}

// 领取编程任务
export function actionProgramme(query) {
  return request.post(`/cam/nc/receiveTask`,query)
}

// 开始/暂停/恢复编程任务
export function changeState(query) {
  return request.post(`/cam/programTasks/changeState`,query)
}

// 分页查看文件类型
export function getFileTypePage(query) {
  return request.post(`/cam/nc/getFileTypePage`,query)
}

// 新增文件类型
export function setFileType(query) {
  return request.post(`/cam/nc/setFileType`,query)
}

// 查看操作记录
export function camNcOperatorHisPage(query) {
  return request.post(`/cam/nc/camNcOperatorHisPage`,query)
}

// （开始、暂停、恢复、放弃、完成）
export function camNcChangeState(query) {
  return request.post(`/cam/nc/camNcChangeState`,query)
}

// 分页查看工序相关文件
export function getProcessFilePage(query) {
  return request.post(`/cam/nc/getProcessFilePage`,query)
}

// 查询所有品牌信息
export function getBrandInformation(query) {
  return request.post(`/equipment/section/getBrandInformation`,query)
}


// 查看上传文件
export function getUploadFile(query) {
  return request.post(`/cam/nc/getUploadFile`,query)
}

// 保存工序相关文件
export function editProcessFile(query) {
  return request.post(`/cam/nc/editProcessFile`,query)
}

// 重新设计
export function reDesign(query) {
  return request.post(`/cam/nc/redesign`,query)
}

// 查看电极3D文档
export function getProcess3DFile(query) {
  return request.post(`/cam/nc/getProcess3DFile`,query)
}

// 批量领取任务
export function batchCommencement(query) {
  return request.post(`/cam/nc/batchCommencement`,query)
}

// 修改文件类型
export function updFileType(query) {
  return request.post(`/cam/nc/updFileType`,query)
}

// 可复用选择
export function getReusable(query) {
  return request.post(`/cam/nc/getReusable`,query)
}

// 确认复用
export function confirmReuse(query) {
  return request.post(`/cam/nc/confirmReuse`,query)
}

// 上传文件
export function uploadFile(query) {
  return updownloadrequest.post(`/cam/nc/uploadFile`,query)
}

// 删除工序相关文件
export function delProcessFile(query) {
  return updownloadrequest.post(`/cam/nc/delProcessFile`,query)
}

// 删除文件
export function delFile(query) {
  return updownloadrequest.post(`/cam/nc/delFile`,query)
}

// // 上传文件
// export function uploadFile(query) {
//   return request.post(`/cam/nc/uploadFile`,query)
// }
//
// // 删除工序相关文件
// export function delProcessFile(query) {
//   return request.post(`/cam/nc/delProcessFile`,query)
// }
//
// // 删除文件
// export function delFile(query) {
//   return request.post(`/cam/nc/delFile`,query)
// }

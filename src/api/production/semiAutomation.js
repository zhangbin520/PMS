import request from '../../utils/request'
import updownloadrequest from '@/utils/updownloadrequest'
import iotRequest from '@/utils/iotRequest'

// 分页查询坐标系
export function getBaseCoordinatePage(query) {
  return request.post(`/base/semiAutomation/getBaseCoordinatePage`,query)
}

// 根据控制器查控制器绑定得工艺
export function getCodeByController(query) {
  return request.post(`/base/semiAutomation/getCodeByController`,query)
}

// 编辑坐标系(增加，删除，修改)
export function editBaseCoordinate(query) {
  return request.post(`/base/semiAutomation/editBaseCoordinate`,query)
}

// 分页查询设备治具RFID页面
export function getBaseEquipmentRfidPage(query) {
  return request.post(`/base/semiAutomation/getBaseEquipmentRfidPage`,query)
}

// 编辑设备治具(增加，删除，修改)
export function editBaseEquipmentRfid(query) {
  return request.post(`/base/semiAutomation/editBaseEquipmentRfid`,query)
}

// 绑定、解绑RFID
export function fixOrUnbindRfid(query) {
  return request.post(`/base/semiAutomation/fixOrUnbindRfid`,query)
}

// 分页查询CNC刀库对应刀具
export function getBaseCncToolPage(query) {
  return request.post(`/base/semiAutomation/getBaseCncToolPage`,query)
}

// 编辑CNC刀库对应刀具(增加，删除，修改)
export function editBaseCncTool(query) {
  return request.post(`/base/semiAutomation/editBaseCncTool`,query)
}

// 分页CNC电极半自动化页面
export function getBaseCncEleSemiAutomaticPage(query) {
  return request.post(`/base/semiAutomation/getBaseCncEleSemiAutomaticPage`,query)
}

// 分页CNC电极半自动化页面
export function getSteelBindRfidPage(query) {
  return request.post(`/base/semiAutomation/getSteelBindRfidPage`,query)
}

// 机床治具RFID获取设备使用信息
export function getBaseEqUseByEqRfid(query) {
  return request.post(`/base/semiAutomation/getBaseEqUseByEqRfid`,query)
}

// 完成工件/RFID绑定
export function completeBinding(query) {
  return request.post(`/base/semiAutomation/completeBinding`,query)
}

// 解除绑定
export function doUnBinding(query) {
  return request.post(`/base/semiAutomation/doUnBinding`,query)
}

// 检查（工件/RFID）是否可以绑定
export function checkTheStatusOfTheWorkpiece(query) {
  return request.post(`/base/semiAutomation/checkTheStatusOfTheWorkpiece`,query)
}

// （工件/RFID）获取电极信息
export function getBaseElectrodeByWorkpieceOrEleRfid(query) {
  return request.post(`/base/semiAutomation/getBaseElectrodeByWorkpieceOrEleRfid`,query)
}

// （工件/RFID）获取电极信息
export function getBaseElectrodeByRfid(query) {
  return request.post(`/base/semiAutomation/getBaseElectrodeByRfid`,query)
}

//  删除已经取消的电极任务
export function deleteTheCanceledElectrodes(query) {
  return request.post(`/base/semiAutomation/deleteTheCanceledElectrodes`,query)
}


// 开始
export function startProduct(query) {
  return request.post(`/base/semiAutomation/start`,query)
}

// 未完成报工
export function incompleteWorkReport(query) {
  return request.post(`/base/semiAutomation/incompleteWorkReport`,query)
}

// 完工
export function finishProduct(query) {
  return request.post(`/base/semiAutomation/finish`,query)
}


// 工单完成比例
export function workOrderCompletionRatio(query) {
  return request.post(`/base/semiAutomation/workOrderCompletionRatio`,query)
}

// 恢复
export function recoveryProduct(query) {
  return request.post(`/base/semiAutomation/recovery`,query)
}

/* export function dlFile(query) {
  request.post(`/base/semiAutomation/dlFile`,query)
} */

export function downloadlFileToMachine(query) {
  return request.post(`/base/semiAutomation/downloadlFileToMachine`,query)
}

export function checkParamStatus(query) {
  return request.post(`/base/semiAutomation/checkParamStatus`,query)
}

export function startDeviceCommand(query) {
  return request.post(`/base/semiAutomation/startDeviceCommand`,query)
}

// 下载
export function dlFile(query) {
  return updownloadrequest({
    method: 'POST',
    url: '/base/semiAutomation/dlFile',
    data: query,
  })
} 

// 上报显示机床文件列表(IOT)
export function electrodeIot(query) {
  return iotRequest.post(`/iot/iot/electrodeIot`,query)
}

// 请求对机床的文件夹操作(IOT)
export function operationFolder(query) {
  return iotRequest.post(`/iot/iot/operationFolder`,query)
}

// 请求文件从平台下载到机床FTP(IOT)
export function downloadLathe(query) {
  return iotRequest.post(`/iot/iot/download`,query)
}

// 请求文件从平台下载到机床(IOT)
export function downloadFTP(query) {
  return iotRequest.post(`/iot/iot/downloadFTP`,query)
}

//请求对机床加工相关控制
export function firing(query) {
  return iotRequest.post(`/iot/iot/firing`,query)
}

// // 下载
// export function dlFile(query) {
//   return request({
//     method: 'POST',
//     url: '/base/semiAutomation/dlFile',
//     data: query,
//   })
// }
//
// // 上报显示机床文件列表(IOT)
// export function electrodeIot(query) {
//   return request.post(`/iot/iot/electrodeIot`,query)
// }
//
// // 请求对机床的文件夹操作(IOT)
// export function operationFolder(query) {
//   return request.post(`/iot/iot/operationFolder`,query)
// }
//
// // 请求文件从平台下载到机床(IOT)
// export function downloadLathe(query) {
//   return request.post(`/iot/iot/download`,query)
// }
//
//请求对机床加工相关控制
// export function firing(query) {
//   return request.post(`/iot/iot/firing`,query)
// }
// 请求文件从平台下载到机床FTP(IOT)
// export function downloadFTP(query) {
//   return request.post(`/iot/iot/downloadFTP`,query)
// }

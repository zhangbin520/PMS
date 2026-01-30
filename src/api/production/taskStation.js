import request from "../../utils/request";

// 分页查询工件加工任务列表
export function listTaskStation(query) {
  return request.post(`/prod/task/getProdWorkTaskPage`,query)
}

// 接收
export function receiveTaskStation(data) {
  return request.post(`/prod/task/receive`,data)
}

// 操作历史
export function getProdWorkOperationHisPage(data) {
  return request.post(`/prod/task/getProdWorkOperationHisPage`,data)
}

// 上道工序出货数量
export function getPreviousShipmentQuantity(data) {
  return request.post(`/prod/task/getPreviousShipmentQuantity`,data)
}

// 退回
export function returnWorkpiece(data) {
  return request.post(`/prod/task/returnWorkpiece`,data)
}

// 分页查询设备待加工列表
export function listEquipmentWaitPage(query) {
  return request.post(`/prod/task/getProdEquipmentWaitPage`,query)
}

// 领取加工任务
export function receiveProcessingTask(data) {
  return request.post(`/prod/task/receiveProcessingTask`,data)
}

// 分页查询报工终端-已领取
export function getProdWorkReceivedPage(data) {
  return request.post(`/prod/task/getProdWorkReceivedPage`,data)
}

// 开工
export function startMachining(data) {
  return request.post(`/prod/task/startMachining`,data)
}

// 暂停
export function stopMachining(data) {
  return request.post(`/prod/work/edit`,data)
}

// 恢复
export function recovery(data) {
  return request.post(`/prod/task/recovery`,data)
}

// 完工
export function prodWorkOperation(data) {
  return request.post(`/prod/task/prodWorkOperation`,data)
}

// 分页查询报工终端-已完成
export function getProdWorkFinishPage(data) {
  // return request.post(`/prod/task/getProdWorkFinishPage`,data)
  return request({
    method:'POST',
    url:'/prod/task/getProdWorkFinishPage',
    data:data,
    timeout: 180 * 1000,
  })
}

// 合并出货
export function consolidatedShipment(data) {
  return request.post(`/prod/work/consolidatedShipment`,data)
}

// 钢件程式单
export function getCamProgramSheet(data) {
  return request.post(`/prod/task/getCamProgramSheet`,data)
}

// 钢件分条程序列表
export function getCamProgramSheetList(data) {
  return request.post(`/prod/task/getCamProgramSheetList`,data)
}

// 放电参数
export function dischargeParameters(data) {
  return request.post(`/prod/task/dischargeParameters`,data)
}

// 电火花加工位置
export function getCamElectricSparkList(data) {
  return request.post(`/prod/task/getCamElectricSparkList`,data)
}

// 电极程式单
export function getCamEleProgramSheet(data) {
  return request.post(`/prod/task/getCamEleProgramSheet`,data)
}

// 电极分条程序列表
export function getCamEleProgramSheetList(data) {
  return request.post(`/prod/task/getCamEleProgramSheetList`,data)
}

// 异常工件
export function getAbnormalWorkpiece(data) {
  return request.post(`/prod/task/abnormalWorkpiece`,data)
}

// 暂停、报工
export function changeWorkReportingMethod(data) {
  return request.post(`/prod/task/changeWorkReportingMethod`,data)
}

// RFID获取周转筐
export function rfidTurnoverBasket(data) {
  return request.post(`/rdid/setting/rfidTurnoverBasket`,data)
}

// 获取 RFID 和周转筐
export function gerRfidTurnoverBasket(data) {
  return request.post(`/rdid/setting/gerRfidTurnoverBasket`,data)
}

// 出货
export function shipment(data) {
  return request.post(`/prod/task/shipment`,data)
}

// 待选设备列表
export function waitEquipment(data) {
  return request.post(`/prod/task/waitEquipment`,data)
}

// 更换设备
export function batchReplaceEquipment(data) {
  return request.post(`/prod/task/batchReplaceEquipment`,data)
}

// 导出我完成的加工任务列表
export function exportProdRecord(data) {
  return request.post(`/prod/task/export`,data)
}

// 生管设置工段状态
export function tubeSetSectionStatus(data) {
  return request.post(`/prod/task/tubeSetSectionStatus`,data)
}

// 查询电极在库
export function listElectrodeMange(query) {
  return request({
    url: '/jy/electrodeMange/all',
    method: 'get',
    params: query
  })
}

// 电极在库保存
export function saveElectrodeMange(query) {
  return request({
    url: '/jy/electrodeMange/opt',
    method: 'post',
    data: query
  })
}

//一键报工
export function forceOneButtonWorkReporting(data) {
  return request.post(`/prod/task/forceOneButtonWorkReporting`,data)
}

//一键报工(钢件)
export function forceOneButtonWorkReportingBySteelParts(data) {
  return request.post(`/prod/task/forceOneButtonWorkReportingBySteelParts`,data)
}

import request from '../../../utils/request'

// 分页查询电极加工
export function listElectrodeProcess(query) {
  return request.post(`/prod/electrodeProcess/getProdElectrodeProcessPage`,query)
}

// CNC档案和参数查看
export function listArchiveQueryCnc(query) {
  return request.post(`/prod/electrodeProcess/getArchiveQueryCncPage`,query)
}

// EDM档案和参数查看
export function listArchiveQueryEdm(query) {
  return request.post(`/prod/electrodeProcess/getArchiveQueryEdmPage`,query)
}
// CMM量测查看
export function listArchiveQueryCmm(query) {
  return request.post(`/prod/electrodeProcess/getArchiveQueryCmmPage`,query)
}
// 钢件量测结果查看
export function listCmmMeasureResultPageData(query) {
  return request.post(`/cmm/cmm/getCmmMeasureResultPage`,query)
}
// 将工件/电极数据发送给自动化
export function sendEdmDataToAuto(query) {
  return request.post(`/prod/electrodeProcess/sendEdmDataToAuto`,query)
}

// 将工件/电极数据开工 or 完工
export function autoDataStartOrComplete(query) {
  return request.post(`/prod/electrodeProcess/autoDataStartOrComplete`,query)
}
// EDM档案导出
export function getEdmProcessList(query) {
  return request.post(`/prod/electrodeProcess/getEdmProcessList`,query)
}
// EDM自动化list
export function getEdmAutoList(query) {
  return request.post(`/prod/electrodeProcess/getEdmAutoPageList`,query)
}

// 查看工件图档
export function selectSteelFile(query) {
  return request.post(`/prod/electrodeProcess/selectSteelFile`,query)
}
// CNC档案和参数查看钢件刀具
export function listSheetData(query) {
  return request.post(`/prod/electrodeProcess/selectSheetData`,query)
}
// CNC档案和参数查看电极刀具
export function listElectrodeCutData(query) {
  return request.post(`/prod/electrodeProcess/selectElectrodeCutData`,query)
}

// 查看程序单
export function getProcedureSheet(query) {
  return request.post(`/prod/electrodeProcess/getProcedureSheet`,query)
}



import request from '../../utils/request'

// 分页查询电极BOM
export function listElectrodeBom(query) {
  return request.post(`/cam/electrodeBom/getCamElectrodeBomPage`,query)
}

// 分页查询电极BOM
export function getElectrodeBomlist(query) {
  return request.post(`/cam/electrodeBom/getElectrodeBomlist`,query)
}

// 新增电极BOM
export function addElectrodeBom(query) {
  return request.post(`/cam/electrodeBom/saveOrUpdateCamElectrodeBom`,query)
}

// 复用已选择的电极数据
export function reuseElectrodeData(query) {
  return request.post(`/cam/electrodeBom/reuseElectrodeData`,query)
}
// 检查所有复用电极数据
export function checkAllMultiplexedElectrodeData(query) {
  return request.post(`/cam/electrodeBom/checkAllMultiplexedElectrodeData`,query)
}

// 编辑电极BOM
export function updateElectrodeBom(query) {
  return request.post(`/cam/electrodeBom/saveOrUpdateCamElectrodeBom`,query)
}

// 电极BOM批量删除
export function deleteElectrodeBom(query) {
  return request.post(`/cam/electrodeBom/batchChangeElectrodeBom`,query)
}

// 电极BOM批量转生产单
export function electrodeBomTurn(query) {
  return request.post(`/cam/electrodeBom/batchChangeElectrodeBom`,query)
}

// 分页查询电极Process工艺
export function listElectrodeCrafts(query) {
  return request.post(`/process/manHour/getProcessManHourPage`,query)
}

// 保存电极Process工艺
export function saveElectrodeCrafts(query) {
  return request.post(`/cam/electrodeProcess/saveOrUpdateCamElectrodeProcess`,query)
}

// 分页查询电极Process工艺
export function listElectrode(query) {
  return request.post(`/cam/electrodeProcess/getCamElectrodeProcessPage`,query)
}

// 已转生产单取消按钮
export function alreadyCancel(query) {
  return request.post(`/cam/electrodeBom/batchChangeElectrodeBom`,query)
}

// 分页查询变更订单list 
export function selectChangeOrderList(query) {
  return request.post(`/cam/electrodeBom/selectChangeOrderList`,query)
}


// 删除电极bom工艺
export function delCamElectrodeProcess(query) {
  return request.post(`/cam/electrodeProcess/delCamElectrodeProcess`,query)
}

// 导入电极明细
export function importElectrodeBom(data) {
  return request.post(`/cam/electrodeBom/importElectrodeBom`,data)
}

// 下载模板
export function importTemplate() {
  return request.post(`/cam/electrodeBom/importTemplate`)
 }

// 根据生产单号分页查询bom工艺
export function getOrderBomProcessByProdOrderNoPage(data) {
  return request.post(`/order/process/getOrderBomProcessByProdOrderNoPage`,data)
}

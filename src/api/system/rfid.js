import request from '../../utils/request'

// 分页获取周转筐
export function listBasketRfid(query) {
  return request.post(`/rdid/turnoverBasket/getRfidTurnoverBasketPage`,query)
}

// 新增周转筐
export function addBasketRfid(query) {
  return request.post(`/rdid/turnoverBasket/saveOrUpdateRfidTurnoverBasket`,query)
}

// 修改周转筐
export function updateBasketRfid(query) {
  return request.post(`/rdid/turnoverBasket/saveOrUpdateRfidTurnoverBasket`,query)
}

// 报废周转筐
export function deleteBasketRfid(query) {
  return request.post(`/rdid/turnoverBasket/scrapRfidTurnoverBasket`,query)
}

// 分页查询RFID
export function listRfid(query) {
  return request.post(`/rdid/setting/getRfidSettingPage`,query)
}

// 新增RFID
export function addListRfid(query) {
  return request.post(`/rdid/setting/saveOrUpdateRfidSetting`,query)
}

// 删除RFID
export function deleteListRfid(query) {
  return request.post(`/rdid/setting/delRfidSetting`,query)
}

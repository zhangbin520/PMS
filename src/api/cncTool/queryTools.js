import request from '@/utils/request'

//分页查询刀具管理记录
export function getOrderToolCostReordPage(query) {
  return request.post(`/order/cost-reord/getOrderToolCostReordPage`,query)
}

//禁止
export function prohibit(query) {
  return request.post(`/order/cost-reord/prohibit`,query)
}

//发送
export function cncToolsend(query) {
  return request.post(`/order/cost-reord/send`,query)
}

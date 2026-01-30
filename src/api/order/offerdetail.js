import request from '../../utils/request'

// 查询报价明细
export function quotationDetails(query) {
  return request.post(`/order/bom/quotationDetails`,query)
}

// 导出报价明细
export function exportQuotationDetails(query) {
  return request.post(`/order/bom/exportQuotationDetails`,query)
}

// 修改客户报价成本
export function editOrderBomCustomerCost(query) {
  return request.post(`/order/bom/editOrderBomCustomerCost`,query)
}

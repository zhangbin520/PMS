import request from '@/utils/request'

//分页查询刀具品牌
export function getOrderToolCostBrandPage(query) {
  return request.post(`/order/cost-brand/getOrderToolCostBrandPage`,query)
}

//新增修改刀具品牌
export function saveOrUpdateOrderToolCostBrand(query) {
  return request.post(`/order/cost-brand/saveOrUpdateOrderToolCostBrand`,query)
}

//批量删除刀具品牌
export function delOrderToolCostBrand(query) {
  return request.post(`/order/cost-brand/delOrderToolCostBrand`,query)
}

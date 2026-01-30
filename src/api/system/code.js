import request from '../../utils/request'

// 获取编码规则
export function listCode(query) {
  return request.post(`/coding/rules/getCodingRulesPage`,query)
}

// 查询编码规则
export function getListCode(query) {
  return request.post(`/coding/rules/getCodingRules`,query)
}

// 新增编码规则
export function addListCode(query) {
  return request.post(`/coding/rules/saveOrUpdateCodingRules`,query)
}

// 修改编码规则
export function updateListCode(query) {
  return request.post(`/coding/rules/saveOrUpdateCodingRules`,query)
}

// 根据业务类型生成编码
export function creatListCode(query) {
  return request.post(`/coding/rules/getCodingRulesByBizType`,query)
}

// 根据业务类型生成编码
export function checkCodingRules(query) {
  return request.post(`/coding/rules/checkCodingRules`,query)
}

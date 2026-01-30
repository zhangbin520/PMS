import request from '../../utils/request'

// 查询客户信息列表
export function listCustomer(query) {
  return request.post(`/customer/info/getCustomerInfoPage`,query)
}

// 查询客户信息详细
export function getCustomer(query) {
  return request.post('/customer/info/getCustomerInfo',query)
}

// 新增客户信息列表
export function addCustomer(query) {
  return request.post(`/customer/info/saveOrUpdateCustomer`,query)
}

// 修改客户信息列表
export function updateCustomer(query) {
  return request.post(`/customer/info/saveOrUpdateCustomer`,query)
}

// 删除客户信息
export function delCustomer(query) {
  return request.post('/customer/info/delCustomerInfo',query)
}

// 查询客户联系人列表
export function listContact(query) {
  return request.post('/customer/contacts/getCustomerContactsList',query)
}

// 查询联系人信息详细
export function getContact(query) {
  return request.post('/customer/contacts/getCustomerContacts',query)
}

// 新增客户联系人列表
export function addContact(query) {
  return request.post('/customer/contacts/saveOrUpdateCustomerContacts',query)
}

// 修改客户联系人列表
export function updateContact(query) {
  return request.post('/customer/contacts/saveOrUpdateCustomerContacts',query)
}

// 删除客户联系人列表
export function delContact(query) {
  return request.post('/customer/contacts/delCustomerContacts',query)
}

// 根据联系人名称查询联系人id
export function selectCustomerContacts(query) {
  return request.post('/customer/contacts/selectCustomerContacts',query)
}

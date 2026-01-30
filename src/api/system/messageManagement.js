import messageRequest from '@/utils/messageRequest'

//  批量删除版本记录
export function deleteSystemeRecord(query) {
  return messageRequest().post(`/system/del/batch`,query)
}

// 分页查询版本记录列表
export function saveSystem(query) {
  return messageRequest({
    url: '/system/saveContent',
    method: 'post',
    params: query
  })
}

// 分页查询版本记录列表
export function systemPage(query) {
  return messageRequest({
    url: '/system/page',
    method: 'get',
    params: query
  })
}

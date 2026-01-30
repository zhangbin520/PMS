import messageRequest from '@/utils/messageRequest'
import request from '@/utils/request'

//  批量删除版本记录
export function deleteVersionRecord(query) {
  return messageRequest().post(`/version/del/batch`,query)
}

// // 新增修改版本记录
// export function saveVersion(query) {
//   return messageRequest().post(`/version/saveContent`,query)
// }

// 分页查询版本记录列表
export function saveVersion(query) {
  return messageRequest({
    url: '/version/saveContent',
    method: 'post',
    params: query
  })
}

// 分页查询版本记录列表
export function versionPage(query) {
  return messageRequest({
    url: '/version/page',
    method: 'get',
    params: query
  })
}

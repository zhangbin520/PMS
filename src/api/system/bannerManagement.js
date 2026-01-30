import messageRequest from '@/utils/messageRequest'

//  批量删除版本记录
export function deleteBanner(query) {
  return messageRequest().post(`/banner/del/batch`,query)
}

// 分页查询版本记录列表
export function saveBanner(query) {
  return messageRequest({
    url: '/banner/saveContent',
    method: 'post',
    params: query
  })
}

// 分页查询版本记录列表
export function bannerPage(query) {
  return messageRequest({
    url: '/banner/page',
    method: 'get',
    params: query
  })
}

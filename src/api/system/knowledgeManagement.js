import messageRequest from '@/utils/messageRequest'

//  批量删除版本记录
export function deleteKnowledgeRecord(query) {
  return messageRequest().post(`/knowledge/del/batch`,query)
}

// 分页查询版本记录列表
export function saveKnowledge(query) {
  return messageRequest({
    url: '/knowledge/saveContent',
    method: 'post',
    params: query
  })
}

// 分页查询版本记录列表
export function knowledgePage(query) {
  return messageRequest({
    url: '/knowledge/page',
    method: 'get',
    params: query
  })
}

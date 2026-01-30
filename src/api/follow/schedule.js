import request from '@/utils/request'

// 导出报工记录
export function exportWorkRecord(query) {
  return request.post(`/prod/schedule/export`,query)
}

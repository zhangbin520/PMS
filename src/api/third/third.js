import request from '../../utils/request'

// 分页查询版本记录列表
export function knowledgePage(query) {
  return request({
    url: '/knowledge/page',
    method: 'get',
    params: query
  })
}


//  批量删除版本记录
export function deleteSystemeRecord(query) {
   return request.post(`/system/del/batch`,query)
}

// 分页查询版本记录列表
export function saveSystem(query) {
  return request.post(`/system/saveContent`,query)
}

// 分页查询版本记录列表
export function systemPage(query) {
  return request({
    url: '/system/page',
    method: 'get',
    params: query
  })
}

export function saveContent(query){
         return request.post(`/system/saveContent`,query)
 }


 // 分页查询版本记录列表
 export function saveVersion(query) {
   return request({
     url: '/version/saveContent',
     method: 'post',
     params: query
   })
 }
 
 // 分页查询版本记录列表
 export function versionPage(query) {
   return request({
     url: '/version/page',
     method: 'get',
     params: query
   })
 }

 // 删除电极物料盘库记录
    export function delVersion(id) {
      return request({
        url: '/version/' + id,
        method: 'delete'
      })
    }


    





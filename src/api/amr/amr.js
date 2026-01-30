import amrRequest from '@/utils/amrRequest'
import request from '@/utils/request'


// 获取amr列表
export function amrGetList() {
  return amrRequest({
    url: '/api/fexa/v1/external/car/list',
    method: 'get',
  })
}

//根据AMR id 查询AMR详情
// export function amrIdGetList(data) {
//   return amrRequest({
//     url: '/api/fexa/v1/external/car/findById?key=AIS7ER83RJDFU92ERF',
//     method: 'get',
//     data
//   })
// }

//根据AMR名称查询AMR详情
// export function amrNameGetList(data) {
//   return amrRequest({
//     url: '/api/fexa/v1/external/car/findByName?key=AIS7ER83RJDFU92ERF',
//     method: 'get',
//     data
//   })
// }

//查询调度任务执行情况
// export function taskstatus(data) {
//   return amrRequest({
//     url: '/api/fexa/v1/external/dispatch/findById?key=AIS7ER83RJDFU92ERF',
//     method: 'get',
//     data
//   })
// }

// 任务请求
export function taskRequest(query) {
  return amrRequest.post(`/api/fexa/v1/external/dispatch/createTask`,query)
}

// 任务请求lx新
export function taskLxRequest(query) {
  return amrRequest.post(`/api/fexa/v1/external/lx/dispatch/createTask`,query)
}

// 暂停调度任务
export function pauseDispatch(query) {
  return amrRequest.post(`/api/fexa/v1/external/dispatch/pause`,query)
}

//继续调度任务
export function continueDispatch(query) {
  return amrRequest.post(`/api/fexa/v1/external/dispatch/continue`,query)
}

//终止调度任务
export function stopDispatch(query) {
  return amrRequest.post(`/api/fexa/v1/external/dispatch/stop`,query)
}

//AMR 前往最近的等待点
export function goIdleDispatch(query) {
  return amrRequest.post(`/api/fexa/v1/external/dispatch/goIdle`,query)
}

//AMR 前往最近的休息点
export function goRestingDispatch(query) {
  return amrRequest.post(`/api/fexa/v1/external/dispatch/goResting`,query)
}

//AMR 前往充电
export function goChargeDispatch(query) {
  return amrRequest.post(`/api/fexa/v1/external/dispatch/goCharge`,query)
}

//更新点位的物料信息
export function updateThingsPoints(query) {
  return amrRequest.post(`/api/fexa/v1/external/points/updateThings`,query)
}

//点位外部请求占用
export function setPointBusyPoints(query) {
  return amrRequest.post(`/api/fexa/v1/external/points/setPointBusy`,query)
}


//分页查询点位
export function getBasePointPage(query) {
  return request.post(`/base/base-point/getBasePointPage`,query)
}

//编辑点位(增加，修改)
export function editBasePoint(query) {
  return request.post(`/base/base-point/editBasePoint`,query)
}

//删除点位
export function delBasePoint(query) {
  return request.post(`/base/base-point/delBasePoint`,query)
}

//绑料
export function binding(query) {
  return request.post(`/base/base-agv/binding`,query)
}

//解绑
export function unbinding(query) {
  return request.post(`/base/base-agv/unbinding`,query)
}

//根据车号查询已绑定的电极
export function getBaseElectrodeAutoPage(query) {
  return request.post(`/base/base-electrode-auto/getBaseElectrodeAutoPage`,query)
}

//电极自动化发送
export function semiAutosend(query) {
  return request.post(`/base/base-electrode-auto/send`,query)
}

//机床开关门
export function opDoor(query) {
  return request.post(`/iot/iot/opDoor`,query)
}

//机床开关门
export function stopSemiAuto(query) {
  return request.post(`/base/base-agv/stop`,query)
}

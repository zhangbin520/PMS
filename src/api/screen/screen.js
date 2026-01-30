import request from '../../utils/request'
import bannerRequest from '@/utils/bannerRequest'

export function dailyOutputIndex(query) {
  return bannerRequest.post(`/prod/bulletinBoard/dailyOutputIndex`,query)
}

export function dailyOutputDept(query) {
  return bannerRequest.post(`/prod/bulletinBoard/dailyOutputDept`,query)
}

export function cropMovementIndex(query) {
  return bannerRequest.post(`/prod/bulletinBoard/cropMovementIndex`,query)
}

export function cropMovementDept(query) {
  return bannerRequest.post(`/prod/bulletinBoard/cropMovementDept`,query)
}

// export function dailyOutputIndex(query) {
//   return request.post(`/prod/bulletinBoard/dailyOutputIndex`,query)
// }
//
// export function dailyOutputDept(query) {
//   return request.post(`/prod/bulletinBoard/dailyOutputDept`,query)
// }
//
// export function cropMovementIndex(query) {
//   return request.post(`/prod/bulletinBoard/cropMovementIndex`,query)
// }
//
// export function cropMovementDept(query) {
//   return request.post(`/prod/bulletinBoard/cropMovementDept`,query)
// }

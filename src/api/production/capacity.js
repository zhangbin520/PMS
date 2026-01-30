import request from '@/utils/request'

export function getCapacityData() {
  return request({
    method: 'get',
    url: '/Capacity'
  })
}

export function getDaliyEnergy() {
  return request({
    method: 'get',
    url: '/Capacity/GetDaliyEnergy'
  })
}

export function getFocusData() {
  return request({
    method: 'get',
    url: '/Capacity/GetFocusData'
  })
}

export function getAssignWork() {
  return request({
    method: 'get',
    url: '/Capacity/GetAssignWork'
  })
}


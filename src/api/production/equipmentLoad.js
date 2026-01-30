import request from "../../utils/request";

// 分页查询工件加工任务列表
export function equipmentLoad(query) {
  return request.post(`/prod/schedule/equipmentLoad`,query)
}

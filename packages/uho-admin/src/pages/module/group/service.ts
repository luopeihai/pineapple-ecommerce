import request from '@/utils/request';
import { queryListParams, createState, updateState } from './data.d';

/**
 *
 * @param params 查询参数
 * @return Promise
 */
export async function queryGroup(params: queryListParams): Promise<any> {
  return request('/config/group', { params }).then((res) => ({
    data: res.data.list,
    page: res.data.pageSize,
    success: res.code === 200,
    total: res.data.total,
  }));
}

/**
 *
 * @param params 创建 组别
 */
export async function createGroup(params: createState): Promise<any> {
  return request(`/config/group`, { method: 'POST', data: params });
}

/**
 *
 * @param params 更新 组别
 */
export async function updateGroup(params: updateState): Promise<any> {
  return request(`/config/group`, { method: 'PUT', data: params });
}

/**
 * 删除组别
 * @param groupId 关联关系id，非组别或模块id
 *
 */

export async function deleteGroup(groupId: number): Promise<any> {
  return request(`/config/group/${groupId}`, { method: 'DELETE' });
}

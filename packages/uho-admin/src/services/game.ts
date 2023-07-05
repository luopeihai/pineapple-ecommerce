import request from '@/utils/request';
import {
  queryListParams,
  EditSortState,
  EditGroupSortState,
  CreateState,
  UpdateState,
  createGroupState,
  queryGroupListByModuleIdParams,
  GameItem,
  GroupItem,
} from '@/data/game.d';

/**
 *
 * @param params 查询参数
 * @return Promise
 */
export async function queryGame(params: queryListParams): Promise<any> {
  return request('/config/module/listModule', { params }).then((res) => ({
    data: res.data.list,
    page: res.data.pageSize,
    success: res.code === 200,
    total: res.data.total,
  }));
}

export async function createGame(params: CreateState): Promise<any> {
  return request(`/config/module`, { method: 'POST', data: params });
}

export async function updateGame(params: UpdateState): Promise<any> {
  return request(`/config/module/update`, { method: 'PUT', data: params });
}

export async function getDetailById(moduleId: number): Promise<any> {
  return request(`/config/module/${moduleId}`);
}

export async function editSort(params: EditSortState): Promise<any> {
  return request(`/config/module/editSort`, { method: 'PUT', data: params });
}

/**
 *
 * @param moduleId 游戏id
 * @return Promise
 */
export async function deleteGame(moduleId: number): Promise<any> {
  return request(`/config/module/${moduleId}`, { method: 'DELETE' });
}

/**
 * 在游戏详情下 查组别
 * @param params 查询参数
 * @return Promise
 */
export async function queryGroupByModuleId(params: queryGroupListByModuleIdParams): Promise<any> {
  return request('/config/module/listModuleGroup', { params }).then((res) => ({
    data: res.data,
    success: res.code === 200,
  }));
}

/**
 *
 * @param params 创建 模块下的组别
 */
export async function createGameGroup(params: createGroupState): Promise<any> {
  return request(`/config/module/addModuleGroup`, { method: 'POST', data: params });
}

/**
 * 删除模块下关联的组别
 * @param moduleGroupId 关联关系id，非组别或模块id
 *
 */

export async function deleteGameGroup(moduleGroupId: number): Promise<any> {
  return request(`/config/module/deleteModuleGroup/${moduleGroupId}`, { method: 'DELETE' });
}

export async function createListModuleWithGroup(params): Promise<any> {
  return request('/config/module/listModuleWithGroup', { params }).then((res) => ({
    data: res.data.list,
    page: res.data.pageSize,
    success: res.code === 200,
    total: res.data.total,
  }));
}

export async function editGroupSort(params: EditGroupSortState): Promise<any> {
  return request(`/config/module/editLinkSort`, { method: 'PUT', data: params });
}

export function getModuleBymoduleId(moduleId: number): GameItem {
  //获取localStorage module list
  const moduleList = JSON.parse(localStorage.getItem('moduleList')) || [];

  const moduleItem = moduleList.find((item) => item.moduleId === moduleId);

  return moduleItem ? moduleItem : { moduleName: '' };
}

export function getGroupByGroupId(groupId: number): GroupItem {
  //获取localStorage module list
  const groupList = JSON.parse(localStorage.getItem('groupList')) || [];
  const gorupItem = groupList.find((item) => item.groupId === groupId);
  return gorupItem ? gorupItem : { groupName: '' };
}

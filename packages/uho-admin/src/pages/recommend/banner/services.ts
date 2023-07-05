import request from '@/utils/request';

import {
  queryListParams,
  createParams,
  updateParams,
  deleteParams,
  updateBannerSortParams,
} from './data.d';

export async function queryList(params: queryListParams): Promise<any> {
  return request('/config/banner/listBanner', {
    params,
  }).then((res) => ({
    data: res.data.list,
    page: res.data.pageSize,
    success: res.code === 200,
    total: res.data.total,
  }));
}

export async function create(params: createParams): Promise<any> {
  return request('/config/banner', {
    method: 'post',
    data: params,
  });
}

export async function update(params: updateParams): Promise<any> {
  return request('/config/banner', {
    method: 'put',
    data: params,
  });
}

export async function updateBannerSort(params: updateBannerSortParams): Promise<any> {
  return request('/config/banner/updateBannerSort', {
    method: 'put',
    data: params,
  });
}

export async function deleteItem({ moduleId, bannerId }: deleteParams): Promise<any> {
  return request(`/config/banner/${moduleId}/${bannerId}`, {
    method: 'delete',
  });
}

export async function getDetail(bannerId: number): Promise<any> {
  return request(`/config/banner/${bannerId}`);
}

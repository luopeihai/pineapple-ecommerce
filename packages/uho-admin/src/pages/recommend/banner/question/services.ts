import request from '@/utils/request';

import { queryListParams, createParams, deleteParams } from './data.d';

export async function queryList(params: queryListParams): Promise<any> {
  return request('/config/banner/listBannerQuestion', {
    params,
  }).then((res) => ({
    data: res.data.list,
    page: res.data.pageSize,
    success: res.code === 200,
    total: res.data.total,
  }));
}

export async function create(params: createParams): Promise<any> {
  return request('/config/banner/addQuestionToBanner', {
    method: 'post',

    data: params,
  });
}

export async function deleteItem(params: deleteParams): Promise<any> {
  return request(`/config/banner/removeQuestionFromBanner/${params.bannerId}/${params.mainId}`, {
    method: 'delete',
  });
}

export async function editSort(params: { mainId: number; sort: number }): Promise<any> {
  return request('/config/banner/updateBannerQuestionSort', {
    method: 'put',
    data: params,
  });
}

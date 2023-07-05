import request from '@/utils/request';
import { QuestionTableListParams, editParams } from './data.d';

//获取推荐列表
export async function queryQuestion(params?: QuestionTableListParams) {
  return request('/community/question/listRecommend', {
    params,
  }).then(function (response) {
    return {
      data: response.data.list,
      page: response.data.pageSize,
      success: response.code === 200 ? true : false,
      total: response.data.total,
    };
  });
}

export async function updateRecommendSort(params: editParams) {
  return request('/community/question/updateRecommendSort', {
    method: 'put',
    data: params,
  });
}

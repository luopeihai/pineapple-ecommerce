import request from '@/utils/request';
import { QuestionTableListParams, AnswerTableListParams, CommentTableListParams } from './data.d';

//获取问题
export async function queryQuestion(params?: QuestionTableListParams) {
  return request('/community/question', {
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

//问题置顶
export async function questionTopQuestion(params: { questionId: number }) {
  return request('/community/question/topQuestion', { method: 'PUT', data: params });
}

//问题是否被推荐
export async function questionCheckRecommend(questionId: string) {
  return request(`/community/question/checkRecommend/${questionId}`);
}

//问题取消置顶
export async function questionCancelTopQuestion(params: { questionId: number }) {
  return request('/community/question/cancelTopQuestion', { method: 'PUT', data: params });
}

//问题审核 通过
export async function questionPassReview(params) {
  return request('/community/question/passReview', { method: 'PUT', data: params });
}

//问题添加到推荐页
export async function setRecommendedQuestion(params) {
  return await request('/community/question/recommendedQuestion', { method: 'PUT', data: params });
}

//问题取消推荐
export async function setCancelRecommendedQuestion(questionId) {
  return await request(`/community/question/cancelRecommendedQuestion/${questionId}`, {
    method: 'DELETE',
  });
}

//删除 问题
export async function questionDeleted(questionId: number) {
  return request(`/community/question/${questionId}`, { method: 'DELETE' });
}

//获取答案list
export async function queryAnswer(params?: AnswerTableListParams) {
  return await request('/community/answer', {
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

//删除 问题
export async function answerDeleted(answerId: number) {
  return request(`/community/answer/${answerId}`, { method: 'DELETE' });
}

//审核 问题 通过
export async function answerPassReview(params) {
  return request(`/community/answer/passReview`, { method: 'PUT', data: params });
}

export async function acceptAnswer(params) {
  return request(`/community/answer/acceptAnswer`, { method: 'PUT', data: params });
}

//获取评论list
export async function queryComment(params?: CommentTableListParams) {
  return await request('/community/comment', {
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

//删除 问题
export async function commentDeleted(commentId: number) {
  return request(`/community/comment/${commentId}`, { method: 'DELETE' });
}

//发布评论
export async function createComment(params) {
  return request(`/community/comment`, { method: 'POST', data: params });
}

//发布答案
export async function createAnswer(params) {
  return request(`/community/answer`, { method: 'POST', data: params });
}

//发布问题
export async function createQuestion(params) {
  return request(`/community/question`, { method: 'POST', data: params });
}

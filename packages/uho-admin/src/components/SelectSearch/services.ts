import request from '@/utils/request';

export async function querySelect(url, params) {
  return request(url, params);
}

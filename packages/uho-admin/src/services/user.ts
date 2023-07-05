import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  const userInfo: string = localStorage.getItem('currentInfo');

  return request(`/user/info/${JSON.parse(userInfo).id}`);
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

//获取马甲用户
export async function getListAdminUser() {
  return request('/user/info/listAdminUser');
}

//获取用户信息
export async function getUserInfo(userId) {
  return request(`/user/info/${userId}`);
}

//禁言用户
export async function setUserBand(params) {
  return request('/user/info/setUserBand', { method: 'PUT', data: params });
}

//解禁用户
export async function setUserUnBand(params) {
  return request('/user/info/setUserUnBand', { method: 'PUT', params });
}

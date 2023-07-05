import request from '@/utils/request';
import crypto from 'crypto-js';

export interface LoginParamsType {
  phone: string;
  password: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  params.password = crypto.MD5(params.password).toString().toLowerCase();

  return request('/user/action/login', {
    method: 'POST',
    data: params,
  });
}

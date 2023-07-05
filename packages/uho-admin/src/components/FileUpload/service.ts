import request from '@/utils/request';
import { response } from 'express';

export interface OssTokenType {
  accessKeyId: string; //	阿里云oss临时凭证 accessKeyId
  accessKeySecret: string; //阿里云oss临时凭证 accessKeySecret
  securityToken: string; //阿里云oss临时凭证 securityToken
}

//获取 ossToken
export async function getOssToken() {
  return request(`/system/getOssTempToken`).then((response) => response.data);
}

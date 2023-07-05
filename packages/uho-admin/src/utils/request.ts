/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { getSignatureSha256 } from '@/utils/Signature';

const stateMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const codeMessage = {
  '-1': '服务处理异常',
  '601': '未登录或登录已过期',
  '602': '响应结果统一格式失败',
  '603': '参数错误',
  '604': '接口验签不予通过',
  '605': 'RedisLock 参数名列表和值不匹配',
  '701': '阿里云sdk错误',
  '702': '阿里云发送短信失败',
  '801': '手机号或密码错误',
  '802': '手机号已注册',
  '803': '昵称已存在',
  '804': '用户不存在',
  '805': '用户可用余额不足',
  '806': '用户已被禁言',
  '820': '用户没有登录管控台权限',
  '901': '问题已被推荐无需重复操作',
  '902': '问题已有答案被采纳或已被关闭',
  '903': '问题已有答案被采纳，不可删除',
  '904': '问题不存在或已删除',
  '905': '只可删除自己发布的问题',
  '1001': '题主不允许回答自己的问题',
  '1002': '当前用户已回答过该问题',
  '1004': '答案不存在或已删除',
  '1101': '要回复的评论不存在',
  '1102': '不能评论自己的评论',
  '1104': '评论不存在或已删除',
  '2001': '验证码错误或已过期,请核对后重试',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;

  if (response && response.status) {
    const errorText = stateMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  prefix: '/uhu/admin/api', //加api前缀
  headers: {
    platform: 'admin',
    version: '1.0',
  },
});

//请求 拦截
request.interceptors.request.use((url, options) => {
  options.headers.timestamp = new Date().getTime();

  const { headers, data, params } = options;

  //params current 换成参数 pageNum
  if (params.current) {
    params.pageNum = params.current;
    Reflect.deleteProperty(params, 'current');
  }

  //删除 pro-table form 自带属性 _timestamp
  if (params._timestamp) {
    Reflect.deleteProperty(params, '_timestamp');
  }

  const signatureParams = {
    headers: {
      platform: headers.platform,
      version: headers.version,
      timestamp: headers.timestamp,
    },
    body: data ? data : {},
    params: params,
    restful: '',
  };

  if (data) {
    signatureParams.restful = data.uhoRestful ? data.uhoRestful : '';
  }

  //签名设置
  options.headers.signature = getSignatureSha256(signatureParams);

  //and token 塞入
  const userInfoString = localStorage.getItem('currentInfo');
  if (userInfoString) {
    options.headers.token = JSON.parse(userInfoString).token;
  }

  return {
    url,
    options,
  };
});

//包一层 处理返回
async function requestUmi(url, params: { method: 'GET' }): Response {
  return await request(url, params).then(hasResponseError);
}

// 检测返回结果是否有错误
function hasResponseError(response) {
  if (response.code !== 200) {
    const message = codeMessage[response.code] || response.message;

    throw new Error(message);
  }
  return response;
}

export default requestUmi;

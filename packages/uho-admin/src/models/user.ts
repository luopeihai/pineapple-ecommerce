import { Effect, Reducer, history } from 'umi';

import { queryCurrent } from '@/services/user';

export interface CurrentUser {
  answerAcceptCount: number; //回答采纳数
  avatar: string; //头像
  coinCount: number; //uho 点
  createTime: number; //创建时间戳
  gender: number; //0：女 1:男 2:保密
  id?: number; //id
  identity: number; //身份 1:普通 2:官方
  isDeleted: boolean; //逻辑删除 1 表示删除，0 表示未删除
  memberNo?: string; //用户会员编号
  nickName: string; //用户名称
  phoneNum: string; //手机号
  qqOpenId: string; //用户名称
  state: number; //状态 :0正常，1禁言
  updateTime: number; //更新时间
  weixinOpenId?: string; //微信 open id
  currentAuthority: 'admin';
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      try {
        const response = yield call(queryCurrent);

        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      } catch (error) {
        history.replace('/user/login');
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.data || {},
      };
    },
  },
};

export default UserModel;

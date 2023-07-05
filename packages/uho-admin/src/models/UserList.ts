import { Effect, Reducer } from 'umi';
import { getListAdminUser } from '@/services/user';
import { CurrentUser as User } from './user';

export interface UserListModelState {
  userList?: Array<User>;
}

export interface UserListModelType {
  namespace: string;
  state: UserListModelState;
  effects: {
    fetch: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserListModelState>;
  };
}

const UserListModel: UserListModelType = {
  namespace: 'userList',
  state: {
    //初始状态
    userList: [],
  },
  effects: {
    *fetchUserList(_, { call, put }) {
      try {
        const response = yield call(getListAdminUser);
        yield put({
          type: 'saveList',
          userList: response.data,
        });
      } catch (error) {
        yield put({
          type: 'saveList',
          userList: [],
        });
      }
    },
  },

  reducers: {
    saveList(state, { userList }) {
      return {
        ...state,
        userList,
      };
    },
  },
};

export default UserListModel;

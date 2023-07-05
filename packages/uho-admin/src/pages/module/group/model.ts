import { Reducer, Effect } from 'umi';
import { createGroup, deleteGroup, updateGroup } from './service';
import { message as antdMessage } from 'antd';

export interface StateType {
  status?: 'ok' | 'error'; //当前状态
  message?: string; //消息
  loading: boolean; //选中账号的fu币
}

export interface GroupModelType {
  namespace: string;
  state: StateType;
  effects: {
    delete: Effect;
    editSort: Effect;
    create: Effect;
  };
  reducers: {
    createStatus: Reducer<StateType>;
    deletedStatus: Reducer<StateType>;
    editSortStatus: Reducer<StateType>;
  };
}

const GroupModel: GroupModelType = {
  namespace: 'groupList',
  state: {
    status: undefined,
    message: '',
    loading: false,
  },

  effects: {
    *create({ payload }, { call, put }) {
      try {
        //创建
        const response = yield call(createGroup, payload);
        yield put({
          type: 'createStatus',
          status: response.code === 200,
          message: response.message,
        });
      } catch (error) {
        yield put({
          type: 'createStatus',
          status: false,
          message: error.message,
        });
      }
    },
    *update({ payload }, { call, put }) {
      try {
        //创建
        const response = yield call(updateGroup, payload);
        yield put({
          type: 'updateStatus',
          status: response.code === 200,
          message: response.message,
        });
      } catch (error) {
        yield put({
          type: 'updateStatus',
          status: false,
          message: error.message,
        });
      }
    },

    *delete({ payload }, { call, put }) {
      try {
        //请求
        const response = yield call(deleteGroup, payload);
        yield put({
          type: 'deletedStatus',
          status: response.code === 200,
          message: response.message,
        });
      } catch (error) {
        yield put({
          type: 'deletedStatus',
          status: false,
          message: error.message,
        });
      }
    },
  },

  reducers: {
    createStatus(state, { status, message }) {
      if (status) {
        antdMessage.success(message);
      } else {
        antdMessage.error(message);
      }
      return {
        ...state,
        loading: status,
      };
    },
    updateStatus(state, { status, message }) {
      if (status) {
        antdMessage.success(message);
      } else {
        antdMessage.error(message);
      }
      return {
        ...state,
        loading: status,
      };
    },

    deletedStatus(state, { status, message }) {
      if (status) {
        antdMessage.success(message);
      } else {
        antdMessage.error(message);
      }

      return status
        ? {
            ...state,
            status: 'ok',
            message,
            loading: true,
          }
        : {
            ...state,
            status: 'error',
            message,
          };
    },
  },
};

export default GroupModel;

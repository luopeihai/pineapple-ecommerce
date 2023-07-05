import { Reducer, Effect } from 'umi';
import { deleteGameGroup, createGameGroup, editGroupSort } from '@/services/game';
import { message as antdMessage } from 'antd';

export interface StateType {
  status?: 'ok' | 'error'; //当前状态
  message?: string; //消息
  loading: boolean; //选中账号的fu币
}

export interface GameGroupModelType {
  namespace: string;
  state: StateType;
  effects: {
    delete: Effect;
    create: Effect;
    editGroupSort: Effect;
  };
  reducers: {
    createStatus: Reducer<StateType>;
    editSortStatus: Reducer<StateType>;
    deleteStatus: Reducer<StateType>;
  };
}

const GameGroupModel: GameGroupModelType = {
  namespace: 'gameGroupList',
  state: {
    status: undefined,
    message: '',
    loading: false,
  },

  effects: {
    *create({ payload }, { call, put }) {
      try {
        //创建
        const response = yield call(createGameGroup, payload);
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
    *delete({ payload }, { call, put }) {
      try {
        //请求
        const response = yield call(deleteGameGroup, payload);
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
    *editGroupSort({ payload }, { call, put }) {
      try {
        //请求
        const response = yield call(editGroupSort, payload);
        yield put({
          type: 'editGroupSortStatus',
          status: response.code === 200,
          message: response.message,
        });
      } catch (error) {
        yield put({
          type: 'editGroupSortStatus',
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
    editGroupSortStatus(state, { status, message }) {
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

      return {
        ...state,
        loading: status,
      };
    },
  },
};

export default GameGroupModel;

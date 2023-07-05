import { Reducer, Effect } from 'umi';
import { updateRecommendSort } from './service';
import { setRecommendedQuestion, setCancelRecommendedQuestion } from '../../post/service';

import { message as antdMessage } from 'antd';

export interface StateType {
  status?: 'ok' | 'error'; // 当前状态
  message?: string; // 消息
  loading: boolean; // 选中账号的fu币
}


export interface RecommendModelType {
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

const RecommendModel: RecommendModelType = {
  namespace: 'recommendList',
  state: {
    status: undefined,
    message: '',
    loading: false,
  },

  effects: {
    *create({ payload }, { call, put }) {
      try {
        // 创建
        const response = yield call(setRecommendedQuestion, payload);
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
    *editSort({ payload }, { call, put }) {
      try {
        // 修改排序
        const response = yield call(updateRecommendSort, payload);
        yield put({
          type: 'editSortStatus',
          status: response.code === 200,
          message: response.message,
        });
      } catch (error) {
        yield put({
          type: 'editSortStatus',
          status: false,
          message: error.message,
        });
      }
    },

    *delete({ payload }, { call, put }) {
      try {
        // 取消推荐
        const response = yield call(setCancelRecommendedQuestion, payload);
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
    editSortStatus(state, { status, message }) {
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

export default RecommendModel;

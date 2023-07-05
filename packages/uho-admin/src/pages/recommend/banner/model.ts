import { Reducer, Effect } from 'umi';
import { create, update, deleteItem, updateBannerSort, getDetail } from './services';
import { message as antdMessage } from 'antd';
import { row } from './data.d';

export interface StateType {
  status?: 'ok' | 'error'; //当前状态
  message?: string; //消息
  loading: boolean; //选中账号的fu币
  detail: row;
}

export interface bannerModelType {
  namespace: string;
  state: StateType;
  effects: {
    create: Effect;
    editSort: Effect;
    update: Effect;
    detail: Effect;
    deleteItem: Effect;
  };
  reducers: {
    createStatus: Reducer<StateType>;
    editSortStatus: Reducer<StateType>;
    updateStatus: Reducer<StateType>;
    detailStatus: Reducer<StateType>;
    deleteItemStatus: Reducer<StateType>;
  };
}

const bannerModel: bannerModelType = {
  namespace: 'bannerList',
  state: {
    status: undefined,
    message: '',
    loading: false,
    detail: {},
  },

  effects: {
    *create({ payload }, { call, put }) {
      try {
        const response = yield call(create, payload);
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
        const response = yield call(updateBannerSort, payload);
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
    *detail({ payload }, { call, put }) {
      try {
        //创建
        const response = yield call(getDetail, payload);
        let putObject = {
          type: 'detailStatus',
          status: response.code === 200,
          message: response.message,
        };

        if (putObject.status) {
          putObject.detail = response.data;
        }
        yield put(putObject);
      } catch (error) {
        yield put({
          type: 'detailStatus',
          status: false,
          message: error.message,
        });
      }
    },

    *update({ payload }, { call, put }) {
      try {
        const response = yield call(update, payload);
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

    *deleteItem({ payload }, { call, put }) {
      try {
        const response = yield call(deleteItem, payload);
        yield put({
          type: 'deleteItemStatus',
          status: response.code === 200,
          message: response.message,
        });
      } catch (error) {
        yield put({
          type: 'deleteItemStatus',
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
    detailStatus(state, { status, message, detail = null }) {
      if (!status) {
        antdMessage.error(message);
      }
      return {
        ...state,
        detail,
        loading: false,
      };
    },

    deleteItemStatus(state, { status, message }) {
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

export default bannerModel;

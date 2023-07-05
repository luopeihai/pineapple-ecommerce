import { Reducer, Effect } from 'umi';
import { editSort, deleteGame, createGame, updateGame, getDetailById } from '@/services/game';
import { message as antdMessage } from 'antd';
import { GameItem } from '@/data/game';

export interface StateType {
  status?: 'ok' | 'error'; //当前状态
  message?: string; //消息
  loading: boolean; //选中账号的fu币
  detail: GameItem;
}

export interface GameModelType {
  namespace: string;
  state: StateType;
  effects: {
    delete: Effect;
    editSort: Effect;
    create: Effect;
    update: Effect;
    detail: Effect;
  };
  reducers: {
    createStatus: Reducer<StateType>;
    deletedStatus: Reducer<StateType>;
    updateStatus: Reducer<StateType>;
    detailStatus: Reducer<StateType>;
    editGroupSortStatus: Reducer<StateType>;
  };
}

const GameModel: GameModelType = {
  namespace: 'gameList',
  state: {
    status: undefined,
    message: '',
    loading: false,
    detail: {},
  },

  effects: {
    *create({ payload }, { call, put }) {
      try {
        //创建
        const response = yield call(createGame, payload);
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
    *detail({ payload }, { call, put }) {
      try {
        //创建
        const response = yield call(getDetailById, payload);
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
        //创建
        const response = yield call(updateGame, payload);
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
        const response = yield call(deleteGame, payload);
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
    *editSort({ payload }, { call, put }) {
      try {
        //请求
        const response = yield call(editSort, payload);
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
        antdMessage.success('已成功删除');
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

export default GameModel;

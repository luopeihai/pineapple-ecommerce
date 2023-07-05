import { Reducer, Effect } from 'umi';
import { message as AntMessage } from 'antd';
import { createQuestion } from '../service';
import { isHasShield } from '@/data';
import { getUserInfo } from '@/services/user';
import { queryGroupByModuleId } from '@/services/game';
import { GroupItem } from '@/data/game';

export interface StateType {
  status?: 'ok' | 'error'; //当前状态
  message?: string; //消息
  coinCount: number; //选中账号的fu币
  group: Array<GroupItem>;
}

export interface QuestionModelType {
  namespace: string;
  state: StateType;
  effects: {
    create: Effect;
    updateCoinCount: Effect;
    getModuleGroup: Effect;
  };
  reducers: {
    createStatus: Reducer<StateType>;
    updateCoinCountStatus: Reducer<StateType>;
    getModuleGroupStatus: Reducer<StateType>;
  };
}

const QuestionModel: QuestionModelType = {
  namespace: 'questionInfo',
  state: {
    status: undefined,
    message: undefined,
    coinCount: 0,
    group: [], //游戏对应群组
  },

  effects: {
    *create({ payload }, { call, put }) {
      try {
        //敏感词汇判断
        const shieldValue = isHasShield(payload.wordText);
        //有敏感词汇不进行请求
        if (shieldValue) {
          yield put({
            type: 'createStatus',
            status: false,
            message: `存在敏感词汇${shieldValue}`,
          });
          return;
        }

        //请求
        const response = yield call(createQuestion, payload);
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
    *updateCoinCount({ payload }, { call, put }) {
      try {
        //请求
        const response = yield call(getUserInfo, payload.id);
        yield put({
          type: 'updateCoinCountStatus',
          coinCount: response.data.coinCount,
        });
      } catch (error) {
        yield put({
          type: 'updateCoinCountStatus',
          coinCount: 0,
        });
      }
    },
    *getModuleGroup({ payload }, { call, put }) {
      try {
        if (payload.moduleId) {
          //请求
          const response = yield call(queryGroupByModuleId, payload);
          yield put({
            type: 'getModuleGroupStatus',
            group: response.data,
          });
        } else {
          //无值返回[]
          yield put({
            type: 'getModuleGroupStatus',
            group: [],
          });
        }
      } catch (error) {
        yield put({
          type: 'getModuleGroupStatus',
          group: [],
        });
      }
    },
  },

  reducers: {
    createStatus(state, { status, message }) {
      status ? AntMessage.success(message) : AntMessage.error(message);
      return status
        ? {
            ...state,
            status: 'ok',
            message,
            coinCount: 0,
          }
        : {
            ...state,
            status: 'error',
            message,
          };
    },
    updateCoinCountStatus(state, { coinCount }) {
      return {
        ...state,
        coinCount,
      };
    },
    getModuleGroupStatus(state, { group }) {
      return {
        ...state,
        group,
      };
    },
  },
};

export default QuestionModel;

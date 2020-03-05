import { Effect } from 'dva';
import request from '@/utils/request';
import cookie from 'cookie'
import { Reducer } from 'redux';

import { queryCurrent, query as queryUsers } from '@/services/user';

export interface CurrentUser {
  is_authenticated: boolean;
  user: {
    user: string
    name: ''
    date_of_enter: string
  } | null
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
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {
      is_authenticated:false,
      user:null,
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      request.extendOptions({
        headers:{
          'X-CSRFToken':cookie.parse(document.cookie).csrftoken || ''
        }
      })
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {
          is_authenticated:false,
          user:null,
        },
      },
      action,
    ) {
      return {
        ...state,
        // currentUser: {
        //   ...state.currentUser,
        //   notifyCount: action.payload.totalCount,
        //   unreadCount: action.payload.unreadCount,
        // },
      };
    },
  },
};

export default UserModel;

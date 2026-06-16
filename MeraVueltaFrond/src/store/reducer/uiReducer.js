import { createAction, createReducer } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

// Action creators
export const setLoading = createAction('SET_LOADING');
export const setOrderTabIndex = createAction('SET_ORDER_TAB_INDEX');
export const setVueltasTabIndex = createAction('SET_VUELTAS_TAB_INDEX');
export const setInfoHandler = createAction('SET_INFO_HANDLER');
export const addNotification = createAction('ADD_NOTIFICATION');
export const removeNotification = createAction('REMOVE_NOTIFICATION');
export const setTourRun = createAction('SET_TOUR_RUN');

// Initial state
const initialState = {
  loading: false,
  orderTabIndex: "1",
  vueltasTabIndex: "EsperaSalida",
  infoHandler: null,
  notifications: [],
  tourRun: false,
};

// UI reducer
const uiReducer = createReducer(initialState, {
  [setLoading]: (state, action) => {
    state.loading = action.payload;
  },
  [setOrderTabIndex]: (state, action) => {
    state.orderTabIndex = action.payload;
  },
  [setVueltasTabIndex]: (state, action) => {
    state.vueltasTabIndex = action.payload;
  },
  [setInfoHandler]: (state, action) => {
    state.infoHandler = action.payload;
  },
  [addNotification]: (state, action) => {
    const  data = action.payload;
    data.id = uuid();
    state.notifications.push(data);
  },
  [removeNotification]: (state, action) => {
    state.notifications = state.notifications.filter(
      (notification) => notification.id !== action.payload
    );
  },
  [setTourRun]: (state, action) => {
    state.tourRun = action.payload;
  },
});

export default uiReducer;

import { createAction, createReducer } from '@reduxjs/toolkit';

export const getFromDealerPositionAction = createAction(
  'GET_FROM_DEALER_POSITION_ACTION'
);

export const getFromDealerPositionDoneAction = createAction(
  'GET_FROM_DEALER_POSITION_DONE_ACTION'
);

export const getFromDealerByCompanyAction = createAction(
  'GET_FROM_DEALER_BY_COMPANY_ACTION'
);

export const getFromDealerByCompanyDoneAction = createAction(
  'GET_FROM_DEALER_BY_COMPANY_DONE_ACTION'
);

// Clients
export const getAllClientAction = createAction(
  'GET_ALL_CLIENT_ACTION'
);
export const getAllClientDoneAction = createAction(
  'GET_ALL_CLIENT_DONE_ACTION'
);

// Domiciliarys
export const getAllDomiciliaryAction = createAction(
  'GET_ALL_DOMICILIARIO_ACTION'
);

export const getAllDomiciliaryDoneAction = createAction(
  'GET_ALL_DOMICILIARIO_DONE_ACTION'
);

// UI state reducers
const initialState = {
  dealerPosition: null,
  dealersPositions: [],
  domiciliarys: [],
};

const uiReducer = createReducer(initialState, {
  // Get Position Dealer
  [getFromDealerPositionDoneAction]: (state, action) => {
    state.dealerPosition = action.payload;
  },
  [getFromDealerByCompanyDoneAction]: (state, action) => {
    state.dealersPositions = action.payload;
  },
  // Get All Domiciliarys
  [getAllDomiciliaryDoneAction]: (state, action) => {
    state.domiciliarys = action.payload;
  },
});

export default uiReducer;

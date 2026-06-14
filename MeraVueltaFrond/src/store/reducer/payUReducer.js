import { createAction, createReducer } from "@reduxjs/toolkit";

// PayU
export const createPayUAction = createAction("CREATE_PAYU_ACTION");
export const createPayUDoneAction = createAction("CREATE_PAYU_DONE_ACTION");
export const errorCreatePayU = createAction("ERROR_CREATE_PAYU");

// cancel subscription
export const cancelSubscriptionAction = createAction("CANCEL_SUBSCRIPTION_ACTION");
export const cancelSubscriptionDoneAction = createAction("CANCEL_SUBSCRIPTION_DONE_ACTION");

// UI state reducers
const initialState = {
  PayUState: null,
};

const uiReducer = createReducer(initialState, {
  [createPayUDoneAction]: (state, action) => {
    state.PayUState = action.payload;
  },
  [errorCreatePayU]: (state, action) => {
    state.PayUState = action.payload;
  },
});

export default uiReducer;

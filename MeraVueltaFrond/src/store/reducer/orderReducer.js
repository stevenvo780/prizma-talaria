import { createAction, createReducer } from "@reduxjs/toolkit";

// Create Actions
export const createOrderAction = createAction("CREATE_ORDER_ACTION");
export const createOrderDoneAction = createAction("CREATE_ORDER_DONE_ACTION");

// Create Massive
export const createOrderMassiveAction = createAction(
  "CREATE_ORDER_MASSIVE_ACTION"
);
export const createOrderMassiveDoneAction = createAction(
  "CREATE_ORDER_MASSIVE_DONE_ACTION"
);

// Update Massive
export const updateOrderMassiveAction = createAction(
  "UPDATE_ORDER_MASSIVE_ACTION"
);
export const updateOrderMassiveDoneAction = createAction(
  "UPDATE_ORDER_MASSIVE_DONE_ACTION"
);

// Update order actions
export const updateOrderAction = createAction("UPDATE_ORDER_ACTION");
export const updateOrderDoneAction = createAction("UPDATE_ORDER_DONE_ACTION");

// Delete order actions
export const deleteOrderAction = createAction("DELETE_ORDER_ACTION");
export const deleteOrderDoneAction = createAction("DELETE_ORDER_DONE_ACTION");

// All Orders
export const getAllOrderAction = createAction('GET_ALL_ORDER_ACTION');
export const getAllOrderDoneAction = createAction(
  'GET_ALL_ORDER_DONE_ACTION'
);
export const getOrderByDeliveryNumberAction = createAction(
  'GET_ORDER_BY_DELIVERY_NUMBER_ACTION'
);

export const getOrderByDeliveryNumberDoneAction = createAction(
  'GET_ORDER_BY_DELIVERY_NUMBER_DONE_ACTION'
);

export const getAllOrderByCompanyForStatusAction = createAction(
  'GET_ALL_ORDER_BY_COMPANY_ACTION'
);

export const getAllOrdersByUserDomiciliaryAction = createAction(
  'GET_ALL_ORDER_BY_USER_DOMICILIARY_ACTION'
);

export const searchOrdersAction = createAction(
  'SEARCH_ORDERS_ACTION'
);
export const searchOrdersByStateAllAction = createAction(
  'SEARCH_ORDERS_BY_STATE_ALL_ACTION'
);

export const setLocationTakeOrder = createAction(
  'SET_LOCATION_TAKE_ORDER'
);

export const setOrderTakeOrder = createAction(
  'SET_ORDER_TAKE_ORDER'
);

export const setOrderStep = createAction(
  'SET_ORDER_STEP'
);

export const setOrderSaveConfirm = createAction(
  'SET_ORDER_SAVE_CONFIRM'
);

export const searchAllOrdersAction = createAction(
  'SEARCH_ALL_ORDERS_ACTION'
);

export const searchAllOrdersDoneAction = createAction(
  'SEARCH_ALL_ORDERS_DONE_ACTION'
);

export const searchAllOrdersOrder = createAction(
  'SEARCH_ALL_ORDERS_SEARCH_ACTION'
);

export const resetOrderSave = createAction(
  'RESET_ORDER_SAVE'
);

export const deleteMassiveOrdersAction = createAction(
  'REMOVE_MASSIVE_ORDERS_ACTION'
);

export const deleteMassiveOrdersDoneAction = createAction(
  'REMOVE_MASSIVE_ORDERS_DONE_ACTION'
);

// UI state reducers
const initialState = {
  order: null,
  orderSave: null,
  orders: [],
  ordersSearch: [],
  orderByDeliveryNumber: null,
  locationTakeOrder: {
    latitude: 6.253817,
    longitude: -75.576694
  },
  orderStep: 0,
  orderTakeOrder: {},
  orderSaveConfirm: false,
  orderMassiveResult: [],
};

const uiReducer = createReducer(initialState, {
  [setOrderStep]: (state, action) => {
    state.orderStep = action.payload;
  },
  [setOrderSaveConfirm]: (state, action) => {
    state.orderSaveConfirm = action.payload;
  },
  [setOrderTakeOrder]: (state, action) => {
    state.orderTakeOrder = action.payload;
  },
  [setLocationTakeOrder]: (state, action) => {
    state.locationTakeOrder = action.payload;
  },
  [getAllOrderDoneAction]: (state, action) => {
    state.orders = action.payload;
  },
  [getOrderByDeliveryNumberDoneAction]: (state, action) => {
    state.orderByDeliveryNumber = action.payload;
  },
  [createOrderDoneAction]: (state, action) => {
    state.order = action.payload;
  },
  [deleteOrderAction]: (state, action) => {
    state.order = null;
  },
  [deleteOrderDoneAction]: (state, action) => {
    state.order.order = null;
  },
  [resetOrderSave]: (state, action) => {
    state.orderSave = null;
  },
  [updateOrderAction]: (state, action) => {
    state.orderSave = false;
  },
  [updateOrderDoneAction]: (state, action) => {
    state.orderByDeliveryNumber = action.payload;
    state.order = action.payload;
    state.orderSave = true;
  },
  [createOrderMassiveDoneAction]: (state, action) => {
    state.orderMassiveResult = action.payload;
  },
  [searchAllOrdersDoneAction]: (state, action) => {
    state.ordersSearch = action.payload;
  },
  [searchAllOrdersOrder]: (state, action) => {
    if(action.payload){
      state.ordersSearch.sort((a, b) => b.purchaseNumber - a.purchaseNumber);
    } else {
      state.ordersSearch.sort((a, b) => a.purchaseNumber - b.purchaseNumber);
    }
  }
});

export default uiReducer;

import { createAction, createReducer } from "@reduxjs/toolkit";

// Create Customer
export const createCustomerAction = createAction("CREATE_CUSTOMER_ACTION");
export const createCustomerDoneAction = createAction("CREATE_CUSTOMER_DONE_ACTION");

// Create customer massive
export const createCustomersMassiveAction = createAction("CREATE_CUSTOMERS_MASSIVE_ACTION");
export const createCustomersMassiveDoneAction = createAction("CREATE_CUSTOMERS_MASSIVE_DONE_ACTION");

// Read Customer
export const readCustomerAction = createAction("READ_CUSTOMER_ACTION");
export const readCustomerDoneAction = createAction("READ_CUSTOMER_DONE_ACTION");

// Update Customer
export const updateCustomerAction = createAction("UPDATE_CUSTOMER_ACTION");
export const updateCustomerDoneAction = createAction("UPDATE_CUSTOMER_DONE_ACTION");

// Delete Customer
export const deleteCustomerAction = createAction("DELETE_CUSTOMER_ACTION");
export const deleteCustomerDoneAction = createAction("DELETE_CUSTOMER_DONE_ACTION");

// Get All Customers
export const getAllCustomersAction = createAction("GET_ALL_CUSTOMERS");
export const getAllCustomersDoneAction = createAction("GET_ALL_CUSTOMERS_DONE");

export const setCustomerTakeCustomer = createAction("CUSTOMER_TAKE");
export const setStepCustomer = createAction("STEP");

// UI state reducers
const initialState = {
  customers: [],
  customer: null,
  step: 0,
};

const uiReducer = createReducer(initialState, {
  [createCustomerDoneAction]: (state, action) => {
    state.customer = action.payload;
  },
  [createCustomersMassiveDoneAction]: (state, action) => {
    state.customers.concat(action.payload);
  },
  [readCustomerDoneAction]: (state, action) => {
    state.customer = action.payload;
  },
  [updateCustomerDoneAction]: (state, action) => {
    state.customer = action.payload;
  },
  [getAllCustomersDoneAction]: (state, action) => {
    state.customers = action.payload;
  },
  [setStepCustomer]: (state, action) => {
    state.step = action.payload;
  },
  [setCustomerTakeCustomer]: (state, action) => {
    state.customer = action.payload;
  },
});

export default uiReducer;

import { createAction, createReducer } from "@reduxjs/toolkit";

// Delete domiciliaryCompany actions
export const deleteDomiciliaryCompanyAction = createAction("DELETE_DOMICILIARY_COMPANY_ACTION");
export const deleteDomiciliaryCompanyDoneAction = createAction("DELETE_DOMICILIARY_COMPANY_DONE_ACTION");
export const errorDeleteDomiciliaryCompany = createAction("ERROR_DELETE_DOMICILIARY_COMPANY");

// DomiciliaryCompany
export const getAllDomiciliaryCompanyAction = createAction('GET_ALL_DOMICILIARY_COMPANY_ACTION');

export const getAllDomiciliaryCompanyDoneAction = createAction(
  'GET_ALL_DOMICILIARY_COMPANY_DONE_ACTION'
);

export const getDomiciliaryCompanyByIdAction = createAction(
  'GET_DOMICILIARY_COMPANY_BY_DELIVERY_NUMBER_ACTION'
);

export const getDomiciliaryCompanyByIdDoneAction = createAction(
  'GET_DOMICILIARY_COMPANY_BY_ID_DONE_ACTION'
);

export const getAllDomiciliaryCompanyByCompanyAction = createAction(
  'GET_DOMICILIARY_COMPANY_BY_COMPANY_DONE_ACTION'
);

export const getAllDomiciliaryCompanyByDomiciliaryAction = createAction(
  'GET_DOMICILIARY_COMPANY_BY_DOMICILIARY_DONE_ACTION'
);

// UI state reducers
const initialState = {
  domiciliaryCompany: null,
  domiciliaryCompanys: [],
  errorDelete: "",
};

const uiReducer = createReducer(initialState, {
  [getAllDomiciliaryCompanyDoneAction]: (state, action) => {
    state.domiciliaryCompanys = action.payload;
  },
  [getDomiciliaryCompanyByIdDoneAction]: (state, action) => {
    state.domiciliaryCompany = action.payload;
  },
  [deleteDomiciliaryCompanyAction]: (state, action) => {
    state.domiciliaryCompany = null;
  },
  [deleteDomiciliaryCompanyDoneAction]: (state, action) => {
    state.domiciliaryCompany = null;
  },
  [errorDeleteDomiciliaryCompany]: (state, action) => {
    state.errorDelete = action.payload;
  },
});

export default uiReducer;

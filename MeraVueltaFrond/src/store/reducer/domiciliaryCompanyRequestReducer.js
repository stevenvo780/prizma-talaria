import { createAction, createReducer } from "@reduxjs/toolkit";

// Create Actions
export const createDomiciliaryCompanyRequestAction = createAction("CREATE_DOMICILIARY_COMPANY_REQUEST_ACTION");
export const createDomiciliaryCompanyRequestDoneAction = createAction("CREATE_DOMICILIARY_COMPANY_REQUEST_DONE_ACTION");
export const errorCreateDomiciliaryCompanyRequest = createAction("ERROR_CREATE_DOMICILIARY_COMPANY_REQUEST");
export const errorGetDomiciliaryCompanyRequests = createAction("ERROR_GET_DOMICILIARY_COMPANY_REQUEST");

// Update domiciliaryCompanyRequest actions
export const updateDomiciliaryCompanyRequestAction = createAction("UPDATE_DOMICILIARY_COMPANY_REQUEST_ACTION");
export const updateDomiciliaryCompanyRequestDoneAction = createAction("UPDATE_DOMICILIARY_COMPANY_REQUEST_DONE_ACTION");
export const errorUpdateDomiciliaryCompanyRequest = createAction("ERROR_UPDATE_DOMICILIARY_COMPANY_REQUEST");

// Delete domiciliaryCompanyRequest actions
export const deleteDomiciliaryCompanyRequestAction = createAction("DELETE_DOMICILIARY_COMPANY_REQUEST_ACTION");
export const deleteDomiciliaryCompanyRequestDoneAction = createAction("DELETE_DOMICILIARY_COMPANY_REQUEST_DONE_ACTION");
export const errorDeleteDomiciliaryCompanyRequest = createAction("ERROR_DELETE_DOMICILIARY_COMPANY_REQUEST");

// DomiciliaryCompanyRequests
export const getAllDomiciliaryCompanyRequestAction = createAction('GET_ALL_DOMICILIARY_COMPANY_REQUEST_ACTION');
export const getAllDomiciliaryCompanyRequestDoneAction = createAction(
  'GET_ALL_DOMICILIARY_COMPANY_REQUEST_DONE_ACTION'
);
export const getDomiciliaryCompanyRequestByIdAction = createAction(
  'GET_DOMICILIARY_COMPANY_REQUEST_BY_DELIVERY_NUMBER_ACTION'
);
export const getDomiciliaryCompanyRequestByIdDoneAction = createAction(
  'GET_DOMICILIARY_COMPANY_REQUEST_BY_DELIVERY_NUMBER_DONE_ACTION'
);

export const getAllDomiciliaryCompanyRequestByCompanyAction = createAction(
  'GET_ALL_DOMICILIARY_COMPANY_REQUEST_BY_COMPANY_DELIVERY_NUMBER_ACTION'
);
export const getAllDomiciliaryCompanyRequestByDomiciliaryAction = createAction(
  'GET_ALL_DOMICILIARY_COMPANY_REQUEST_BY_DOMICILIARY_DELIVERY_NUMBER_ACTION'
);


export const domiciliarysByCompanyDomiciliaryCompanyRequestAction = createAction("DOMICILIARYS_BY_COMPANY_DOMICILIARY_COMPANY_REQUEST_ACTION");
export const domiciliarysByCompanyDomiciliaryCompanyRequestDoneAction = createAction("DOMICILIARYS_BY_COMPANY_DOMICILIARY_COMPANY_REQUEST_DONE_ACTION");

// UI state reducers
const initialState = {
  domiciliaryCompanyRequest: null,
  domiciliaryCompanyRequests: [],
  domiciliarys: [],
  errorCreate: "",
  errorUpdate: "",
  errorDelete: "",
};

const uiReducer = createReducer(initialState, {
  [getAllDomiciliaryCompanyRequestDoneAction]: (state, action) => {
    state.domiciliaryCompanyRequests = action.payload;
  },
  [getDomiciliaryCompanyRequestByIdDoneAction]: (state, action) => {
    state.domiciliaryCompanyRequestById = action.payload;
  },
  [createDomiciliaryCompanyRequestDoneAction]: (state, action) => {
    state.domiciliaryCompanyRequest = action.payload;
  },
  [deleteDomiciliaryCompanyRequestAction]: (state, action) => {
    state.domiciliaryCompanyRequest = null;
  },
  [deleteDomiciliaryCompanyRequestDoneAction]: (state, action) => {
    state.domiciliaryCompanyRequest.domiciliaryCompanyRequest = null;
  },
  [updateDomiciliaryCompanyRequestDoneAction]: (state, action) => {
    state.domiciliaryCompanyRequest.domiciliaryCompanyRequest = action.payload.data;
  },
  [errorCreateDomiciliaryCompanyRequest]: (state, action) => {
    state.errorCreate = action.payload;
  },
  [errorUpdateDomiciliaryCompanyRequest]: (state, action) => {
    state.errorUpdate = action.payload;
  },
  [errorDeleteDomiciliaryCompanyRequest]: (state, action) => {
    state.errorDelete = action.payload;
  },
  [domiciliarysByCompanyDomiciliaryCompanyRequestDoneAction]: (state, action) => {
    state.domiciliarys = action.payload;
  }
});

export default uiReducer;

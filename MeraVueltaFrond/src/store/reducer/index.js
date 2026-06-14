import { combineReducers } from "@reduxjs/toolkit";

import uiReducer from "./uiReducer";
import orderReducer from "./orderReducer";
import loginReducer from "./loginReducer";
import domiciliaryCompanyReducer from "./domiciliaryCompanyReducer";
import domiciliaryCompanyRequestReducer from "./domiciliaryCompanyRequestReducer";
import payUReducer from "./payUReducer";
import domiciliaryReducer from "./domiciliaryReducer";
import customerReducer from "./customerReducer";
import { sessionStateReducer } from "./sessionReducer";
export * from "./uiReducer";
export * from "./loginReducer";
export * from "./sessionReducer";
export * from "./orderReducer";
export * from "./domiciliaryCompanyReducer";
export * from "./domiciliaryCompanyRequestReducer";
export * from "./payUReducer";
export * from "./domiciliaryReducer";
export * from "./customerReducer";

export const createRootReducer = (routerReducer) => {
  const mainReducer = combineReducers({
    router: routerReducer,
    ui: uiReducer,
    login: loginReducer,
    order: orderReducer,
    domiciliaryCompany: domiciliaryCompanyReducer,
    domiciliaryCompanyRequest: domiciliaryCompanyRequestReducer,
    payU: payUReducer,
    domiciliary: domiciliaryReducer,
    customer: customerReducer,
  });
  const reducerChain = [mainReducer, sessionStateReducer];
  return (state, action) =>
    reducerChain.reduce(
      (newState, reducer) => reducer(newState, action),
      state,
    );
};

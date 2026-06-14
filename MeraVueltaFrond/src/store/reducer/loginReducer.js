import { createAction, createReducer } from "@reduxjs/toolkit";

export const loginAction = createAction("LOGIN_ACTION");
export const loginDoneAction = createAction("LOGIN_DONE_ACTION");
export const logoutAction = createAction("LOGOUT_ACION");
// confirm email
export const confirmEmailAction = createAction("CONFIRM_EMAIL_ACTION");
export const confirmEmailDoneAction = createAction(
  "CONFIRM_EMAIL_DONE_ACTION",
);
export const confirmEmailError = createAction("CONFIRM_EMAIL_ERROR");

// re send email confirm
export const resendEmailAction = createAction("RESEND_EMAIL_ACTION");

// send email recovery password
export const sendEmailRecoveryPasswordAction = createAction(
  "SEND_EMAIL_RECOVERY_PASSWORD_ACTION",
);
export const sendEmailRecoveryPasswordDoneAction = createAction(
  "SEND_EMAIL_RECOVERY_PASSWORD_DONE_ACTION",
);
export const sendEmailRecoveryPasswordError = createAction(
  "SEND_EMAIL_RECOVERY_PASSWORD_ERROR",
);

// recovery password
export const recoveryPasswordAction = createAction(
  "RECOVERY_PASSWORD_ACTION",
);
export const recoveryPasswordDoneAction = createAction(
  "RECOVERY_PASSWORD_DONE_ACTION",
);
export const recoveryPasswordError = createAction(
  "RECOVERY_PASSWORD_ERROR",
);

export const registerAction = createAction("REGISTER_ACTION");
export const registerDoneAction = createAction("REGISTER_DONE_ACTION");

export const updateUserAction = createAction(
  "ACTUALIZAR_USUARIO_ACTION",
);
export const updateUserDoneAction = createAction(
  "ACTUALIZAR_USUARIO_DONE_ACTION",
);

export const updatePlan = createAction(
  "UPDATE_PLAN_ACTION",
);

const initialState = {
  user: null,
  errorConfirmEmail: false,
  confirmEmail: false,
  sendEmailRecoveryPassword: false,
  sendEmailRecoveryPasswordError: false,
  recoveryPassword: false,
  recoveryPasswordError: false,
  validatePay: false,
  plan: 'free',
};

const uiReducer = createReducer(initialState, {
  [updatePlan]: (state, action) => {
    state.plan = action.payload.plan;
    state.validatePay = action.payload.validatePay;
  },
  [loginDoneAction]: (state, action) => {
    state.user = action.payload.user;
    state.token = action.payload.token;
    state.validatePay = action.payload.validatePay;
    if (state.validatePay) {
      state.plan = action.payload.plan;
    }
  },
  [logoutAction]: (state, action) => {
    state.user = null;
  },
  [registerDoneAction]: (state, action) => {
    state.user = action.payload;
  },
  [updateUserDoneAction]: (state, action) => {
    state.user = action.payload;
  },
  [confirmEmailDoneAction]: (state, action) => {
    state.confirmEmail = action.payload;
  },
  [confirmEmailError]: (state, action) => {
    state.errorConfirmEmail = action.payload;
  },
  [sendEmailRecoveryPasswordDoneAction]: (state, action) => {
    state.sendEmailRecoveryPassword = action.payload;
  },
  [sendEmailRecoveryPasswordError]: (state, action) => {
    state.sendEmailRecoveryPasswordError = action.payload;
  },
  [recoveryPasswordDoneAction]: (state, action) => {
    state.recoveryPassword = action.payload;
  },
  [recoveryPasswordError]: (state, action) => {
    state.recoveryPasswordError = action.payload;
  },
});

export default uiReducer;

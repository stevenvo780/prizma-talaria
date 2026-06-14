// store current state in local session store which can be restored
// on page reload.
import { createAction, createReducer } from '@reduxjs/toolkit';
import { LOCATION_CHANGE } from 'redux-first-history';

export const restoreSessionStateAction = createAction(
  'SESSION_RESTORE_STATE'
);
export const saveSessionStateAction = createAction(
  'SESSION_SAVE_STATE'
);
export const cleanSessionStateAction = createAction(
  'CLEAN_SESSION_STATE_ACION'
);

import {
  setSessionCookie,
  RemoveSessionCookie,
  getSessionCookie,
} from '../../session';

function saveUiState(state) {
  const data = {
    login: state.login,
  };
  try {
    setSessionCookie(data);
    localStorage.setItem('store', JSON.stringify(data));
  } catch (err) {
    console.error("Unable to store state", err);
  }
}

function loadUiState(state) {
  try {
    const data = getSessionCookie();
    if (data) {
      state.login = data.login;
    }
  } catch (err) {
    console.error('Unable to restore state', err);
  }
}

function cleanUiState(state) {
  try {
    RemoveSessionCookie();
    localStorage.removeItem('store');
  } catch (err) {
    console.error('Unable to restore state', err);
  }
}

export const sessionStateReducer = createReducer(
  {},
  {
    [restoreSessionStateAction]: (state) => {
      loadUiState(state);
    },
    [cleanSessionStateAction]: (state) => {
      cleanUiState(state);
    },
    [saveSessionStateAction]: (state) => {
      saveUiState(state);
    },
  }
);

import { callAPI } from './utils';

export function login(params) {
  return callAPI({
    method: 'POST',
    url: `/auth`,
    data: params,
  });
}

export function register(params) {
  return callAPI({
    method: 'POST',
    url: `/register`,
    data: params,
  });
}

// confirm email
export function confirmEmail(params) {
  return callAPI({
    method: 'GET',
    url: `/confirmEmail/${params}`,
  });
}
export function reSendConfirmEmail(payload) {
  return callAPI({
    method: 'POST',
    url: `/reSendConfirmEmail`,
    data: {
      email: payload,
    },
  });
}

// send email recovery password
export function recoverPasswordSendEmail(payload) {
  return callAPI({
    method: 'POST',
    url: `/recoverPasswordSendEmail`,
    data: {
      email: payload,
    },
  });
}

// recovery password
export function recoveryPassword(params) {
  return callAPI({
    method: 'POST',
    url: `/recoverPassword`,
    data: params,
  });
}

export function editUserPassword(params) {
  return callAPI({
    method: 'PATCH',
    url: `/user/password/${params.id}`,
    data: params.data,
  });
}

export function editUser(params) {
  return callAPI({
    method: 'PATCH',
    url: `/user/${params.id}`,
    data: params.data,
  });
}

export function getAllUsers() {
  return callAPI({
    method: 'GET',
    url: `/users`,
  });
}

//status
export function getStatusLogin() {
  return callAPI({
    method: 'GET',
    url: `/status/login`,
  });
}

// PayU
export function createPayU(params) {
  return callAPI({
    method: 'POST',
    url: `/payUsers`,
    data: params,
  });
}

// cancel subscription
export function cancelSubscription() {
  return callAPI({
    method: 'GET',
    url: `/cancelSubscription`,
  });
}

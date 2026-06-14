import {
  takeLatest,
  put,
  call,
  cancelled,
  delay,
} from 'redux-saga/effects';

import { push } from 'redux-first-history';
import { userApi } from '../api';
import {
  // confirm email
  confirmEmailAction,
  confirmEmailDoneAction,
  confirmEmailError,
  resendEmailAction,
  // Send email recovery password
  sendEmailRecoveryPasswordAction,
  sendEmailRecoveryPasswordDoneAction,
  sendEmailRecoveryPasswordError,
  // recovery password
  recoveryPasswordAction,
  recoveryPasswordDoneAction,
  recoveryPasswordError,
  // Login
  loginAction,
  loginDoneAction,
  logoutAction,
  // Session
  cleanSessionStateAction,
  saveSessionStateAction,
  restoreSessionStateAction,
  // Register
  registerAction,
  registerDoneAction,
  // update user
  updateUserAction,
  updateUserDoneAction,
  // PayU
  createPayUAction,
  createPayUDoneAction,
  addNotification,
  updatePlan,
  cancelSubscriptionAction,
  cancelSubscriptionDoneAction,
} from '../../reducer';
import routesCompany from '../../../routes/routesCompany';
import routesDomiciliary from '../../../routes/routesDomiciliary';
import routesPublic from '../../../routes/routesPublic';
import { LOCATION_CHANGE } from 'redux-first-history';
import Cookies from 'js-cookie';
import { getSessionCookie } from '../../../session';

const routesAll = routesCompany.concat(routesDomiciliary.concat(routesPublic));

function* loginSaga(action) {
  try {
    const { data } = yield call(userApi.login, action.payload);
    if (data) {
      if (data.message) {
        yield put(addNotification({ message: data.message, color: 'danger' }));
        return null;
      }
      yield put(loginDoneAction(data));
      yield put(push('/'));
    } else {
      yield put(addNotification({ message: 'No existe un user', color: 'danger' }));
    }
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error.response.data.message, color: 'danger' }));
    } else {
      yield put(addNotification({ message: 'Ocurrió un error autenticando', color: 'danger' }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* loginDoneSaga() {
  try {
    yield put(saveSessionStateAction());
  } catch (error) {
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* restoreSessionStateSaga() {
  const lastRoute = window.location.pathname;
  try {
    yield put(push(lastRoute));
  } catch (error) {
    console.error(error);
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* logoutSagas() {
  try {
    yield put(cleanSessionStateAction());
    localStorage.removeItem('ordersProduct');
    Cookies.remove('session');
  } catch (error) {
    console.error(error);
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* registerSaga(action) {
  try {
    const { data } = yield call(userApi.register, action.payload);
    if (data.message) {
      yield put(addNotification({ message: data.message, color: 'danger' }));
      return null;
    }
    yield put(registerDoneAction(data));
    yield put(push('/'));
  } catch (error) {
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error.response.data.message, color: 'danger' }));
    } else {
      yield put(addNotification({ message: 'Error al registrar', color: 'danger' }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* confirmEmailSaga(action) {
  try {
    const { data } = yield call(userApi.confirmEmail, action.payload);
    if (data) {
      yield put(loginDoneAction(data));
      yield put(confirmEmailDoneAction(true));
    } else {
      yield put(confirmEmailError(true));
    }
  } catch (error) {
    console.error(error)
    yield put(confirmEmailError(true));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* resendEmailSaga(action) {
  try {
    const { data } = yield call(userApi.reSendConfirmEmail(action.payload));
    if (data) {
      yield put(confirmEmailDoneAction(true));
    } else {
      yield put(confirmEmailError(true));
    }
  } catch (error) {
    yield put(confirmEmailError(true));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* sendEmailRecoveryPasswordSaga(action) {
  try {
    const { data } = yield call(userApi.recoverPasswordSendEmail, action.payload);
    if (data) {
      yield put(sendEmailRecoveryPasswordDoneAction(true));
    } else {
      yield put(sendEmailRecoveryPasswordError(true));
    }
  } catch (error) {
    yield put(sendEmailRecoveryPasswordError(true));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* recoveryPasswordSaga(action) {
  try {
    const { data } = yield call(userApi.recoveryPassword, action.payload);
    if (data) {
      yield put(loginDoneAction(data));
      yield put(recoveryPasswordDoneAction(true));
    } else {
      yield put(recoveryPasswordError(true));
    }
  } catch (error) {
    yield put(recoveryPasswordError(true));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* locationChangeSaga(action) {
  const pathname = action.payload.location.pathname;
  let user = getSessionCookie();
  let validateRoute = false;
  if (Object.keys(user).length > 0) {
    user = user.login.user;
    routesAll.forEach((route) => {
      const routePrefix = route.path.replace(/\/:[^/]+/g, '');
      const pathPrefix = pathname.replace(/\/\d+/, '');
      if (pathPrefix.toLowerCase().includes(routePrefix.toLowerCase())) {
        validateRoute = true;
      }
    });
  } else {
    user = null;
    routesPublic.forEach((route) => {
      const routePrefix = route.path.replace(/\/:[^/]+/g, '');
      const pathPrefix = pathname.replace(/\/\d+/, '');
      if (pathPrefix.toLowerCase().includes(routePrefix.toLowerCase())) {
        validateRoute = true;
      }
    });
  }
  if (!validateRoute || (pathname === "/login" && user)) {
    if (user) {
      switch (user.role) {
        case 'company':
          yield put(push('/company/orders'));
          break;
        case 'admin':
          yield put(push('/admin/ordersList'));
          break;
        case 'domiciliary':
          yield put(push('/domiciliary/myCompanys/list'));
          break;
        default:
          yield put(push('/login'));
          break;
      }
      return;
    } else {
      yield put(push('/login'));
      location.reload();
    }
  }
}

function* updateUserSaga(action) {
  try {
    const { data } = yield call(userApi.editUser, action.payload);
    yield put(updateUserDoneAction(data));
    yield put(addNotification({ message: 'Usuario actualizado correctamente', color: 'success' }));
  } catch (error) {
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* updateUserDoneSaga(action) {
  try {
    yield put(saveSessionStateAction());
  } catch (error) {
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* createPayUSaga(action) {
  try {
    const { data } = yield call(userApi.createPayU, action.payload);
    yield put(createPayUDoneAction(data));
    yield put(addNotification({ message: 'Transacción en progreso, en unos segundos se activa tu plan', color: 'success' }));
    yield put(addNotification({ message: 'En tu correo podrás ver mas', color: 'success' }));
    yield delay(2000);
    window.location.reload(true);
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error?.response?.data?.message, color: "danger" }));
    } else {
      yield put(addNotification({ message: "Error al realizar el pago", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}
function* cancelSubscriptionSaga(action) {
  try {
    const { data } = yield call(userApi.cancelSubscription, action.payload);
    yield put(cancelSubscriptionDoneAction(data));
    yield put(addNotification({ message: 'Suscripción cancelada correctamente', color: 'success' }));
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error?.response?.data?.message, color: "danger" }));
    } else {
      yield put(addNotification({ message: "Error al cancelar la suscripción", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

export const userSagas = [
  takeLatest(loginAction.type, loginSaga),
  takeLatest(loginDoneAction.type, loginDoneSaga),
  takeLatest(
    updateUserAction.type,
    updateUserSaga
  ),
  takeLatest(registerAction.type, registerSaga),

  takeLatest(
    restoreSessionStateAction.type,
    restoreSessionStateSaga
  ),
  takeLatest(logoutAction.type, logoutSagas),
  takeLatest(LOCATION_CHANGE, locationChangeSaga),
  takeLatest(updateUserDoneAction.type, updateUserDoneSaga),
  takeLatest(confirmEmailAction.type, confirmEmailSaga),
  takeLatest(resendEmailAction.type, resendEmailSaga),
  takeLatest(sendEmailRecoveryPasswordAction.type, sendEmailRecoveryPasswordSaga),
  takeLatest(recoveryPasswordAction.type, recoveryPasswordSaga),
  takeLatest(createPayUAction.type, createPayUSaga),
  takeLatest(cancelSubscriptionAction.type, cancelSubscriptionSaga),
]

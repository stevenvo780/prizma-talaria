import {
  takeLatest,
  put,
  call,
  cancelled,
  select,
} from 'redux-saga/effects';
import { domiciliaryApi } from '../api';
import {
  // Dealers
  getAllDomiciliaryAction,
  getAllDomiciliaryDoneAction,
  // domiciliaryCompanyRequest
  createDomiciliaryCompanyRequestAction,
  createDomiciliaryCompanyRequestDoneAction,
  updateDomiciliaryCompanyRequestAction,
  deleteDomiciliaryCompanyRequestAction,
  getAllDomiciliaryCompanyRequestAction,
  getAllDomiciliaryCompanyRequestDoneAction,
  getDomiciliaryCompanyRequestByIdAction,
  domiciliarysByCompanyDomiciliaryCompanyRequestAction,
  domiciliarysByCompanyDomiciliaryCompanyRequestDoneAction,
  getAllDomiciliaryCompanyRequestByCompanyAction,
  getAllDomiciliaryCompanyRequestByDomiciliaryAction,
  // domiciliaryCompany
  getAllDomiciliaryCompanyAction,
  getAllDomiciliaryCompanyDoneAction,
  getDomiciliaryCompanyByIdAction,
  deleteDomiciliaryCompanyAction,
  getAllDomiciliaryCompanyByCompanyAction,
  getAllDomiciliaryCompanyByDomiciliaryAction,
  getFromDealerPositionAction,
  getFromDealerPositionDoneAction,
  getFromDealerByCompanyAction,
  getFromDealerByCompanyDoneAction,
  addNotification,
} from '../../reducer';

// All dealers registred
function* getAllDomiciliarySaga() {
  try {
    const { data } = yield call(domiciliaryApi.getAllDomiciliarys);
    yield put(getAllDomiciliaryDoneAction(data));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

// DomiciliaryCompanyRequests
function* getAllDomiciliaryCompanyRequestByCompanySaga() {
  try {
    const { data } = yield call(domiciliaryApi.getDomiciliaryCompanyByCompanyRequest);
    yield put(getAllDomiciliaryCompanyRequestDoneAction(data));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* getAllDomiciliaryCompanyRequestByDomiciliarySaga() {
  try {
    const { data } = yield call(domiciliaryApi.getDomiciliaryCompanyByDomiciliaryRequest);
    yield put(getAllDomiciliaryCompanyRequestDoneAction(data));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* getAllDomiciliaryCompanyRequestsSaga() {
  try {
    const { data } = yield call(domiciliaryApi.getDomiciliaryCompanyRequest);
    yield put(getAllDomiciliaryCompanyRequestDoneAction(data));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* getDomiciliaryCompanyRequestByIdSaga(action) {
  try {
    const { data } = yield call(domiciliaryApi.getDomiciliaryCompanyByIdRequest, action.payload);
    yield put(getDomiciliaryCompanyRequestByIdDoneAction(data));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* createDomiciliaryCompanyRequestSaga(action) {
  try {
    const { data } = yield call(domiciliaryApi.createDomiciliaryCompanyRequest, action.payload);
    yield put(createDomiciliaryCompanyRequestDoneAction(data));
    yield put(getAllDomiciliaryCompanyRequestByCompanyAction(data));
    yield put(domiciliarysByCompanyDomiciliaryCompanyRequestAction(data));
    yield put(addNotification({ message: 'Se creó el domiciliario', color: 'success' }));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* updateDomiciliaryCompanyRequestSaga(action) {
  try {
    const { data } = yield call(domiciliaryApi.updateDomiciliaryCompanyRequest, action.payload);
    yield put(getAllDomiciliaryCompanyRequestByDomiciliaryAction());
    yield put(addNotification({ message: 'Se actualizó el domiciliario', color: 'success' }));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* deleteDomiciliaryCompanyRequestSaga(action) {
  try {
    const { data } = yield call(domiciliaryApi.deleteDomiciliaryCompanyRequest, action.payload);
    yield put(getAllDomiciliaryCompanyRequestByCompanyAction());
    yield put(addNotification({ message: 'Se eliminó el domiciliario', color: 'success' }));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* domiciliarysByCompanyDomiciliaryCompanyRequestSaga() {
  try {
    const { data } = yield call(domiciliaryApi.listDomiciliarysByCompany);
    yield put(domiciliarysByCompanyDomiciliaryCompanyRequestDoneAction(data));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}



// DomiciliaryCompany
function* getAllDomiciliaryCompanyByCompanySaga() {
  try {
    const { data } = yield call(domiciliaryApi.getDomiciliaryCompanyByCompany);
    yield put(getAllDomiciliaryCompanyDoneAction(data));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* getAllDomiciliaryCompanyByDomiciliarySaga() {
  try {
    const { data } = yield call(domiciliaryApi.getDomiciliaryCompanyByDomiciliary);
    yield put(getAllDomiciliaryCompanyDoneAction(data));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* getAllDomiciliaryCompanySaga() {
  try {
    const { data } = yield call(domiciliaryApi.getDomiciliaryCompany);
    yield put(getAllDomiciliaryCompanyDoneAction(data));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* getDomiciliaryCompanyByIdSaga(action) {
  try {
    const { data } = yield call(domiciliaryApi.getDomiciliaryCompanyById, action.payload);
    yield put(getDomiciliaryCompanyByIdDoneAction(data));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* deleteDomiciliaryCompanySaga(action) {
  try {
    const { data } = yield call(domiciliaryApi.deleteDomiciliaryCompany, action.payload);
    const user = yield select((state) => state.login.user);
    if (user) {
      if (user.role === 'company') {
        yield put(getAllDomiciliaryCompanyByCompanyAction());
      } else if (user.role === 'domiciliary') {
        yield put(getAllDomiciliaryCompanyByDomiciliaryAction());
      }
    }
    yield put(addNotification({ message: "Se eliminó el domiciliario", color: 'success' }));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Ocurrió un error trayendo todos los domiciliarios', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* getFromDealerPositionSaga(action) {
  try {
    const { data } = yield call(
      domiciliaryApi.getPositionFromUser,
      action.payload
    );
    yield put(getFromDealerPositionDoneAction(data));
  } catch (error) {
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* getFromDealerByCompanySaga(action) {
  try {
    const { data } = yield call(
      domiciliaryApi.getPositionByCompany,
      action.payload
    );
    yield put(getFromDealerByCompanyDoneAction(data));
  } catch (error) {
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}


export const domiciliarySagas = [
  takeLatest(
    getAllDomiciliaryAction.type,
    getAllDomiciliarySaga
  ),
  // domiciliaryCompanyRequest
  takeLatest(getAllDomiciliaryCompanyRequestAction.type, getAllDomiciliaryCompanyRequestsSaga),
  takeLatest(getDomiciliaryCompanyRequestByIdAction.type, getDomiciliaryCompanyRequestByIdSaga),
  takeLatest(createDomiciliaryCompanyRequestAction.type, createDomiciliaryCompanyRequestSaga),
  takeLatest(updateDomiciliaryCompanyRequestAction.type, updateDomiciliaryCompanyRequestSaga),
  takeLatest(deleteDomiciliaryCompanyRequestAction.type, deleteDomiciliaryCompanyRequestSaga),
  takeLatest(domiciliarysByCompanyDomiciliaryCompanyRequestAction.type, domiciliarysByCompanyDomiciliaryCompanyRequestSaga),
  takeLatest(getAllDomiciliaryCompanyRequestByCompanyAction.type, getAllDomiciliaryCompanyRequestByCompanySaga),
  takeLatest(getAllDomiciliaryCompanyRequestByDomiciliaryAction.type, getAllDomiciliaryCompanyRequestByDomiciliarySaga),
  // domiciliaryCompany
  takeLatest(getAllDomiciliaryCompanyAction.type, getAllDomiciliaryCompanySaga),
  takeLatest(getAllDomiciliaryCompanyByCompanyAction.type, getAllDomiciliaryCompanyByCompanySaga),
  takeLatest(getDomiciliaryCompanyByIdAction.type, getDomiciliaryCompanyByIdSaga),
  takeLatest(deleteDomiciliaryCompanyAction.type, deleteDomiciliaryCompanySaga),
  takeLatest(getAllDomiciliaryCompanyByDomiciliaryAction.type, getAllDomiciliaryCompanyByDomiciliarySaga),
  takeLatest(
    getFromDealerPositionAction.type,
    getFromDealerPositionSaga
  ),
  takeLatest(
    getFromDealerByCompanyAction.type,
    getFromDealerByCompanySaga
  ),
]

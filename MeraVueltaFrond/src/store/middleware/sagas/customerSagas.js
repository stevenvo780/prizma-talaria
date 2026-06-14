import {
  takeLatest,
  put,
  call,
  cancelled,
} from 'redux-saga/effects';
import { customerApi } from '../api';
import {
  createCustomerAction,
  createCustomerDoneAction,
  createCustomersMassiveAction,
  createCustomersMassiveDoneAction,
  readCustomerAction,
  readCustomerDoneAction,
  updateCustomerAction,
  updateCustomerDoneAction,
  deleteCustomerAction,
  deleteCustomerDoneAction,
  getAllCustomersAction,
  getAllCustomersDoneAction,
  addNotification,
} from '../../reducer';

function* createCustomerSaga(action) {
  try {
    const { data } = yield call(customerApi.createCustomer, action.payload);
    yield put(createCustomerDoneAction(data));
    yield put(addNotification({ message: 'Se a creado un cliente', color: 'success' }));
    yield put(getAllCustomersAction());
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error.response.data.message, color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error al crear el cliente", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* readCustomerSaga(action) {
  try {
    const { data } = yield call(customerApi.readCustomer, action.payload);
    yield put(readCustomerDoneAction(data));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Error reading customer', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* updateCustomerSaga(action) {
  try {
    const { data } = yield call(customerApi.updateCustomer, action.payload);
    yield put(updateCustomerDoneAction(data));
    yield put(addNotification({ message: 'Se actualizo el cliente', color: 'success' }));
    yield put(getAllCustomersAction());
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Error updating customer', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* deleteCustomerSaga(action) {
  try {
    const { data } = yield call(customerApi.deleteCustomer, action.payload);
    yield put(deleteCustomerDoneAction(data));
    yield put(addNotification({ message: 'Se elimino el cliente correctamente', color: 'success' }));
    yield put(getAllCustomersAction());
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Error deleting customer', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* getAllCustomersSaga() {
  try {
    const { data } = yield call(customerApi.getAllCustomersAction);
    yield put(getAllCustomersDoneAction(data));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: 'Error getting all customers', color: 'danger' }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* createCustomersMassiveSaga(action) {
  try {
    const { data } = yield call(customerApi.createCustomerMassive, action.payload);
    yield put(createCustomersMassiveDoneAction(data));
    yield put(getAllCustomersAction());
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error.response.data.message, color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error al crear los clientes", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

export const customerSagas = [
  takeLatest(createCustomerAction.type, createCustomerSaga),
  takeLatest(readCustomerAction.type, readCustomerSaga),
  takeLatest(updateCustomerAction.type, updateCustomerSaga),
  takeLatest(deleteCustomerAction.type, deleteCustomerSaga),
  takeLatest(getAllCustomersAction.type, getAllCustomersSaga),
  takeLatest(createCustomersMassiveAction.type, createCustomersMassiveSaga),
]

import {
  takeLatest,
  put,
  call,
  cancelled,
  select
} from 'redux-saga/effects';
import { push } from 'redux-first-history';
import { orderApi } from '../api';
import {
  searchOrdersAction,
  getOrderByDeliveryNumberAction,
  getOrderByDeliveryNumberDoneAction,
  getAllOrderAction,
  getAllOrderDoneAction,
  getAllOrderByCompanyForStatusAction,
  getAllOrdersByUserDomiciliaryAction,
  createOrderAction,
  createOrderDoneAction,
  searchAllOrdersAction,
  searchAllOrdersDoneAction,
  createOrderMassiveAction,
  createOrderMassiveDoneAction,
  updateOrderAction,
  updateOrderDoneAction,
  deleteOrderAction,
  setOrderTabIndex,
  updateOrderMassiveAction,
  updateOrderMassiveDoneAction,
  addNotification,
  searchOrdersByStateAllAction,
  deleteMassiveOrdersAction,
  deleteMassiveOrdersDoneAction
} from '../../reducer';

// Orders
function* searchOrdersSaga(action) {
  try {
    const { data } = yield call(orderApi.searchOrder, action.payload);
    if (data.length > 0) {
      yield put(getAllOrderDoneAction(data));
    } else {
      yield put(addNotification({ message: "No se encontraron resultados", color: "danger" }));
    }
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error.response.data.message, color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error trayendo la búsqueda las ordenes", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* searchOrdersByStateAllSaga(action) {
  try {
    const { data } = yield call(orderApi.searchOrder, action.payload);
    yield put(searchAllOrdersDoneAction(data));
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error.response.data.message, color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error trayendo la búsqueda las ordenes", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* getAllOrderSaga() {
  try {
    const { data } = yield call(orderApi.getAllOrders);
    yield put(getAllOrderDoneAction(data));
  } catch (error) {
    console.error(error);
    yield put(addNotification({ message: "Ocurrió un error trayendo todas las ordenes", color: "danger" }));
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* getOrderByDeliveryNumberSaga(action) {
  try {
    const { data } = yield call(orderApi.getOrdersByDeliveryNumber, action.payload);
    yield put(getOrderByDeliveryNumberDoneAction(data));
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error.response.data.message, color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error trayendo la orden", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* getAllOrderByCompanyForStatusSaga(action) {
  try {
    const { data } = yield call(
      orderApi.getAllOrdersByCompanyForStatus,
      action.payload
    );
    yield put(getAllOrderDoneAction(data));
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: "Ocurrió un error trayendo las ordenes por estado de la compañía", color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error trayendo las ordenes por estado de la compañía", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* getAllOrdersByUserDomiciliarySaga() {
  try {
    const { data } = yield call(orderApi.getAllOrdersByUserDomiciliary);
    yield put(getAllOrderDoneAction(data));
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: "Ocurrió un error trayendo las ordenes por estado de la compañía", color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error trayendo las ordenes por estado de la compañía", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* createOrderSaga(action) {
  try {
    const data = yield call(orderApi.createOrder, action.payload);
    yield put(getAllOrderByCompanyForStatusAction({ state: "Compra", take: 20, skip: 0, orderQuery: false }));
    yield put(addNotification({ message: "Orden creada exitosamente", color: "success" }));
  } catch (error) {
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error.response.data.message, color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error creando la orden", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* updateOrderSaga(action) {
  try {
    const { data } = yield call(orderApi.updateOrderAction, action.payload);
    const user = yield select((state) => state.login.user);
    if (user) {
      if (user.role === 'company') {
        if (data.orderState === 'Compra') {
          yield put(getAllOrderByCompanyForStatusAction({ state: "Compra", take: 20, skip: 0, orderQuery: false }));
          yield put(push('/company/orders'));
          yield put(setOrderTabIndex('2'));
        }
        if (data.orderState === 'EsperaDespacho') {
          yield put(getAllOrderByCompanyForStatusAction({ state: "EsperaDespacho", take: 20, skip: 0, orderQuery: false }));
          yield put(push('/company/orders'));
          yield put(setOrderTabIndex('2'));
        }
        if (data.orderState === 'EsperaSalida') {
          yield put(getAllOrderByCompanyForStatusAction({ state: "EsperaSalida", take: 20, skip: 0, orderQuery: false }));
          yield put(push('/company/vueltas'));
        }
      } else if (user.role === 'domiciliary') {
        yield put(getAllOrdersByUserDomiciliaryAction());
      }
    }
    yield put(updateOrderDoneAction(data));
    yield put(addNotification({ message: "Orden actualizada correctamente", color: "success" }));
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: "Ocurrió un error actualizando la orden", color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error actualizando la orden", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* deleteOrderSaga(action) {
  try {
    const { data } = yield call(orderApi.deleteOrder, action.payload);
    if (data.orderState === 'Compra') {
      yield put(getAllOrderByCompanyForStatusAction({ state: "Compra", take: 20, skip: 0, orderQuery: false }));
      yield put(push('/company/orders'));
      yield put(setOrderTabIndex('1'));
    }
    if (data.orderState === 'EsperaDespacho') {
      yield put(getAllOrderByCompanyForStatusAction({ state: "EsperaDespacho", take: 20, skip: 0, orderQuery: false }));
      yield put(push('/company/orders'));
      yield put(setOrderTabIndex('2'));
    }
    if (data.orderState === 'EsperaSalida') {
      yield put(getAllOrderByCompanyForStatusAction({ state: "EsperaSalida", take: 20, skip: 0, orderQuery: false }));
      yield put(push('/company/vueltas'));
    }
    if (data.orderState === 'Aceptada') {
      yield put(getAllOrderByCompanyForStatusAction({ state: "Aceptada", take: 20, skip: 0, orderQuery: false }));
      yield put(push('/company/vueltas'));
    }
    if (data.orderState === 'Salida') {
      yield put(getAllOrderByCompanyForStatusAction({ state: "Salida", take: 20, skip: 0, orderQuery: false }));
      yield put(push('/company/vueltas'));
    }
    yield put(addNotification({ message: "Se elimino correctamente", color: "success" }));
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: "Ocurrió un error eliminando la orden", color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error eliminando la orden", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* deleteMassiveOrdersSaga(action) {
  try {
    const { data } = yield call(orderApi.deleteMassiveOrder, action.payload);
    yield put(deleteMassiveOrdersDoneAction(data));
    if (data[0].order.orderState === 'Compra') {
      yield put(getAllOrderByCompanyForStatusAction({ state: "Compra", take: 20, skip: 0, orderQuery: false }));
      yield put(push('/company/orders'));
      yield put(setOrderTabIndex('1'));
    }
    if (data[0].order.orderState === 'EsperaDespacho') {
      yield put(getAllOrderByCompanyForStatusAction({ state: "EsperaDespacho", take: 20, skip: 0, orderQuery: false }));
      yield put(push('/company/orders'));
      yield put(setOrderTabIndex('2'));
    }
    if (data[0].order.orderState === 'EsperaSalida') {
      yield put(getAllOrderByCompanyForStatusAction({ state: "EsperaSalida", take: 20, skip: 0, orderQuery: false }));
      yield put(push('/company/vueltas'));
    }
    if (data[0].order.orderState === 'Aceptada') {
      yield put(getAllOrderByCompanyForStatusAction({ state: "Aceptada", take: 20, skip: 0, orderQuery: false }));
      yield put(push('/company/vueltas'));
    }
    if (data[0].order.orderState === 'Salida') {
      yield put(getAllOrderByCompanyForStatusAction({ state: "Salida", take: 20, skip: 0, orderQuery: false }));
      yield put(push('/company/vueltas'));
    }
    yield put(createOrderMassiveDoneAction(data));
    yield put(addNotification({ message: "Ordenes eliminadas correctamente", color: "success" }));
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: "Ocurrió un error eliminando las ordenes", color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error eliminando las ordenes", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

function* createOrderMassiveSaga(action) {
  try {
    const { data } = yield call(orderApi.createOrderMassive, action.payload);
    yield put(createOrderMassiveDoneAction(data));
    yield put(getAllOrderByCompanyForStatusAction({ state: "Compra", take: 20, skip: 0, orderQuery: false }));
  } catch (error) {
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error.response.data.message, color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error creando la orden", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

// update massive orders
function* updateOrderMassiveSaga(action) {
  try {
    const { data } = yield call(orderApi.updateOrderMassive, action.payload);
    yield put(updateOrderMassiveDoneAction(data));
    if (data[0].order.orderState === 'Compra') {
      yield put(getAllOrderByCompanyForStatusAction({ state: "Compra", take: 20, skip: 0, orderQuery: false }));
      yield put(push('/company/orders'));
      yield put(setOrderTabIndex('2'));
    }
    if (data[0].order.orderState === 'EsperaDespacho') {
      yield put(getAllOrderByCompanyForStatusAction({ state: "EsperaDespacho", take: 20, skip: 0, orderQuery: false }));
      yield put(push('/company/orders'));
      yield put(setOrderTabIndex('2'));
    }
    if (data[0].order.orderState === 'EsperaSalida') {
      yield put(getAllOrderByCompanyForStatusAction({ state: "EsperaSalida", take: 20, skip: 0, orderQuery: false }));
      yield put(push('/company/vueltas'));
    }
    yield put(createOrderMassiveDoneAction(data));
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: "Ocurrió un error actualizando las ordenes", color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error actualizando las ordenes", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

// Search orders
function* searchAllOrdersSaga(action) {
  try {
    const { data } = yield call(orderApi.searchOrderAll, action.payload);
    if (data.length > 0) {
      yield put(searchAllOrdersDoneAction(data));
      yield put(push(`/company/order/search/${action.payload.word}`));
    } else {
      yield put(addNotification({ message: "No se encontraron ordenes con el criterio de búsqueda", color: "danger" }));
    }
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: "Ocurrió un error buscando las ordenes", color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error buscando las ordenes", color: "danger" }));
    }
  } finally {
    if (yield cancelled()) {
      // Do nothing
    }
  }
}

export const orderSagas = [
  // Orders
  takeLatest(getAllOrderAction.type, getAllOrderSaga),
  takeLatest(getOrderByDeliveryNumberAction.type, getOrderByDeliveryNumberSaga),
  takeLatest(
    getAllOrderByCompanyForStatusAction.type,
    getAllOrderByCompanyForStatusSaga
  ),
  takeLatest(
    getAllOrdersByUserDomiciliaryAction.type,
    getAllOrdersByUserDomiciliarySaga
  ),
  takeLatest(createOrderAction.type, createOrderSaga),
  takeLatest(updateOrderAction.type, updateOrderSaga),
  takeLatest(deleteOrderAction.type, deleteOrderSaga),
  takeLatest(searchOrdersAction.type, searchOrdersSaga),
  takeLatest(createOrderMassiveAction.type, createOrderMassiveSaga),
  takeLatest(searchAllOrdersAction.type, searchAllOrdersSaga),
  takeLatest(updateOrderMassiveAction.type, updateOrderMassiveSaga),
  takeLatest(searchOrdersByStateAllAction.type, searchOrdersByStateAllSaga),
  takeLatest(deleteMassiveOrdersAction.type, deleteMassiveOrdersSaga),
]

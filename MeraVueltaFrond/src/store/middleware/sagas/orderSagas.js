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
import { ORDER_STATES, getOrderState, getOrderStateRoute, isValidOrderState } from './orderConstants';

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

    // Defensive extraction of orderState with validation
    const orderState = getOrderState(data);
    if (!orderState) {
      console.warn('Update order response missing orderState', data);
      yield put(addNotification({ message: "Orden actualizada pero estado no confirmado", color: "warning" }));
      yield put(updateOrderDoneAction(data));
      return;
    }

    // Validate orderState is recognized
    if (!isValidOrderState(orderState)) {
      console.warn(`Unknown order state returned: ${orderState}`);
      yield put(addNotification({ message: "Orden actualizada con estado desconocido", color: "warning" }));
      yield put(updateOrderDoneAction(data));
      return;
    }

    // Route user to appropriate page based on new orderState
    if (user) {
      if (user.role === 'company') {
        const route = getOrderStateRoute(orderState);
        yield put(getAllOrderByCompanyForStatusAction({ state: orderState, take: 20, skip: 0, orderQuery: false }));
        yield put(push(route.page));
        if (route.tab) {
          yield put(setOrderTabIndex(route.tab));
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
      yield put(addNotification({ message: error.response.data.message, color: "danger" }));
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

    // Defensive extraction of orderState with validation
    const orderState = getOrderState(data);
    if (!orderState) {
      console.warn('Delete order response missing orderState', data);
      yield put(addNotification({ message: "Orden eliminada pero estado no confirmado", color: "warning" }));
      return;
    }

    // Validate orderState is recognized
    if (!isValidOrderState(orderState)) {
      console.warn(`Unknown order state returned from delete: ${orderState}`);
      yield put(addNotification({ message: "Orden eliminada con estado desconocido", color: "warning" }));
      return;
    }

    // Route user to appropriate page based on orderState
    const route = getOrderStateRoute(orderState);
    yield put(getAllOrderByCompanyForStatusAction({ state: orderState, take: 20, skip: 0, orderQuery: false }));
    yield put(push(route.page));
    if (route.tab) {
      yield put(setOrderTabIndex(route.tab));
    }

    yield put(addNotification({ message: "Se eliminó correctamente", color: "success" }));
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error.response.data.message, color: "danger" }));
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

    // Defensive extraction: use first item's orderState for routing (if available)
    const orderState = getOrderState(data);
    if (orderState && isValidOrderState(orderState)) {
      const route = getOrderStateRoute(orderState);
      yield put(getAllOrderByCompanyForStatusAction({ state: orderState, take: 20, skip: 0, orderQuery: false }));
      yield put(push(route.page));
      if (route.tab) {
        yield put(setOrderTabIndex(route.tab));
      }
    } else if (Array.isArray(data) && data.length === 0) {
      // Empty result: default to orders list
      yield put(push('/company/orders'));
      yield put(setOrderTabIndex('1'));
    }

    yield put(createOrderMassiveDoneAction(data));
    yield put(addNotification({ message: "Órdenes eliminadas correctamente", color: "success" }));
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error.response.data.message, color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error eliminando las órdenes", color: "danger" }));
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

    // Defensive extraction: use first item's orderState for routing (if available)
    const orderState = getOrderState(data);
    if (orderState && isValidOrderState(orderState)) {
      const route = getOrderStateRoute(orderState);
      yield put(getAllOrderByCompanyForStatusAction({ state: orderState, take: 20, skip: 0, orderQuery: false }));
      yield put(push(route.page));
      if (route.tab) {
        yield put(setOrderTabIndex(route.tab));
      }
    } else if (Array.isArray(data) && data.length === 0) {
      // Empty result: default to orders list
      yield put(push('/company/orders'));
      yield put(setOrderTabIndex('1'));
    } else {
      console.warn('Update massive orders: could not extract valid orderState', data);
    }

    yield put(createOrderMassiveDoneAction(data));
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      yield put(addNotification({ message: error.response.data.message, color: "danger" }));
    } else {
      yield put(addNotification({ message: "Ocurrió un error actualizando las órdenes", color: "danger" }));
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

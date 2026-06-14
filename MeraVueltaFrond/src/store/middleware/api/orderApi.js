import { callAPI } from './utils';

// Orders
export function getAllOrdersByUserDomiciliary() {
  return callAPI({
    method: 'GET',
    url: `/order/user/domiciliary`,
  });
}

export function getOrdersByDeliveryNumber(deliveryNumber) {
  return callAPI({
    method: 'GET',
    url: `/order/${deliveryNumber}`,
  });
}

export function getAllOrdersByCompanyForStatus(params) {
  return callAPI({
    method: 'GET',
    url: `/order/byCompany/status/${params.state}?take=${params.take}&skip=${params.skip}&orderQuery=${params.orderQuery}`,
  });
}

export function searchOrder(params) {
  return callAPI({
    method: 'GET',
    url: `/order/search?word=${params.word}&state=${params.state}&orderQuery=${params.orderQuery}&take=${params.take}&skip=${params.skip}`,
  });
}

export function searchOrderAll(params) {
  return callAPI({
    method: 'GET',
    url: `/order/search/all?word=${params.word}&take=${params.take}&skip=${params.skip}`,
  });
}

export function getAllOrders() {
  return callAPI({
    method: 'GET',
    url: `/order`,
  });
}

export function getOrderById(id) {
  return callAPI({
    method: 'GET',
    url: `/order/${id}`,
  });
}

export function createOrderMassive(params) {
  return callAPI({
    method: 'POST',
    url: `/order/massive`,
    data: params,
  });
}

export function updateOrderMassive(params) {
  return callAPI({
    method: 'PATCH',
    url: `/order/massive`,
    data: params,
  });
}

export function createOrder(params) {
  return callAPI({
    method: 'POST',
    url: `/order`,
    data: params,
  });
}

export function updateOrderAction(params) {
  return callAPI({
    method: 'PATCH',
    url: `/order/${Number(params.id)}`,
    data: params.data,
  });
}

export function deleteOrder(id) {
  return callAPI({
    method: 'DELETE',
    url: `/order/${id}`,
  });
}

export function deleteMassiveOrder(params) {
  return callAPI({
    method: 'DELETE',
    url: `/order/massive`,
    data: params,
  });
}
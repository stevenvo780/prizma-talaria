import { callAPI } from './utils';

export function createCustomer(params) {
  return callAPI({
    method: 'POST',
    url: `/customer`,
    data: params,
  });
}
export function createCustomerMassive(params) {
  return callAPI({
    method: 'POST',
    url: `/customer/massive`,
    data: params,
  });
}
export function readCustomer(id) {
  return callAPI({
    method: 'GET',
    url: `/customer/${id}`,
  });
}
export function updateCustomer(params) {
  return callAPI({
    method: 'PUT',
    url: `/customer/${params.id}`,
    data: params.data,
  });
}
export function deleteCustomer(id) {
  return callAPI({
    method: 'DELETE',
    url: `/customer/${id}`,
  });
}
export function getAllCustomersAction() {
  return callAPI({
    method: 'GET',
    url: `/customer`,
  });
}

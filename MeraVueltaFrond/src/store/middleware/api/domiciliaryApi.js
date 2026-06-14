import { callAPI } from './utils';

export function getAllDomiciliarys() {
  return callAPI({
    method: 'GET',
    url: `/user/domiciliary`,
  });
}

// Orders
export function getAllOrdersByUserDomiciliary() {
  return callAPI({
    method: 'GET',
    url: `/order/user/domiciliary`,
  });
}

// domiciliaryCompanyRequest
export function getDomiciliaryCompanyByDomiciliaryRequest() {
  return callAPI({
    method: 'GET',
    url: `/domiciliaryCompanyRequest/byDomiciliary`,
  });
}
export function getDomiciliaryCompanyByCompanyRequest() {
  return callAPI({
    method: 'GET',
    url: `/domiciliaryCompanyRequest/byCompany`,
  });
}
export function getDomiciliaryCompanyRequest() {
  return callAPI({
    method: 'GET',
    url: `/domiciliaryCompanyRequest`,
  });
}

export function getDomiciliaryCompanyByIdRequest(params) {
  return callAPI({
    method: 'GET',
    url: `/domiciliaryCompanyRequest/${params}`,
  });
}

export function createDomiciliaryCompanyRequest(params) {
  return callAPI({
    method: 'POST',
    url: `/domiciliaryCompanyRequest`,
    data: params,
  });
}

export function updateDomiciliaryCompanyRequest(params) {
  return callAPI({
    method: 'PATCH',
    url: `/domiciliaryCompanyRequest/${params.id}`,
    data: params.data,
  });
}

export function deleteDomiciliaryCompanyRequest(id) {
  return callAPI({
    method: 'DELETE',
    url: `/domiciliaryCompanyRequest/${id}`,
  });
}

export function listDomiciliarysByCompany() {
  return callAPI({
    method: 'GET',
    url: `/domiciliaryCompanyRequest/domiciliarysByCompany`,
  });
}

// domiciliaryCompany
export function getDomiciliaryCompany() {
  return callAPI({
    method: 'GET',
    url: `/domiciliaryCompany`,
  });
}

export function getDomiciliaryCompanyById(id) {
  return callAPI({
    method: 'GET',
    url: `/domiciliaryCompany/${id}`,
  });
}

export function getDomiciliaryCompanyByCompany() {
  return callAPI({
    method: 'GET',
    url: `/domiciliaryCompany/byCompany`,
  });
}

export function getDomiciliaryCompanyByDomiciliary() {
  return callAPI({
    method: 'GET',
    url: `/domiciliaryCompany/byDomiciliary`,
  });
}

export function deleteDomiciliaryCompany(id) {
  return callAPI({
    method: 'DELETE',
    url: `/domiciliaryCompany/${id}`,
  });
}

export function getPositionFromUser(id) {
  return callAPI({
    method: 'GET',
    url: `/positionUser/byUser/${id}`,
  });
}

export function getPositionByCompany() {
  return callAPI({
    method: 'GET',
    url: `/positionUser/byCompany`,
  });
}
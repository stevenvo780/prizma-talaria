import { EntityManager } from 'typeorm';
import Hapi from '@hapi/hapi';
import {
  listDomiciliaryCompanyRequestByIdService,
  listDomiciliaryCompanyRequestService,
  createDomiciliaryCompanyRequestService,
  updateDomiciliaryCompanyRequestService,
  deleteDomiciliaryCompanyRequestService,
  listDomiciliarysByCompanyService,
  listDomiciliaryCompanyRequestByCompanyService,
  listDomiciliaryCompanyRequestByDomiciliaryService
} from './services';
import { User } from '../../entities/users';
import { DomiciliaryCompanyRequest } from '../../entities/domiciliaryCompanyRequest';

/**
 * Returns a domiciliaryCompanyRequests by company
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompanyRequest[]>}
 */
export async function listDomiciliaryCompanyRequestByDomiciliary(req: Hapi.request): Promise<DomiciliaryCompanyRequest[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  return await listDomiciliaryCompanyRequestByDomiciliaryService(manager, userId);
}

/**
 * Returns a domiciliaryCompanyRequests by company
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompanyRequest[]>}
 */
export async function listDomiciliaryCompanyRequestByCompany(req: Hapi.request): Promise<DomiciliaryCompanyRequest[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  return await listDomiciliaryCompanyRequestByCompanyService(manager, userId);
}

/**
 * Returns a domiciliarys by company
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompanyRequest[]>}
 */
export async function listDomiciliarysByCompany(req: Hapi.request): Promise<User[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  return await listDomiciliarysByCompanyService(manager, userId);
}

/**
 * Returns a domiciliaryCompanyRequest
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompanyRequest[]>}
 */
export async function getDomiciliaryCompanyRequest(req: Hapi.request): Promise<DomiciliaryCompanyRequest | undefined> {
  const manager: EntityManager = req.server.app.connection.manager;
  const id = req.params.id;
  return await listDomiciliaryCompanyRequestByIdService(manager, id);
}

/**
 * Return all domiciliaryCompanyRequest
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompanyRequest[]>}
 */
export const getAllDomiciliaryCompanyRequest = async (
  req: Hapi.request
): Promise<DomiciliaryCompanyRequest[]> => {
  const manager: EntityManager = req.server.app.connection.manager;
  return await listDomiciliaryCompanyRequestService(manager);
};

/**
 * Create domiciliaryCompanyRequest
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompanyRequest[]>}
 */
export const createDomiciliaryCompanyRequest = async (req: Hapi.request): Promise<DomiciliaryCompanyRequest> => {
  const manager: EntityManager = req.server.app.connection.manager;
  const {
    company,
    domiciliary,
  } = req.payload;
  return await createDomiciliaryCompanyRequestService(
    manager,
    company,
    domiciliary,
  );
};

/**
 * Update domiciliaryCompanyRequest
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompanyRequest>}
 */
export const updateDomiciliaryCompanyRequest = async (req: Hapi.request): Promise<DomiciliaryCompanyRequest> => {
  const manager: EntityManager = req.server.app.connection.manager;
  const id = req.params.id;
  const {
    company,
    domiciliary,
    state,
  } = req.payload;
  return await updateDomiciliaryCompanyRequestService(
    manager,
    id,
    company,
    domiciliary,
    state,
  );
};

/**
 * Delete a domiciliaryCompanyRequest
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompanyRequest>}
 */
export const deleteDomiciliaryCompanyRequest = async (req: Hapi.request): Promise<DomiciliaryCompanyRequest> => {
  const manager: EntityManager = req.server.app.connection.manager;
  const id = req.params.id;
  return await deleteDomiciliaryCompanyRequestService(manager, id);
};




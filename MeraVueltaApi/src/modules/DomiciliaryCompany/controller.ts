import { EntityManager } from 'typeorm';
import Hapi from '@hapi/hapi';
import {
  listDomiciliaryCompanyByIdService,
  listDomiciliaryCompanyService,
  createDomiciliaryCompanyService,
  updateDomiciliaryCompanyService,
  deleteDomiciliaryCompanyService,
  listDomiciliaryCompanyByCompanyService,
  listDomiciliaryCompanyByDomiciliaryService
} from './services';
import { DomiciliaryCompany } from '../../entities/domiciliaryCompany';

/**
 * Returns a domiciliaryCompany by domiciliary
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompany[]>}
 */
export async function listDomiciliaryCompanyByDomiciliary(req: Hapi.request): Promise<DomiciliaryCompany[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  return await listDomiciliaryCompanyByDomiciliaryService(manager, userId);
}

/**
 * Returns a domiciliaryCompany by company
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompany[]>}
 */
export async function listDomiciliaryCompanyByCompany(req: Hapi.request): Promise<DomiciliaryCompany[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  return await listDomiciliaryCompanyByCompanyService(manager, userId);
}

/**
 * Returns a domiciliaryCompany
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompany[]>}
 */
export async function getDomiciliaryCompany(req: Hapi.request): Promise<DomiciliaryCompany | undefined> {
  const manager: EntityManager = req.server.app.connection.manager;
  const id = req.params.id;
  return await listDomiciliaryCompanyByIdService(manager, id);
}

/**
 * Return all domiciliaryCompany
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompany[]>}
 */
export const getAllDomiciliaryCompany = async (
  req: Hapi.request
): Promise<DomiciliaryCompany[]> => {
  const manager: EntityManager = req.server.app.connection.manager;
  return await listDomiciliaryCompanyService(manager);
};

/**
 * Create domiciliaryCompany
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompany[]>}
 */
export const createDomiciliaryCompany = async (req: Hapi.request): Promise<DomiciliaryCompany> => {
  const manager: EntityManager = req.server.app.connection.manager;
  const {
    company,
    domiciliary,
  } = req.payload;
  return await createDomiciliaryCompanyService(
    manager,
    company,
    domiciliary,
  );
};

/**
 * Update domiciliaryCompany
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompany>}
 */
export const updateDomiciliaryCompany = async (req: Hapi.request): Promise<DomiciliaryCompany> => {
  const manager: EntityManager = req.server.app.connection.manager;
  const id = req.params.id;
  const {
    company,
    domiciliary,
  } = req.payload;
  return await updateDomiciliaryCompanyService(
    manager,
    id,
    company,
    domiciliary,
  );
};

/**
 * Delete a domiciliaryCompany
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompany>}
 */
export const deleteDomiciliaryCompany = async (req: Hapi.request): Promise<DomiciliaryCompany> => {
  const manager: EntityManager = req.server.app.connection.manager;
  const id = req.params.id;
  return await deleteDomiciliaryCompanyService(manager, id);
};




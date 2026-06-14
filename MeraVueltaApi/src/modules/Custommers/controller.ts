import { EntityManager } from 'typeorm';
import Hapi from '@hapi/hapi';
import {
  listCustomerByIdService,
  listCustomerService,
  createCustomerService,
  updateCustomerService,
  deleteCustomerService,
  listCustomerByCompanyService,
  listCustomerByDomiciliaryService,
  createCustomerMassiveService
} from './services';
import { Customer } from '../../entities/customer';

/**
 * Returns a customer by domiciliary
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Customer[]>}
 */
export async function listCustomerByDomiciliary(req: Hapi.request): Promise<Customer[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  return await listCustomerByDomiciliaryService(manager, userId);
}

/**
 * Returns a customer by company
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Customer[]>}
 */
export async function listCustomerByCompany(req: Hapi.request): Promise<Customer[]> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  return await listCustomerByCompanyService(manager, userId);
}

/**
 * Returns a customer
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Customer[]>}
 */
export async function getCustomer(req: Hapi.request): Promise<Customer | undefined> {
  const manager: EntityManager = req.server.app.connection.manager;
  const id = req.params.id;
  return await listCustomerByIdService(manager, id);
}

/**
 * Return all customer
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Customer[]>}
 */
export const getAllCustomer = async (
  req: Hapi.request
): Promise<Customer[]> => {
  const manager: EntityManager = req.server.app.connection.manager;
  return await listCustomerService(manager);
};

/**
 * Create customer
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Customer[]>}
 */
export const createCustomerMassive = async (req: Hapi.request): Promise<Customer[]> => {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  const customer = req.payload as Customer[];
  return await createCustomerMassiveService(manager, customer, userId);
};

/**
 * Create customer
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Customer[]>}
 */
export const createCustomer = async (req: Hapi.request): Promise<Customer> => {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  const customer = req.payload as Customer;
  customer.company = userId;
  return await createCustomerService(manager, customer);
};

/**
 * Update customer
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Customer>}
 */
export const updateCustomer = async (req: Hapi.request): Promise<Customer> => {
  const manager: EntityManager = req.server.app.connection.manager;
  const id = req.params.id;
  const customer = req.payload as Customer;
  return await updateCustomerService(
    manager,
    id,
    customer
  );
};

/**
 * Delete a customer
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Customer>}
 */
export const deleteCustomer = async (req: Hapi.request): Promise<Customer> => {
  const manager: EntityManager = req.server.app.connection.manager;
  const id = req.params.id;
  return await deleteCustomerService(manager, id);
};




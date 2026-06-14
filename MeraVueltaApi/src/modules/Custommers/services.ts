import Boom from '@hapi/boom';
import { EntityManager } from 'typeorm';
import { Customer } from '../../entities/customer';
import { User } from '../../entities/users';
import { ErrorMessages } from '../../utils/errors';

/**
 * list a customers
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<Customer[]>}
 */
export const listCustomerByIdService = async (manager: EntityManager, id: string): Promise<Customer | undefined> => {
  const customers = await manager.findOne(Customer, {
    where: { id },
    relations: ['company']
  });
  return customers;
};

/**
 * list a customers by domiciliary
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<Customer[]>}
 */
export const listCustomerByDomiciliaryService = async (manager: EntityManager, domiciliaryId: number): Promise<Customer[]> => {
  try {
    const customers = await manager.find(Customer, {
      where: { domiciliary: domiciliaryId },
      relations: ['company']
    });
    return customers;
  } catch (error) {
    console.error(error);
    throw Boom.badRequest(ErrorMessages.ERROR_CUSTOMER_NOT_FOUND);
  }
};

/**
 * list a customers by company
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<Customer[]>}
 */
export const listCustomerByCompanyService = async (manager: EntityManager, companyId: string): Promise<Customer[]> => {
  try {
    const customers = await manager.find(Customer, {
      where: { company: companyId },
      relations: ['company']
    });
    return customers;
  } catch (error) {
    console.error(error);
    throw Boom.badRequest(ErrorMessages.ERROR_CUSTOMER_NOT_FOUND);
  }
};

/**
 * list all customers
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<Customer[]>}
 */
export const listCustomerService = async (manager: EntityManager,): Promise<Customer[]> => {
  const customers = await manager.find(Customer, {
    relations: ['company'],
    order: {
      order: 'DESC',
    },
  });
  return customers;
};

export const createCustomerService = async (
  manager: EntityManager,
  customer: Customer,
): Promise<Customer> => {
  const customerExists = await manager.find(Customer, { where: { clientPhone: customer.clientPhone } });
  if (customerExists.length) {
    throw Boom.badRequest(ErrorMessages.ERROR_CUSTOMER_ALREADY_EXIST);
  }
  const newCustomer = new Customer();
  Object.assign(newCustomer, customer);

  const highestOrderCustomer = await manager.createQueryBuilder(Customer, 'customer')
    .where('customer.company = :company', { company: newCustomer.company })
    .orderBy('customer.order', 'DESC')
    .getOne();

  if (highestOrderCustomer) {
    newCustomer.order = highestOrderCustomer.order + 1;
  } else {
    newCustomer.order = 1;
  }

  try {
    return await manager.save(newCustomer);
  } catch (error) {
    console.error('Error saving customer change request: ', error);
    throw Boom.badGateway(ErrorMessages.ERROR_CUSTOMER_UNEXPECTED);
  }
};

export const createCustomerMassiveService = async (
  manager: EntityManager,
  customers: Customer[],
  userId: number,
): Promise<Customer[]> => {
  const saveCustomers: Customer[] = [];

  const existingCustomers = await manager.createQueryBuilder(Customer, 'customer')
    .where('customer.company = :company', { company: userId })
    .orderBy('customer.order', 'ASC')
    .getMany();

  const newCustomersPhone = customers.map(c => c.clientPhone);
  const existingCustomersToUpdate = existingCustomers.filter(cust => newCustomersPhone.includes(cust.clientPhone));
  const existingCustomersToShift = existingCustomers.filter(cust => !newCustomersPhone.includes(cust.clientPhone));

  for (let index = 0; index < customers.length; index++) {
    const customer = customers[index];
    let customerExists = existingCustomersToUpdate.find(cust => cust.clientPhone === customer.clientPhone);
    if (!customerExists) {
      customerExists = new Customer();
    }
    Object.assign(customerExists, customer);
    customerExists.company = { id: userId } as User;
    customerExists.order = index + 1;
    saveCustomers.push(customerExists);
  }

  const shiftStart = customers.length + 1;
  for (let index = 0; index < existingCustomersToShift.length; index++) {
    existingCustomersToShift[index].order = index + shiftStart;
    await manager.save(existingCustomersToShift[index]);
  }

  try {
    return await manager.save(saveCustomers);
  } catch (error) {
    console.error('Error saving customer change request: ', error);
    throw Boom.badGateway(ErrorMessages.ERROR_CUSTOMER_UNEXPECTED);
  }
};

export const updateCustomerService = async (
  manager: EntityManager,
  id: string,
  customer: Customer,
): Promise<Customer> => {
  const customerExist = await manager.findOne(Customer, { where: { id: id, company: customer.company.id } });
  if (!customerExist) {
    throw Boom.notFound(ErrorMessages.ERROR_CUSTOMER_NOT_FOUND);
  }
  if (customer.order && customer.order !== customerExist.order) {
    const otherCustomer = await manager.findOne(Customer, { where: { order: customer.order, company: customer.company.id } });
    if (otherCustomer) {
      otherCustomer.order = customerExist.order;
      await manager.save(otherCustomer);
    }
  }
  Object.assign(customerExist, customer);
  try {
    return await manager.save(customerExist);
  } catch (error) {
    console.error('Error saving customer change request: ', error);
    throw Boom.badGateway(ErrorMessages.ERROR_CUSTOMER_UNEXPECTED);
  }
};

/**
 * Delete a Customer
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<Customer>}
 */
export const deleteCustomerService = async (manager: EntityManager, id: string): Promise<Customer> => {
  const dataCustomer = await manager.findOne(Customer, id);
  if (!dataCustomer) throw Boom.badRequest(ErrorMessages.ERROR_CUSTOMER_NOT_FOUND);

  try {
    return await manager.remove(Customer, dataCustomer);
  } catch (error) {
    console.error('Delete customer error', error);
    throw Boom.internal(ErrorMessages.ERROR_CUSTOMER_UNEXPECTED);
  }
};
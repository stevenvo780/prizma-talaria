import Boom from '@hapi/boom';
import { EntityManager } from 'typeorm';
import { DomiciliaryCompany } from '../../entities/domiciliaryCompany';
import { ErrorMessages } from '../../utils/errors';
import { User } from '../../entities/users';
import { validatePayInUser } from '../PayUsers/services';

/**
 * list a domiciliaryCompanys
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<DomiciliaryCompany[]>}
 */
export const listDomiciliaryCompanyByIdService = async (manager: EntityManager, id: string): Promise<DomiciliaryCompany | undefined> => {
  const domiciliaryCompanys = await manager.findOne(DomiciliaryCompany, {
    where: { id },
    relations: ['company', 'domiciliary']
  });
  return domiciliaryCompanys;
};

/**
 * list a domiciliaryCompanys by domiciliary
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<DomiciliaryCompany[]>}
 */
export const listDomiciliaryCompanyByDomiciliaryService = async (manager: EntityManager, domiciliaryId: number): Promise<DomiciliaryCompany[]> => {
  try {
    const domiciliaryCompanys = await manager.find(DomiciliaryCompany, {
      where: { domiciliary: domiciliaryId },
      relations: ['company', 'domiciliary']
    });
    return domiciliaryCompanys;
  } catch (error) {
    console.error(error);
    throw Boom.badRequest(ErrorMessages.ERROR_DOMICILIARY_COMPANY_NOT_FOUND);
  }
};

/**
 * list a domiciliaryCompanys by company
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<DomiciliaryCompany[]>}
 */
export const listDomiciliaryCompanyByCompanyService = async (manager: EntityManager, companyId: string): Promise<DomiciliaryCompany[]> => {
  try {
    const domiciliaryCompanys = await manager.find(DomiciliaryCompany, {
      where: { company: companyId },
      relations: ['company', 'domiciliary']
    });
    return domiciliaryCompanys;
  } catch (error) {
    console.error(error);
    throw Boom.badRequest(ErrorMessages.ERROR_DOMICILIARY_COMPANY_NOT_FOUND);
  }
};

/**
 * list all domiciliaryCompanys
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<DomiciliaryCompany[]>}
 */
export const listDomiciliaryCompanyService = async (manager: EntityManager,): Promise<DomiciliaryCompany[]> => {
  const domiciliaryCompanys = await manager.find(DomiciliaryCompany, {
    relations: ['company', 'domiciliary']
  });
  return domiciliaryCompanys;
};

/**
 * Create a DomiciliaryCompany
 *
 * @param {EntityManager} manager DB connection
 * @param {number} company company.
 * @param {number} domiciliary domiciliary.
 * @return {Promise<DomiciliaryCompany>}
 */
export const createDomiciliaryCompanyService = async (
  manager: EntityManager,
  company: number,
  domiciliary: number,
): Promise<DomiciliaryCompany> => {
  const DomiciliaryCompanyExists = await manager.find(DomiciliaryCompany, { where: { company, domiciliary } });
  if (DomiciliaryCompanyExists.length) {
    throw Boom.badRequest(ErrorMessages.ERROR_DOMICILIARY_COMPANY_ALREADY_EXIST);
  }
  const userCompanyRequest = await manager.findOne(User, { where: { id: company } });
  if (!userCompanyRequest) {
    throw Boom.badRequest(ErrorMessages.ERROR_USER_COMPANY_NOT_FOUND);
  }
  await validatePayInUser(manager, userCompanyRequest);
  const userDomiciliaryRequest = await manager.findOne(User, { where: { id: domiciliary } });
  if (!userDomiciliaryRequest) {
    throw Boom.badRequest(ErrorMessages.ERROR_USER_DOMICILIARY_NOT_FOUND);
  }
  const newDomiciliaryCompany = new DomiciliaryCompany();
  newDomiciliaryCompany.company = userCompanyRequest;
  newDomiciliaryCompany.domiciliary = userDomiciliaryRequest;
  try {
    return await manager.save(newDomiciliaryCompany);
  } catch (error) {
    console.error('Error saving domiciliaryCompany change request: ', error);
    throw Boom.badGateway(ErrorMessages.ERROR_DOMICILIARY_COMPANY_UNEXPECTED);
  }
};

/**
 * Update a DomiciliaryCompany
 *
 * @param {EntityManager} manager DB connection
 * @param {number} company company.
 * @param {number} domiciliary domiciliary.
 * @return {Promise<DomiciliaryCompany[]>}
 */
export const updateDomiciliaryCompanyService = async (
  manager: EntityManager,
  id: string,
  company: number | null = null,
  domiciliary: number | null = null,
): Promise<DomiciliaryCompany> => {
  const domiciliaryCompany = await manager.findOne(DomiciliaryCompany, { where: { id: id } });
  if (!domiciliaryCompany) {
    throw Boom.notFound(ErrorMessages.ERROR_DOMICILIARY_COMPANY_NOT_FOUND);
  }
  if (company) {
    const userCompanyRequest = await manager.findOne(User, { where: { id: company } });
    if (!userCompanyRequest) {
      throw Boom.badRequest(ErrorMessages.ERROR_USER_COMPANY_NOT_FOUND);
    }
    domiciliaryCompany.company = userCompanyRequest;
    await validatePayInUser(manager, userCompanyRequest);
  }
  if (domiciliary) {
    const userDomiciliaryRequest = await manager.findOne(User, { where: { id: domiciliary } });
    if (!userDomiciliaryRequest) {
      throw Boom.badRequest(ErrorMessages.ERROR_USER_DOMICILIARY_NOT_FOUND);
    }
    domiciliaryCompany.domiciliary = userDomiciliaryRequest;
  }
  try {
    return await manager.save(domiciliaryCompany);
  } catch (error) {
    console.error('Error saving domiciliaryCompany change request: ', error);
    throw Boom.badGateway(ErrorMessages.ERROR_DOMICILIARY_COMPANY_UNEXPECTED);
  }
};

/**
 * Delete a DomiciliaryCompany
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompany>}
 */
export const deleteDomiciliaryCompanyService = async (manager: EntityManager, id: string): Promise<DomiciliaryCompany> => {
  const dataDomiciliaryCompany = await manager.findOne(DomiciliaryCompany, id);
  if (!dataDomiciliaryCompany) throw Boom.badRequest(ErrorMessages.ERROR_DOMICILIARY_COMPANY_NOT_FOUND);

  try {
    return await manager.remove(DomiciliaryCompany, dataDomiciliaryCompany);
  } catch (error) {
    console.error('Delete domiciliaryCompany error', error);
    throw Boom.internal(ErrorMessages.ERROR_DOMICILIARY_COMPANY_UNEXPECTED);
  }
};
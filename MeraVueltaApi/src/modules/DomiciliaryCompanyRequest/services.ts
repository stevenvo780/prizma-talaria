import Boom from '@hapi/boom';
import { EntityManager } from 'typeorm';
import { DomiciliaryCompanyRequest, statusRequest } from '../../entities/domiciliaryCompanyRequest';
import { DomiciliaryCompany } from '../../entities/domiciliaryCompany';
import { User, UserRoleOptions } from '../../entities/users';
import { ErrorMessages } from '../../utils/errors';
import {
  createDomiciliaryCompanyService,
} from '../DomiciliaryCompany/services';
import { validatePayInUser } from '../PayUsers/services';

/**
 * list a domiciliarys by company
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<DomiciliaryCompanyRequest[]>}
 */
export const listDomiciliarysByCompanyService = async (manager: EntityManager, companyId: string): Promise<User[]> => {
  const domiciliaryCompanyRequests = await manager.find(DomiciliaryCompanyRequest, {
    where: { company: companyId },
    relations: ['company', 'domiciliary']
  });
  const domiciliaryCompany = await manager.find(DomiciliaryCompany, {
    where: { company: companyId },
    relations: ['company', 'domiciliary']
  });
  const usersDomiciliary = await manager.find(User, {
    where: { role: UserRoleOptions.DOMICILIARY },
  });
  const usersValidate: User[] = [];
  usersDomiciliary.forEach(user => {
    let validate = false;
    domiciliaryCompany.forEach(domiciliary => {
      if (user.id === domiciliary.domiciliary.id) {
        validate = true;
      }
    }
    );
    domiciliaryCompanyRequests.forEach(domiciliary => {
      if (user.id === domiciliary.domiciliary.id) {
        validate = true;
      }
    }
    );
    if (!validate) {
      usersValidate.push(user);
    }
  }
  );
  return usersValidate;
};


/**
 * list all domiciliaryCompanyRequests by companyId
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<DomiciliaryCompanyRequest[]>}
 */
export const listDomiciliaryCompanyRequestByCompanyService = async (manager: EntityManager, companyId: number): Promise<DomiciliaryCompanyRequest[]> => {
  const domiciliaryCompanyRequests = await manager.find(DomiciliaryCompanyRequest, {
    where: { company: companyId },
    relations: ['company', 'domiciliary']
  }
  );
  return domiciliaryCompanyRequests;
};

/**
 * list all domiciliaryCompanyRequests by domicialyId
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<DomiciliaryCompanyRequest[]>}
 */
export const listDomiciliaryCompanyRequestByDomiciliaryService = async (manager: EntityManager, domicialyId: number): Promise<DomiciliaryCompanyRequest[]> => {
  const domiciliaryCompanyRequests = await manager.find(DomiciliaryCompanyRequest, {
    where: { domiciliary: domicialyId },
    relations: ['company', 'domiciliary']
  }
  );
  return domiciliaryCompanyRequests;
};

/**
 * list a domiciliaryCompanyRequests
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<DomiciliaryCompanyRequest[]>}
 */
export const listDomiciliaryCompanyRequestByIdService = async (manager: EntityManager, id: string): Promise<DomiciliaryCompanyRequest | undefined> => {
  const domiciliaryCompanyRequests = await manager.findOne(DomiciliaryCompanyRequest, { where: { id }, relations: ['company', 'domiciliary'] });
  return domiciliaryCompanyRequests;
};

/**
 * list all domiciliaryCompanyRequests
 *
 * @param {EntityManager} manager DB connection
 * @return {Promise<DomiciliaryCompanyRequest[]>}
 */
export const listDomiciliaryCompanyRequestService = async (manager: EntityManager,): Promise<DomiciliaryCompanyRequest[]> => {
  const domiciliaryCompanyRequests = await manager.find(DomiciliaryCompanyRequest, { relations: ['company', 'domiciliary'] });
  return domiciliaryCompanyRequests;
};

/**
 * Create a DomiciliaryCompanyRequest
 *
 * @param {EntityManager} manager DB connection
 * @param {number} company company.
 * @param {number} domiciliary domiciliary.
 * @return {Promise<DomiciliaryCompanyRequest>}
 */
export const createDomiciliaryCompanyRequestService = async (
  manager: EntityManager,
  company: number,
  domiciliary: number,
): Promise<DomiciliaryCompanyRequest> => {
  const domiciliaryCompanyExist = await manager.find(DomiciliaryCompany, { where: { company, domiciliary } });
  if (domiciliaryCompanyExist.length) {
    throw Boom.badRequest(ErrorMessages.ERROR_DOMICILIARY_COMPANY_EXIST);
  }
  const domiciliaryCompanyRequestExist = await manager.find(DomiciliaryCompanyRequest, { where: { company, domiciliary } });
  if (domiciliaryCompanyRequestExist.length) {
    throw Boom.badRequest(ErrorMessages.ERROR_DOMICILIARY_COMPANY_REQUEST_EXIST);
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
  const newDomiciliaryCompanyRequest = new DomiciliaryCompanyRequest();
  newDomiciliaryCompanyRequest.company = userCompanyRequest;
  newDomiciliaryCompanyRequest.domiciliary = userDomiciliaryRequest;
  newDomiciliaryCompanyRequest.state = statusRequest.PENDING;
  try {
    return await manager.save(newDomiciliaryCompanyRequest);
  } catch (error) {
    console.error('Error saving domiciliaryCompanyRequest change request: ', error);
    throw Boom.badGateway(ErrorMessages.ERROR_DOMICILIARY_COMPANY_UNEXPECTED);
  }

};

/**
 * Update a DomiciliaryCompanyRequest
 *
 * @param {EntityManager} manager DB connection
 * @param {number} company company.
 * @param {number} domiciliary domiciliary.
 * @return {Promise<DomiciliaryCompanyRequest[]>}
 */
export const updateDomiciliaryCompanyRequestService = async (
  manager: EntityManager,
  id: string,
  company: number | null = null,
  domiciliary: number | null = null,
  state: string | null = null,
): Promise<DomiciliaryCompanyRequest> => {
  const domiciliaryCompanyRequest = await manager.findOne(DomiciliaryCompanyRequest, {
    where: { id: id },
    relations: ['company', 'domiciliary']
  });
  if (!domiciliaryCompanyRequest) {
    throw Boom.notFound(ErrorMessages.ERROR_DOMICILIARY_COMPANY_NOT_FOUND);
  }
  if (company) {
    const userCompanyRequest = await manager.findOne(User, { where: { id: company } });
    if (!userCompanyRequest) {
      throw Boom.badRequest(ErrorMessages.ERROR_USER_COMPANY_NOT_FOUND);
    }
    domiciliaryCompanyRequest.company = userCompanyRequest;
    await validatePayInUser(manager, userCompanyRequest);
  }
  if (domiciliary) {
    const userDomiciliaryRequest = await manager.findOne(User, { where: { id: domiciliary } });
    if (!userDomiciliaryRequest) {
      throw Boom.badRequest(ErrorMessages.ERROR_USER_DOMICILIARY_NOT_FOUND);
    }
    domiciliaryCompanyRequest.domiciliary = userDomiciliaryRequest;
  }
  if (state) {
    if (state === statusRequest.AGREE) {
      const domiciliaryCompanyExist = await manager.find(DomiciliaryCompany, { where: { company, domiciliary } });
      if (domiciliaryCompanyExist.length) {
        throw Boom.badRequest(ErrorMessages.ERROR_DOMICILIARY_COMPANY_EXIST);
      }
      await createDomiciliaryCompanyService(manager, domiciliaryCompanyRequest.company.id, domiciliaryCompanyRequest.domiciliary.id);
      try {
        return await manager.remove(DomiciliaryCompanyRequest, domiciliaryCompanyRequest);
      } catch (error) {
        console.error('Error saving domiciliaryCompanyRequest change request: ', error);
        throw Boom.badGateway(ErrorMessages.ERROR_DOMICILIARY_COMPANY_UNEXPECTED);
      }
    }
    if (domiciliaryCompanyRequest.state === statusRequest.REFUSED) {
      try {
        return await manager.remove(DomiciliaryCompanyRequest, domiciliaryCompanyRequest);
      } catch (error) {
        console.error('Error saving domiciliaryCompanyRequest change request: ', error);
        throw Boom.badGateway(ErrorMessages.ERROR_DOMICILIARY_COMPANY_UNEXPECTED);
      }
    }
    domiciliaryCompanyRequest.state = state;
  }
  try {
    return await manager.save(domiciliaryCompanyRequest);
  } catch (error) {
    console.error('Error saving domiciliaryCompanyRequest change request: ', error);
    throw Boom.badGateway(ErrorMessages.ERROR_DOMICILIARY_COMPANY_UNEXPECTED);
  }
};

/**
 * Delete a DomiciliaryCompanyRequest
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<DomiciliaryCompanyRequest>}
 */
export const deleteDomiciliaryCompanyRequestService = async (manager: EntityManager, id: string): Promise<DomiciliaryCompanyRequest> => {
  const dataDomiciliaryCompanyRequest = await manager.findOne(DomiciliaryCompanyRequest, id);
  if (!dataDomiciliaryCompanyRequest) throw Boom.badRequest(ErrorMessages.ERROR_DOMICILIARY_COMPANY_NOT_FOUND);

  try {
    return await manager.remove(DomiciliaryCompanyRequest, dataDomiciliaryCompanyRequest);
  } catch (error) {
    console.error('Delete domiciliaryCompanyRequest error', error);
    throw Boom.internal(ErrorMessages.ERROR_DOMICILIARY_COMPANY_UNEXPECTED);
  }
};
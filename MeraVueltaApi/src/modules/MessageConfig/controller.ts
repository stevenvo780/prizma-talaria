import { Request, ResponseToolkit } from '@hapi/hapi';
import { getManager } from 'typeorm';
import { MessageConfig } from '../../entities/messageConfig';
import {
  getMessageConfigsService,
  createMessageConfigService,
  updateMessageConfigService,
  deleteMessageConfigService,
  getMessageConfigByKeyService
} from './services';

export const getMessageConfigs = async (request: Request, h: ResponseToolkit) => {
  const manager = getManager();
  const companyId = request.auth.credentials.user.id;
  
  try {
    const messageConfigs = await getMessageConfigsService(manager, companyId);
    return h.response(messageConfigs).code(200);
  } catch (error) {
    return h.response({ error: (error as Error).message }).code(500);
  }
};

export const createMessageConfig = async (request: Request, h: ResponseToolkit) => {
  const manager = getManager();
  const companyId = request.auth.credentials.user.id;
  const messageConfigData = request.payload as Partial<MessageConfig>;
  
  try {
    const messageConfig = await createMessageConfigService(manager, companyId, messageConfigData);
    return h.response(messageConfig).code(201);
  } catch (error) {
    return h.response({ error: (error as Error).message }).code(500);
  }
};

export const updateMessageConfig = async (request: Request, h: ResponseToolkit) => {
  const manager = getManager();
  const companyId = request.auth.credentials.user.id;
  const { id } = request.params;
  const messageConfigData = request.payload as Partial<MessageConfig>;
  
  try {
    const messageConfig = await updateMessageConfigService(manager, companyId, id, messageConfigData);
    return h.response(messageConfig).code(200);
  } catch (error) {
    return h.response({ error: (error as Error).message }).code(500);
  }
};

export const deleteMessageConfig = async (request: Request, h: ResponseToolkit) => {
  const manager = getManager();
  const companyId = request.auth.credentials.user.id;
  const { id } = request.params;
  
  try {
    await deleteMessageConfigService(manager, companyId, id);
    return h.response({ message: 'Configuración de mensaje eliminada' }).code(200);
  } catch (error) {
    return h.response({ error: (error as Error).message }).code(500);
  }
};

export const getMessageConfigByKey = async (request: Request, h: ResponseToolkit) => {
  const manager = getManager();
  const companyId = request.auth.credentials.user.id;
  const { key } = request.params;
  
  try {
    const messageConfig = await getMessageConfigByKeyService(manager, companyId, key);
    return h.response(messageConfig).code(200);
  } catch (error) {
    return h.response({ error: (error as Error).message }).code(500);
  }
};
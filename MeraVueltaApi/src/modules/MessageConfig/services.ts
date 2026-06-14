import { EntityManager } from 'typeorm';
import { MessageConfig } from '../../entities/messageConfig';
import { User } from '../../entities/users';
import Boom from '@hapi/boom';

export const getMessageConfigsService = async (manager: EntityManager, companyId: string): Promise<MessageConfig[]> => {
  const messageConfigs = await manager.find(MessageConfig, {
    where: { company: { id: companyId } },
    relations: ['company']
  });
  
  return messageConfigs;
};

export const createMessageConfigService = async (
  manager: EntityManager, 
  companyId: string, 
  messageConfigData: Partial<MessageConfig>
): Promise<MessageConfig> => {
  const company = await manager.findOne(User, { where: { id: companyId } });
  
  if (!company) {
    throw Boom.notFound('Empresa no encontrada');
  }

  const messageConfig = new MessageConfig();
  messageConfig.company = company;
  messageConfig.messageKey = messageConfigData.messageKey || '';
  messageConfig.messageText = messageConfigData.messageText || '';
  messageConfig.isActive = messageConfigData.isActive ?? true;
  messageConfig.description = messageConfigData.description || '';

  return await manager.save(messageConfig);
};

export const updateMessageConfigService = async (
  manager: EntityManager, 
  companyId: string, 
  id: string, 
  messageConfigData: Partial<MessageConfig>
): Promise<MessageConfig> => {
  const messageConfig = await manager.findOne(MessageConfig, {
    where: { id, company: { id: companyId } },
    relations: ['company']
  });

  if (!messageConfig) {
    throw Boom.notFound('Configuración de mensaje no encontrada');
  }

  if (messageConfigData.messageKey !== undefined) {
    messageConfig.messageKey = messageConfigData.messageKey;
  }
  if (messageConfigData.messageText !== undefined) {
    messageConfig.messageText = messageConfigData.messageText;
  }
  if (messageConfigData.isActive !== undefined) {
    messageConfig.isActive = messageConfigData.isActive;
  }
  if (messageConfigData.description !== undefined) {
    messageConfig.description = messageConfigData.description;
  }

  return await manager.save(messageConfig);
};

export const deleteMessageConfigService = async (
  manager: EntityManager, 
  companyId: string, 
  id: string
): Promise<void> => {
  const messageConfig = await manager.findOne(MessageConfig, {
    where: { id, company: { id: companyId } }
  });

  if (!messageConfig) {
    throw Boom.notFound('Configuración de mensaje no encontrada');
  }

  await manager.remove(messageConfig);
};

export const getMessageConfigByKeyService = async (
  manager: EntityManager, 
  companyId: string, 
  key: string
): Promise<MessageConfig | null> => {
  const messageConfig = await manager.findOne(MessageConfig, {
    where: { 
      messageKey: key, 
      company: { id: companyId },
      isActive: true 
    },
    relations: ['company']
  });

  return messageConfig || null;
};
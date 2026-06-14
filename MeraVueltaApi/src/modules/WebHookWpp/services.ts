import { User } from '../../entities/users';
import { WppMessagesUser } from '../../entities/wppMessagesUser';
import { sendMessage, sendAuth } from '../../utils/whatsapp';
import { EntityManager, MoreThanOrEqual } from 'typeorm';

export const handlerMessagesWpp = async (message: any, manager: EntityManager) => {
  //console.info('handlerMessagesWpp', JSON.stringify(message, null, 2));
  if (
    message?.entry &&
    message?.entry?.length > 0 &&
    message?.entry[0].changes?.length > 0 &&
    message?.entry[0].changes[0].value?.messages &&
    message?.entry[0].changes[0].value?.messages.length > 0 &&
    message?.entry[0].changes[0].value?.contacts &&
    message?.entry[0].changes[0].value?.contacts.length > 0 &&
    message?.entry[0].changes[0].value?.messages[0].button?.payload === 'Notificame'
  ) {
    const phoneClient = message.entry[0].changes[0].value.contacts[0].wa_id.substring(2);
    const user = await manager.findOne(User, { where: { clientPhone: phoneClient } });
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 2);
    const lastMessages = await manager.find(WppMessagesUser, {
      where: {
        to: message.entry[0].changes[0].value.contacts[0].wa_id,
        createdAt: MoreThanOrEqual(twentyFourHoursAgo)
      },
      order: { id: 'DESC' }
    });
    if (user) {
      if (lastMessages.length > 0) {
        lastMessages.forEach(lastMessage => {
          sendMessage(lastMessage.message, message.entry[0].changes[0].value.contacts[0].wa_id, manager, user,);
        });
      }
    } else {
      if (lastMessages.length > 0) {
        lastMessages.forEach(lastMessage => {
          sendMessage(lastMessage.message, message.entry[0].changes[0].value.contacts[0].wa_id, manager);
        });
      }
    }
  } else if (
    message?.entry &&
    message?.entry?.length > 0 &&
    message?.entry[0].changes?.length > 0 &&
    message?.entry[0].changes[0].value?.statuses &&
    message?.entry[0].changes[0].value?.statuses.length > 0 &&
    message?.entry[0].changes[0].value?.statuses[0].status === 'failed'
  ) {
    const phoneClient = message?.entry[0]?.changes[0].value?.statuses[0].recipient_id.substring(2);
    const user = await manager.findOne(User, { where: { clientPhone: phoneClient } });
    if (user) {
      sendAuth(message?.entry[0]?.changes[0].value?.statuses[0].recipient_id, user);
    } else {
      sendAuth(message?.entry[0]?.changes[0].value?.statuses[0].recipient_id);
    }
  }
};

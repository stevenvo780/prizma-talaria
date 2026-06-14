import axios from 'axios';
import { User } from '../entities/users';
import { EntityManager } from 'typeorm';
import { WppMessagesUser } from '../entities/wppMessagesUser';
const url = `https://graph.facebook.com/${process.env.WPP_VERSION}/${process.env.WPP_PHONE_NUMBER_ID}`;

export async function sendMessage(message: string, number: string, manager: EntityManager, user: User | null = null): Promise<any> {
  // Create Token
  const urlMessages = url + '/messages';
  const data = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'text',
    text: {
      preview_url: false,
      body: message
    }
  };
  const response = await axios.post(
    urlMessages,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.WPP_TOKEN}`
      }
    }
  );
  const wppMessagesUser = new WppMessagesUser();
  wppMessagesUser.log = JSON.stringify(response.data);
  wppMessagesUser.message = message;
  if(user){
    wppMessagesUser.user = user;
  }
  wppMessagesUser.to = number;
  await manager.save(wppMessagesUser);
  const json = response.data;
  return json;
}

export async function sendAuth(number: string, user: User | null = null): Promise<any> {
  const urlMessages = url + '/messages';
  let template = '';
  if (user && user.role === 'domiciliary') {
    template = 'welcome_dm';
  } else if (user && user.role === 'company') {
    template = 'welcome_company';
  } else {
    template = 'welcome_cl';
  }
  const data = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'template',
    template: {
      name: template,
      language: {
        code: 'es'
      }
    }
  };
  const responseToken = await axios.post(
    urlMessages,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.WPP_TOKEN}`
      }
    }
  );
  const json = responseToken.data;
  //console.info('Auth wpp', JSON.stringify(json, null, 2));
  return json;
}

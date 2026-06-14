/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import config from '../config';

export enum TEMPLATES_EMAIL {
  WELCOME = 4595811,
  RECOVER_PASSWORD = 4577743,
  QUESTION_EMAIL = 4574939,
}

interface Email {
  email: string;
  name?: string;
}

/**
 * It get all elements by subcategory, skin and gender
 *
 * @param {Email} from From email
 * @param {Email} to To email
 * @param {number} templateId Template id email
 * @param {string} subject Email subject
 * @param {any} data Body email
 * @param {any} attachments Attachments
 * @return {any}
 */
export async function sendEmail(
  from: Email,
  to: Email,
  templateId: number,
  subject: string,
  data: any,
  attachments: any = []
) {
  const mailjet = require('node-mailjet').connect(config.mailProvider.public, config.mailProvider.private);
  const request = await mailjet
    .post('send', {
      version: 'v3.1',
    })
    .request({
      Messages: [
        {
          From: {
            Email: from.email,
            Name: from.name,
          },
          To: [
            {
              Email: to.email,
              Name: to.name,
            },
          ],
          TemplateID: templateId,
          TemplateLanguage: true,
          TemplateErrorDeliver: true,
          TemplateErrorReporting: {
            Email: config.mailProvider.errorEmail,
            Name: 'Reporte de error API Emails Indielevelstudio',
          },
          Subject: subject,
          Variables: data,
          Attachments: attachments,
        },
      ],
    });
  return request;
}

export async function parameterEmail(dataTemplate:number, dataName:string, dataEmail: string, dataVariable ) {
  try {
    const template = dataTemplate;

    const from = {
      name: config.mailProvider.name,
      email: config.mailProvider.email
    };

    const to = {
      name: dataName,
      email: dataEmail
    };

    const data = dataVariable;

    return {template, from, to, data};
  } catch (error) {
    throw new Error('Error al crear correo');
  }
}
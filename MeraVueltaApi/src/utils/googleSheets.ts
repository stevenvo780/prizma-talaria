/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SheetsOrder } from '../modules/GoogleSheets/types';
import { GoogleSpreadsheet } from 'google-spreadsheet';

function extractSpreadsheetId(input: string | null | undefined): string | null {
  if (!input) {
    return null;
  }
  const trimmed = input.trim();
  const directMatch = trimmed.match(/\/d\/(?:e\/)?([a-zA-Z0-9-_]+)/);
  if (directMatch?.[1]) {
    return directMatch[1];
  }
  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  if (queryMatch?.[1]) {
    return queryMatch[1];
  }
  const plainId = trimmed.match(/^[a-zA-Z0-9-_]{20,}$/);
  if (plainId) {
    return trimmed;
  }
  return null;
}

async function authenticateDoc(spreadsheetUrl: string) {
  try {
    const spreadsheetId = extractSpreadsheetId(spreadsheetUrl);
    if (!spreadsheetId) {
      throw new Error('Invalid Google Sheets URL. Use the full share link (https://docs.google.com/spreadsheets/d/...).');
    }
    const doc = new GoogleSpreadsheet(spreadsheetId);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();
    return doc;
  } catch (error: any) {
    const resp = (error as any)?.response;
    const status = resp?.status;
    const reasons = {
      spreadsheetUrl,
      message: (error as any)?.message,
      code: (error as any)?.code,
      status,
      hint: status === 403
        ? 'Share the spreadsheet with the service account email (GOOGLE_SERVICE_CLIENT_EMAIL) as Editor.'
        : status === 404
          ? 'Verify the spreadsheet ID extracted from the URL and ensure the sheet exists.'
          : undefined,
    };
    console.error('Google Sheets auth/load error', reasons);
    throw error;
  }
}

async function sheetsGet(spreadsheetUrl: string, sheetPage = 0): Promise<any> {
  const doc = await authenticateDoc(spreadsheetUrl);

  const sheet = doc.sheetsByIndex[sheetPage];

  const rows = await sheet.getRows({ raw: true });
  const values: any = [];
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const object = {};
    row._sheet.headerValues.forEach((header, index) => {
      object[header] = row._rawData[index];
    });
    values.push(object);
  }
  return values;
}

export async function sheetsUpdateMassive(spreadsheetUrl: string, data: SheetsOrder[]): Promise<{
  rows: SheetsOrder[],
  error: boolean,
}>{
  const doc = await authenticateDoc(spreadsheetUrl);
  const rows: SheetsOrder[] = [];
  try {
    const ordersByIndex: SheetsOrder[][] = [[], [], []];
    for (let index = 0; index < data.length; index++) {
      const orderData = data[index];
      let indexSave = 1;
      if (orderData.EstadoPedido == 'Compra' || orderData.EstadoPedido == '' || orderData.NumeroDeEntrega.length === 0) {
        indexSave = 0;
      } else if (orderData.EstadoPedido == 'Entregada') {
        indexSave = 2;
      }
      if (!doc.sheetsByIndex[indexSave]) {
        throw new Error(`Sheet index ${indexSave} is not available. Ensure the spreadsheet has three sheets (Compra, En proceso, Entregada) in positions 0-2.`);
      }
      const sheet = doc.sheetsByIndex[indexSave];
      rows.push(orderData);
      ordersByIndex[indexSave].push(orderData);
      doc.sheetsByIndex[indexSave] = sheet;
    }
    for (let index = 0; index < ordersByIndex.length; index++) {
      const sheet = doc.sheetsByIndex[index];
      if (!sheet) {
        throw new Error(`Sheet index ${index} is not available. Ensure the spreadsheet structure matches the expected template.`);
      }
      await sheet.clearRows();
      const orders = ordersByIndex[index];
      if (orders.length > 0) {
        await sheet.addRows(orders);
      }
    }
    return {
      rows,
      error: false,
    };
  } catch (error: any) {
    console.error('sheetsUpdateMassive error', {
      message: (error as any)?.message,
      code: (error as any)?.code,
      response: (error as any)?.response?.status,
    });
    return {
      rows,
      error: true,
    };
  }
}

async function sheetsValidateExist(spreadsheetUrl: string, searchId: any): Promise<any> {
  const doc = await authenticateDoc(spreadsheetUrl);
  for (let index = 0; index < doc.sheetsByIndex.length; index++) {
    const sheet = doc.sheetsByIndex[index];
    const rows = await sheet.getRows();

    for (const row of rows) {
      let match = false;
      if (row.NumeroDeCompra == searchId || row.NumeroDeEntrega == searchId) {
        match = true;
      }
      if (match) {
        const object = {};
        row._sheet.headerValues.forEach((header, index) => {
          object[header] = row._rawData[index];
        });
        return object;
      }
    }
  }
  return null;
}

async function sheetsGetOne(spreadsheetUrl: string, searchId: any, sheetPage = 0): Promise<any> {
  const doc = await authenticateDoc(spreadsheetUrl);
  const sheet = doc.sheetsByIndex[sheetPage];
  const rows = await sheet.getRows();

  for (const row of rows) {
    let match = false;
    if (row.NumeroDeCompra == searchId || row.NumeroDeEntrega == searchId) {
      match = true;
    }
    if (match) {
      const object = {};
      row._sheet.headerValues.forEach((header, index) => {
        object[header] = row._rawData[index];
      });
      return object;
    }
  }

  return null;
}


async function sheetsPost(spreadsheetUrl: string, data: any, sheetPage = 0): Promise<any> {
  const doc = await authenticateDoc(spreadsheetUrl);
  const sheet = doc.sheetsByIndex[sheetPage];
  await sheet.addRow(data);
  const rows = await sheet.getRows();

  const object = {};
  rows[rows.length - 1]._sheet.headerValues.forEach((header, index) => {
    object[header] = rows[rows.length - 1]._rawData[index];
  });
  return object;
}


async function sheetsPatch(spreadsheetUrl: string, searchId: any, data: any, sheetPage = 0): Promise<any> {
  const doc = await authenticateDoc(spreadsheetUrl);
  const sheet = doc.sheetsByIndex[sheetPage];

  const rows = await sheet.getRows();
  for (const row of rows) {
    let match = false;
    if (row.NumeroDeCompra == searchId || row.NumeroDeEntrega == searchId) {
      match = true;
    }
    if (match) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          row[key] = data[key];
        }
      }
      await row.save();
      const object = {};
      row._sheet.headerValues.forEach((header, index) => {
        object[header] = row._rawData[index];
      });
      return object;
    }
  }
}


async function sheetsDelete(spreadsheetUrl: string, searchId: any, sheetPage = 0): Promise<boolean> {
  const doc = await authenticateDoc(spreadsheetUrl);
  const sheet = doc.sheetsByIndex[sheetPage];
  const rows = await sheet.getRows();

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    let match = false;
    if (row.NumeroDeCompra == searchId || row.NumeroDeEntrega == searchId) {
      match = true;
    }
    if (match) {
      await row.delete();
      return true;
    }
  }
  return false;
}

async function moveAndUpdateRow(
  spreadsheetUrl: string,
  searchId: any,
  sourceSheetIndex: number,
  targetSheetIndex: number,
  newData: any
): Promise<boolean> {
  const doc = await authenticateDoc(spreadsheetUrl);

  const sourceSheet = doc.sheetsByIndex[sourceSheetIndex];
  const targetSheet = doc.sheetsByIndex[targetSheetIndex];

  const sourceRows = await sourceSheet.getRows();
  const sourceRow = sourceRows.find(row => row.NumeroDeCompra == searchId || row.NumeroDeEntrega == searchId);
  if (!sourceRow) {
    return false;
  }

  for (const key in newData) {
    if (Object.prototype.hasOwnProperty.call(newData, key)) {
      sourceRow[key] = newData[key];
    }
  }

  const newRowData = {};
  sourceRow._sheet.headerValues.forEach((header, index) => {
    newRowData[header] = sourceRow._rawData[index];
  });
  await targetSheet.addRow(newRowData);

  await sourceRow.delete();

  return true;
}


export { sheetsGet, sheetsPost, sheetsPatch, sheetsDelete, sheetsGetOne, sheetsValidateExist, moveAndUpdateRow };


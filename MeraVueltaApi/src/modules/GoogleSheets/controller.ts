import { EntityManager } from 'typeorm';
import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { ErrorMessages } from '../../utils/errors';
import { User } from '../../entities/users';
import { sheetsGet, sheetsGetOne, sheetsPost, sheetsPatch, sheetsDelete, sheetsValidateExist } from '../../utils/googleSheets';
import { SheetsOrder } from './types';

/**
 * Returns a googleSheets
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<GoogleSheets[]>}
 */
export async function getGoogleSheets(req: Hapi.request): Promise<SheetsOrder> {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  const id = req.params.id;
  const sheet = req.query.sheet;
  const user = await manager.findOne(User, { where: { id: userId } });
  if (user?.googleSheets) {
    const data = await sheetsGetOne(user?.googleSheets, id, sheet);
    if (data) {
      const domiciliary = await manager.findOne(User, { id: data.Domiciliario });
      if (domiciliary) {
        data.Domiciliario = domiciliary;
      } else if (data.Domiciliario == 0) {
        data.Domiciliario = null;
      }
      return data;
    } else {
      throw Boom.notFound(ErrorMessages.ERROR_GOOGLE_SHEETS_NOT_FOUND);
    }
  } else {
    throw Boom.notFound(ErrorMessages.ERROR_GOOGLE_SHEETS_NOT_EXIST_URL);
  }
}


/**
 * Return all categories
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<GoogleSheets[]>}
 */
export const getAllGoogleSheets = async (
  req: Hapi.request
): Promise<SheetsOrder[]> => {
  const manager: EntityManager = req.server.app.connection.manager;
  const userId = req.auth.credentials.id;
  const sheet = req.query.sheet;
  const user = await manager.findOne(User, { where: { id: userId } });
  if (user?.googleSheets) {
    const data = await sheetsGet(user?.googleSheets, sheet);
    const returnData: SheetsOrder[] = [];
    for (const item of data) {
      const domiciliary = await manager.findOne(User, { id: item.Domiciliario });
      if (domiciliary) {
        item.Domiciliario = domiciliary;
      } else if (item.Domiciliario == 0) {
        item.Domiciliario = null;
      }
      returnData.push(item);
    }
    return returnData;
  } else {
    return [];
  }
};

/**
 * Create googleSheets
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<GoogleSheets[]>}
 */
export async function createGoogleSheets(req: Hapi.request): Promise<SheetsOrder | undefined> {
  const manager: EntityManager = req.server.app.connection.manager;
  const sheet = req.query.sheet;
  const {
    NumeroDeCompra,
    NumeroDeEntrega,
    FechaCreacion,
    Email,
    TipoDeDocumento,
    Documento,
    Nombres,
    Apellidos,
    TelefonoCliente,
    Prefijo,
    DireccionEntrega,
    Departamento,
    Ciudad,
    Barrio,
    NombreConjuntoResidencial,
    NumeroDeCasaOApto,
    NotaEntrega,
    PaqueteAEntregar,
    UbicacionEntrega,
    GeolocalizacionEntrega,
    TipoDePago,
    EstadoPedido,
    Domiciliario,
    FotoRecogida,
    NotaDomiciliario,
    DireccionRecogida,
    HoraRecogida,
  } = req.payload;

  const userId = req.auth.credentials.id;
  const user = await manager.findOne(User, { where: { id: userId } });
  if (user?.googleSheets) {
    const allReadyExist = await sheetsValidateExist(user?.googleSheets, NumeroDeCompra);
    if (allReadyExist) {
      throw Boom.badRequest(ErrorMessages.ERROR_GOOGLE_SHEETS_EXIST);
    }
    const data: SheetsOrder = await sheetsPost(user?.googleSheets, {
      NumeroDeCompra,
      NumeroDeEntrega,
      FechaCreacion,
      Email,
      TipoDeDocumento,
      Documento,
      Nombres,
      Apellidos,
      TelefonoCliente,
      Prefijo,
      DireccionEntrega,
      Departamento,
      Ciudad,
      Barrio,
      NombreConjuntoResidencial,
      NumeroDeCasaOApto,
      NotaEntrega,
      PaqueteAEntregar,
      UbicacionEntrega,
      GeolocalizacionEntrega,
      TipoDePago,
      EstadoPedido,
      Domiciliario,
      FotoRecogida,
      NotaDomiciliario,
      DireccionRecogida,
      HoraRecogida,
    }, sheet);
    return data;
  }
}

/**
 * Update googleSheets
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<GoogleSheets>}
 */
export async function updateGoogleSheets(req: Hapi.request): Promise<SheetsOrder | undefined> {
  const sheet = req.query.sheet;
  try {
    const manager: EntityManager = req.server.app.connection.manager;
    const {
      NumeroDeCompra,
      NumeroDeEntrega,
      FechaCreacion,
      Email,
      TipoDeDocumento,
      Documento,
      Nombres,
      Apellidos,
      TelefonoCliente,
      Prefijo,
      DireccionEntrega,
      Departamento,
      Ciudad,
      Barrio,
      NombreConjuntoResidencial,
      NumeroDeCasaOApto,
      NotaEntrega,
      PaqueteAEntregar,
      UbicacionEntrega,
      GeolocalizacionEntrega,
      TipoDePago,
      EstadoPedido,
      Domiciliario,
      FotoRecogida,
      NotaDomiciliario,
      DireccionRecogida,
      HoraRecogida,
    } = req.payload;
    const id = req.params.id;

    const userId = req.auth.credentials.id;
    const user = await manager.findOne(User, { where: { id: userId } });
    if (user?.googleSheets) {
      const data: SheetsOrder = await sheetsPatch(user?.googleSheets, id, {
        NumeroDeCompra,
        NumeroDeEntrega,
        FechaCreacion,
        Email,
        TipoDeDocumento,
        Documento,
        Nombres,
        Apellidos,
        TelefonoCliente,
        Prefijo,
        DireccionEntrega,
        Departamento,
        Ciudad,
        Barrio,
        NombreConjuntoResidencial,
        NumeroDeCasaOApto,
        NotaEntrega,
        PaqueteAEntregar,
        UbicacionEntrega,
        GeolocalizacionEntrega,
        TipoDePago,
        EstadoPedido,
        Domiciliario,
        FotoRecogida,
        NotaDomiciliario,
        DireccionRecogida,
        HoraRecogida,
      }, sheet);
      return data;
    }
  } catch (error) {
    console.error('Update googleSheets error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_GOOGLE_SHEETS_UNEXPECTED);
  }
}

/**
 * Update googleSheets
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<GoogleSheets>}
 */
export async function deleteGoogleSheets(req: Hapi.request): Promise<boolean> {
  try {
    const manager: EntityManager = req.server.app.connection.manager;
    const id = req.params.id;
    const sheet = req.query.sheet;

    const userId = req.auth.credentials.id;
    const user = await manager.findOne(User, { where: { id: userId } });
    if (user?.googleSheets) {
      const data: boolean = await sheetsDelete(user?.googleSheets, id, sheet);
      return data;
    } else {
      return false;
    }

  } catch (error) {
    console.error('Delete googleSheets error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_GOOGLE_SHEETS_UNEXPECTED);
  }
}




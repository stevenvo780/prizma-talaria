import Boom from '@hapi/boom';
import { Order } from '../../../entities/order';
import { ErrorMessages } from '../../../utils/errors';
import { User } from '../../../entities/users';
import { sheetsUpdateMassive } from '../../../utils/googleSheets';
import { OrderInterfaceRequest, SheetsOrderAutomatic } from '../types';
import { SheetsOrder } from '../../GoogleSheets/types';
import cities from '../../../lib/cities.json';
import departments from '../../../lib/departments.json';
import { getLocation } from '../../../utils/searchLocation';
import { DomiciliaryCompany } from '../../../entities/domiciliaryCompany';
import { EntityManager } from 'typeorm';

/**
 * Convert data to Order in DB  to Order in Google Sheets
 *
 * @param {EntityManager} manager DB connection
 * @param {string} deliveryNumber deliveryNumber.
 * @param {Order} orderData orderData.
 * @return {Promise<Order[]>}
 */
export const convertDataOrderToSheetOrder = async (
  orderData: Order | OrderInterfaceRequest,
): Promise<SheetsOrder> => {
  let domiciliary: any = '';
  if (orderData.domiciliary) {
    if (typeof orderData.domiciliary === 'string') {
      domiciliary = orderData.domiciliary;
    } else {
      domiciliary = orderData.domiciliary.documentNumber;
    }
  }
  const dataSheets: SheetsOrder = {
    NumeroDeCompra: orderData?.purchaseNumber ? orderData.purchaseNumber.toString() : '',
    NumeroDeEntrega: orderData?.deliveryNumber ? orderData.deliveryNumber.toString() : '',
    FechaCreacion: orderData?.creationDate ? orderData.creationDate.toString() : '',
    Nombres: orderData?.name ? orderData.name : '',
    Apellidos: orderData?.lastName ? orderData.lastName : '',
    Email: orderData?.email ? orderData.email : '',
    Documento: orderData?.documentNumber ? orderData.documentNumber : '',
    TipoDeDocumento: orderData?.typeDocument ? orderData.typeDocument : '',
    TelefonoCliente: orderData?.clientPhone ? orderData.clientPhone : '',
    DireccionEntrega: orderData?.deliveryAddress ? orderData.deliveryAddress : '',
    Ciudad: orderData?.city ? orderData.city : '',
    Departamento: orderData?.department ? orderData.department : '',
    Barrio: orderData?.neighborhood ? orderData.neighborhood : '',
    NombreConjuntoResidencial: orderData?.residentialGroupName ? orderData.residentialGroupName : '',
    NumeroDeCasaOApto: orderData?.houseNumberOrApartment ? orderData.houseNumberOrApartment : '',
    NotaEntrega: orderData?.deliveryNote ? orderData.deliveryNote : '',
    PaqueteAEntregar: orderData?.deliveryPacket ? orderData.deliveryPacket : '',
    EstadoPedido: orderData?.orderState ? orderData.orderState : '',
    Domiciliario: domiciliary ? domiciliary : '',
    DireccionRecogida: orderData?.pickupAddress ? orderData.pickupAddress : '',
    HoraRecogida: orderData?.pickupTime ? orderData.pickupTime : '',
    UbicacionEntrega: orderData?.pickupLocation ? orderData.pickupLocation : '',
    TipoDePago: orderData?.paymentMethod ? orderData.paymentMethod : '',
    FotoRecogida: orderData?.pickupPicture ? orderData.pickupPicture : '',
    NotaDomiciliario: orderData?.dealerNote ? orderData.dealerNote : '',
    GeolocalizacionEntrega: orderData?.geolocationDelivery ? orderData.geolocationDelivery : '',
    Prefijo: orderData?.prefix ? orderData.prefix : '',
  };
  return dataSheets;
};

/**
 * Convert data to Order in DB  to Order in Google Sheets
 *
 * @param {EntityManager} manager DB connection
 * @param {string} deliveryNumber deliveryNumber.
 * @param {Order} orderData orderData.
 * @return {Promise<Order[]>}
 */
export const convertDataSheetOrderToOrder = async (
  manager: EntityManager,
  orderData: SheetsOrderAutomatic,
): Promise<Order> => {
  let domiciliary = await manager.findOne(User, {
    where: {
      id: orderData.Domiciliario,
    },
  });
  if (!domiciliary) {
    domiciliary = await manager.findOne(User, {
      where: {
        documentNumber: orderData.Domiciliario,
      },
    });
  }
  const dataSheets: Order = new Order();
  if (orderData?.NumeroDeCompra) {
    dataSheets.purchaseNumber = Number(orderData.NumeroDeCompra);
  }
  if (orderData?.FechaCreacion) {
    dataSheets.creationDate = new Date(orderData.FechaCreacion);
  }
  if (orderData?.Nombres) {
    dataSheets.name = orderData.Nombres;
  }
  if (orderData?.Apellidos) {
    dataSheets.lastName = orderData.Apellidos;
  }
  if (orderData?.Email) {
    dataSheets.email = orderData.Email;
  }
  if (orderData?.Documento) {
    dataSheets.documentNumber = orderData.Documento;
  }
  if (orderData?.TipoDeDocumento) {
    dataSheets.typeDocument = orderData.TipoDeDocumento;
  }
  if (orderData?.TelefonoCliente) {
    dataSheets.clientPhone = orderData.TelefonoCliente;
  }
  if (orderData?.DireccionEntrega) {
    dataSheets.deliveryAddress = orderData.DireccionEntrega;
  }
  if (orderData?.Ciudad) {
    dataSheets.city = orderData.Ciudad;
  }
  if (orderData?.Departamento) {
    dataSheets.department = orderData.Departamento;
  }
  if (orderData?.Barrio) {
    dataSheets.neighborhood = orderData.Barrio;
  }
  if (orderData?.NombreConjuntoResidencial) {
    dataSheets.residentialGroupName = orderData.NombreConjuntoResidencial;
  }
  if (orderData?.NumeroDeCasaOApto) {
    dataSheets.houseNumberOrApartment = orderData.NumeroDeCasaOApto;
  }
  if (orderData?.NotaEntrega) {
    dataSheets.deliveryNote = orderData.NotaEntrega;
  }
  if (orderData?.PaqueteAEntregar) {
    dataSheets.deliveryPacket = orderData.PaqueteAEntregar;
  }
  if (domiciliary) {
    dataSheets.domiciliary = domiciliary;
  }
  if (orderData?.DireccionRecogida) {
    dataSheets.pickupAddress = orderData.DireccionRecogida;
  }
  if (orderData?.TipoDePago) {
    dataSheets.paymentMethod = orderData.TipoDePago;
  }
  if (orderData?.Prefijo) {
    dataSheets.prefix = orderData.Prefijo;
  }
  return dataSheets;
};


// Asignar datos básicos de una orden
/**
 * Assign basic data of an order
 *
 * @param {Order} orderData orderData.
 * @param {Order} order order.
 * @return {Promise<Order>}
 */
export const assignBasicDataOrder = async (
  manager: EntityManager,
  orderData: OrderInterfaceRequest,
  order: Order,
): Promise<Order> => {
  if (orderData.purchaseNumber) {
    order.purchaseNumber = orderData.purchaseNumber;
  }
  if (orderData.deliveryNumber) {
    order.deliveryNumber = orderData.deliveryNumber;
  }
  if (orderData.email) {
    order.email = orderData.email;
  }
  if (orderData.name) {
    order.name = orderData.name;
  }
  if (orderData.lastName) {
    order.lastName = orderData.lastName;
  }
  if (orderData.documentNumber) {
    order.documentNumber = orderData.documentNumber;
  }
  if (orderData.typeDocument) {
    order.typeDocument = orderData.typeDocument;
  }
  if (orderData.clientPhone) {
    order.clientPhone = orderData.clientPhone;
  }
  if (orderData.pickupAddress) {
    order.pickupAddress = orderData.pickupAddress;
  }
  if (orderData.purchaseNumber) {
    order.purchaseNumber = orderData.purchaseNumber;
  }
  if (orderData.pickupLocation) {
    order.pickupLocation = orderData.pickupLocation;
  }
  if (orderData.city) {
    order.city = orderData.city;
  }
  if (orderData.department) {
    order.department = orderData.department;
  }
  if (orderData.neighborhood) {
    order.neighborhood = orderData.neighborhood;
  }
  if (orderData.residentialGroupName) {
    order.residentialGroupName = orderData.residentialGroupName;
  }
  if (orderData.houseNumberOrApartment) {
    order.houseNumberOrApartment = orderData.houseNumberOrApartment;
  }
  if (orderData.deliveryNote) {
    order.deliveryNote = orderData.deliveryNote;
  }
  if (orderData.deliveryPacket) {
    order.deliveryPacket = orderData.deliveryPacket;
  }
  if (orderData.pickupTime) {
    order.pickupTime = orderData.pickupTime;
  }
  if (orderData.pickupPicture) {
    order.pickupPicture = orderData.pickupPicture;
  }
  if (orderData.dealerNote) {
    order.dealerNote = orderData.dealerNote;
  }
  if (orderData.deliveryAddress) {
    order.deliveryAddress = orderData.deliveryAddress;
  }
  if (orderData.paymentMethod) {
    order.paymentMethod = orderData.paymentMethod;
  }
  if (orderData.geolocationDelivery) {
    order.geolocationDelivery = orderData.geolocationDelivery;
  }
  if (orderData.prefix) {
    order.prefix = orderData.prefix;
  }
  if (orderData.creationDate) {
    order.creationDate = orderData.creationDate;
  }
  if (orderData.company) {
    order.company = orderData.company;
  }
  if (orderData.orderState) {
    order.orderState = orderData.orderState;
  } else {
    order.orderState = 'Compra';
  }
  if (orderData.domiciliary) {
    if (orderData.domiciliary == '0') {
      order.domiciliary = null;
    } else {
      const userDomiciliary = await manager.findOne(User, { where: { id: orderData.domiciliary } });
      if (userDomiciliary) {
        order.domiciliary = userDomiciliary;
      }
    }
  }
  return order;
};

/**
 * Save in google sheets
 *
 * @param {Order} orderData orderData.
 * @param {Order} order order.
 * @return {Promise<Order>}
 */
export const updateGoogleSheets = async (
  manager: EntityManager,
  user: User,
): Promise<SheetsOrder[]> => {
  try {
    const orders = await manager.find(Order, { where: { company: user.id, isDelete: false }, relations: ['domiciliary'] });
    let validateSave = false;
    let intents = 0;
    const saves: SheetsOrder[] = [];
    while (validateSave == false) {
      intents++;
      try {
        const dataSheets: SheetsOrder[] = [];
        for (let i = 0; i < orders.length; i++) {
          const orderData = orders[i];
          const dataSheet: SheetsOrder = await convertDataOrderToSheetOrder(orderData);
          dataSheets.push(dataSheet);
        }
        const responseSaves = await sheetsUpdateMassive(user.googleSheets, dataSheets);
        for (const row of responseSaves.rows) {
          if (!saves.some(item => item.NumeroDeCompra === row.NumeroDeCompra)) {
            saves.push(row);
          }
        }
        if (responseSaves.error === false) {
          validateSave = true;
        } else {
          throw Boom.badGateway(ErrorMessages.ERROR_ORDER_UNEXPECTED);
        }
      } catch (error) {
        console.error('intent update order error', error);
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }
      if (intents > 10) {
        validateSave = true;
      }
    }
    if (intents > 10) {
      throw Boom.badGateway(ErrorMessages.ERROR_ORDER_UNEXPECTED);
    }
    return saves;
  } catch (error) {
    console.error('Update massive order error', error);
    throw Boom.badGateway(ErrorMessages.ERROR_ORDER_UNEXPECTED);
  }
};

/**
 * discernment of orders to upload in a massive way
 * @param {Order} orders orders.
 * @param {User} user user.
 * @return {Promise<Order>}
 */
export const discernmentOfOrdersToUploadInAMassiveWay = async (
  manager: EntityManager,
  orders: SheetsOrderAutomatic[],
  user: User
): Promise<{ ordersFail: { status: string, order: SheetsOrderAutomatic }[], readyOrders: OrderInterfaceRequest[] }> => {
  const ordersFail: { status: string, order: SheetsOrderAutomatic }[] = [];
  const readyOrders: OrderInterfaceRequest[] = [];
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    try {
      let domiciliaryValue: string | undefined = undefined;
      if (order.AutoDespacho != '' && order?.Domiciliario) {
        const domiciliaryByDocument = await manager.findOne(User, { where: { documentNumber: order.Domiciliario } });
        if (domiciliaryByDocument) {
          domiciliaryValue = domiciliaryByDocument.id.toString();
        } else {
          if (order.Domiciliario.toString().length < 10) {
            const domiciliaryById = await manager.findOne(User, { where: { id: order.Domiciliario } });
            if (domiciliaryById) {
              domiciliaryValue = domiciliaryById.id.toString();
            }
          }
        }
      }
      let location: any = undefined;
      if (order?.Departamento != null) {
        const departamentos = departments.map((department) => department.departamento);
        const indice = departamentos.findIndex(departamento => order?.Departamento.localeCompare(departamento, 'es', { sensitivity: 'base' }) === 0);
        if (indice === -1) {
          ordersFail.push({ status: 'Departamento no encontrado', order: order });
          continue;
        }
        order.Departamento = departamentos[indice];
      }
      if (order?.Ciudad != null) {
        const ciudades = cities.map((city) => city.ciudades).flat();
        const indice = ciudades.findIndex(ciudad => order?.Ciudad.localeCompare(ciudad, 'es', { sensitivity: 'base' }) === 0);
        if (indice === -1) {
          ordersFail.push({ status: 'Ciudad no encontrada', order: order });
          continue;
        }
        order.Ciudad = ciudades[indice];
      }
      if (order?.DireccionEntrega != null) {
        const locationString = order.DireccionEntrega + ' ' + order?.Ciudad + ' ' + order?.Departamento;
        location = await getLocation(locationString);
        if (!location) {
          ordersFail.push({ status: 'Direccion no encontrada', order: order });
          continue;
        }
      }
      const data: OrderInterfaceRequest = {
        purchaseNumber: parseInt(order.NumeroDeCompra),
        name: order.Nombres,
        lastName: order.Apellidos,
        documentNumber: order?.Documento ? order.Documento : undefined,
        typeDocument: order?.TipoDeDocumento ? order.TipoDeDocumento : undefined,
        pickupAddress: order?.DireccionRecogida ? order.DireccionRecogida : undefined,
        email: order?.Email ? order.Email : undefined,
        clientPhone: order?.TelefonoCliente ? order.TelefonoCliente : undefined,
        city: order.Ciudad,
        department: order.Departamento,
        neighborhood: order.Barrio,
        residentialGroupName: order.NombreConjuntoResidencial,
        houseNumberOrApartment: order.NumeroDeCasaOApto,
        deliveryNote: order.NotaEntrega,
        deliveryPacket: order.PaqueteAEntregar,
        deliveryAddress: order.DireccionEntrega,
        paymentMethod: order?.TipoDePago ? order.TipoDePago : undefined,
        prefix: order.Prefijo,
        geolocationDelivery: location ? JSON.stringify(location) : undefined,
      };
      const tiempoTranscurrido = Date.now();
      const hoy = new Date(tiempoTranscurrido);
      data.creationDate = hoy;
      let deliveryNumber = '';
      let validateNumber = false;
      while (validateNumber == false) {
        for (let index = 0; index < 15; index++) {
          let numberAleatory = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
          if (numberAleatory == 0) {
            numberAleatory = numberAleatory + 1;
          } else {
            deliveryNumber += numberAleatory.toString();
          }
        }
        const existOrder = await manager.findOne(Order, { where: { deliveryNumber: deliveryNumber, company: user.id } });
        if (!existOrder) {
          validateNumber = true;
        }
      }
      data.deliveryNumber = parseInt(deliveryNumber);
      if (order?.AutoEntrega != null && order?.AutoDespacho == null) {
        data.orderState = 'EsperaDespacho';
        readyOrders.push(data);
      } else if (order?.AutoDespacho != null) {
        if (order?.AutoDespacho != null && domiciliaryValue != undefined) {
          data.orderState = 'EsperaSalida';
          if (
            data.purchaseNumber &&
            data.name &&
            data.lastName &&
            data.clientPhone &&
            data.department &&
            data.deliveryAddress &&
            data.city &&
            data.neighborhood &&
            data.residentialGroupName &&
            data.houseNumberOrApartment &&
            data.geolocationDelivery
          ) {
            const domiciliaryCompany = await manager.findOne(DomiciliaryCompany, { where: { domiciliary: domiciliaryValue, company: user.id } });
            if (!domiciliaryCompany) {
              ordersFail.push({ status: 'El domiciliario no pertenece a la empresa', order: order });
              continue;
            }
            data.domiciliary = domiciliaryValue;
            readyOrders.push(data);
          } else {
            ordersFail.push({ status: 'Faltan datos para despachar', order: order });
          }
        } else {
          data.orderState = 'EsperaDespacho';
          readyOrders.push(data);
        }
      } else {
        data.orderState = 'Compra';
        readyOrders.push(data);
      }
    } catch (error) {
      console.error('Error generate data order', error);
      ordersFail.push({ status: 'Error intente nuevamente', order: order });
    }
  }
  return { ordersFail, readyOrders };
};
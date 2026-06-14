
export interface OrderInterfaceRequest {
  id?: string;
  company?: number;
  deliveryNumber?: number;
  purchaseNumber: number;
  name?: string;
  lastName?: string;
  documentNumber?: string;
  typeDocument?: string;
  email?: string;
  creationDate?: Date;
  prefix?: string;
  clientPhone?: string;
  pickupAddress?: string;
  pickupLocation?: string;
  city?: string;
  department?: string;
  neighborhood?: string;
  residentialGroupName?: string;
  houseNumberOrApartment?: string;
  deliveryNote?: string;
  deliveryPacket?: string;
  orderState?: string;
  pickupTime?: string;
  pickupPicture?: string;
  dealerNote?: string;
  domiciliary?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  geolocationDelivery?: string;
  isDelete?: boolean;
  deliveryUbication?: string;
}

export interface SheetsOrderAutomatic {
  NumeroDeCompra: string;
  FechaCreacion: string | Date;
  Email: string;
  TipoDeDocumento?: string;
  Documento?: string;
  Nombres: string;
  Apellidos: string;
  TelefonoCliente: string;
  Prefijo: string;
  DireccionEntrega: string;
  Departamento: string;
  Ciudad: string;
  Barrio: string;
  NombreConjuntoResidencial: string;
  NumeroDeCasaOApto: string;
  NotaEntrega: string;
  PaqueteAEntregar: string;
  TipoDePago?: string;
  Domiciliario?: number;
  DireccionRecogida?: string;
  AutoEntrega: string;
  AutoDespacho: string;
}

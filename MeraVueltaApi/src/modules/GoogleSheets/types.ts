
import { User } from '../../entities/users';
export interface SheetsOrder {
  NumeroDeEntrega: string;
  NumeroDeCompra: string;
  FechaCreacion: string | Date;
  Email: string;
  TipoDeDocumento: string;
  Documento: string;
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
  UbicacionEntrega: string;
  GeolocalizacionEntrega: string;
  TipoDePago: string;
  EstadoPedido: string;
  Domiciliario: User | number;
  FotoRecogida: string;
  NotaDomiciliario: string;
  DireccionRecogida: string;
  HoraRecogida: string;
}

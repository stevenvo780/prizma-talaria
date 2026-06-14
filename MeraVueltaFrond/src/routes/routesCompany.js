
import EditUser from '../components/views/auth/EditUser';

import Vueltas from '../components/views/orders/company/Vueltas';
import Ordenes from '../components/views/orders/company/Ordenes';
import OrdenesSearch from '../components/views/orders/company/Orders/OrdenesSearch';

import PostOrdersDomiciliaryEdit from '../components/views/orders/company/Orders/PostOrdersDomiciliaryEdit';

import Domiciliarys from '../components/views/requestDomiciliary/company/Domiciliarys';
import Customer from '../components/views/customers/Customers';

import { MapOrderDealer } from '../components/views/maps/MapBox/MapOrderDealer';
import { GoogleSheetsConnect } from '../components/views/auth/GoogleSheetsConnect';
import PayU from '../components/views/payU/PayU';
import MessageConfig from '../components/views/settings/MessageConfig';

var routesCompany = [
  {
    path: '/upgrade',
    rol: ['company'],
    name: 'Upgrade',
    icon: 'nc-icon nc-spaceship',
    component: PayU,
    layout: '/company',
    visible: false,
  },
  {
    path: '/orders',
    name: 'Ordenes',
    icon: 'nc-icon nc-app',
    rol: ['company'],
    component: Ordenes,
    layout: '/company',
    visible: true,
  },
  {
    path: '/order/search/:word',
    name: 'Ordenes',
    icon: 'nc-icon nc-app',
    rol: ['company'],
    component: OrdenesSearch,
    layout: '/company',
    visible: false,
  },
  {
    path: '/vueltas',
    name: 'Vueltas',
    icon: 'nc-icon nc-time-alarm',
    rol: ['company'],
    component: Vueltas,
    layout: '/company',
    visible: true,
  },
  {
    path: '/clientes',
    name: 'Clientes',
    icon: 'nc-icon nc-satisfied',
    rol: ['company'],
    component: Customer,
    layout: '/company',
    visible: true,
  },
  {
    path: '/editorder/:deliveryNumber',
    name: 'Editar orden',
    icon: 'nc-icon nc-bank',
    rol: ['company'],
    component: PostOrdersDomiciliaryEdit,
    layout: '/company',
    visible: false,
  },
  // Maps
  {
    path: '/map/:id',
    name: 'Mapa del cliente',
    rol: ['company'],
    component: MapOrderDealer,
    layout: '/company',
    visible: false,
  },
  {
    path: '/domiciliary',
    name: 'Domiciliarios',
    icon: 'nc-icon nc-bus-front-12',
    rol: ['company'],
    component: Domiciliarys,
    layout: '/company',
    visible: true,
  },
  {
    path: '/editUser',
    rol: ['company'],
    name: 'Editar usuario',
    icon: 'nc-icon nc-single-02',
    component: EditUser,
    layout: '/company',
    visible: true,
  },
  {
    path: '/googlesheetsconnection',
    rol: ['company'],
    name: 'Google Sheets',
    icon: 'nc-icon nc-cloud-download-93',
    component: GoogleSheetsConnect,
    layout: '/company',
    visible: true,
  },
  {
    path: '/message-config',
    rol: ['company'],
    name: 'Configuración de Mensajes',
    icon: 'nc-icon nc-chat-33',
    component: MessageConfig,
    layout: '/company',
    visible: true,
  },
];
export default routesCompany;

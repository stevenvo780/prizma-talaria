// import ListOrdersDomiciliary from '../components/views/orders/domiciliary/ListOrdersDomiciliary';
// import ListOrdersDomiciliaryProgress from '../components/views/orders/domiciliary/ListOrdersDomiciliaryProgress';
import EditUser from '../components/views/auth/EditUser';
import { MapOrderDealer } from '../components/views/maps/MapBox/MapOrderDealer';

import RequestDomiciliaryList from '../components/views/requestDomiciliary/domiciliary/RequestDomiciliaryList';
import MyCompanysList from '../components/views/requestDomiciliary/domiciliary/MyCompanysList';
// import ListOrdersDomiciliaryFinished from '../components/views/orders/domiciliary/ListOrdersDomiciliaryFinished';


var routesDomiciliary = [
  // {
  //   path: '/ordersList',
  //   name: 'Ordenes en espera',
  //   icon: 'nc-icon nc-map-big',
  //   rol: ['domiciliary'],
  //   component: ListOrdersDomiciliary,
  //   layout: '/domiciliary',
  //   visible: true,
  // },
  // {
  //   path: '/orders/process',
  //   name: 'Ordenes en proceso',
  //   icon: 'nc-icon nc-delivery-fast',
  //   rol: ['domiciliary'],
  //   component: ListOrdersDomiciliaryProgress,
  //   layout: '/domiciliary',
  //   visible: true,
  // },
  // {
  //   path: '/orders/finished',
  //   name: 'Ordenes finalizadas',
  //   icon: 'nc-icon nc-single-copy-04',
  //   rol: ['domiciliary'],
  //   component: ListOrdersDomiciliaryFinished,
  //   layout: '/domiciliary',
  //   visible: true,
  // },
  // Maps
  {
    path: '/dealermap/:id',
    rol: ['domiciliary'],
    name: 'Dealer map',
    icon: 'nc-icon nc-pin-3',
    component: MapOrderDealer,
    layout: '/domiciliary',
    visible: false,
  },
  {
    path: '/myCompanys/list',
    name: 'Mis empresas',
    icon: 'nc-icon nc-badge',
    rol: ['domiciliary'],
    component: MyCompanysList,
    layout: '/domiciliary',
    visible: true,
  },
  {
    path: '/requestDomiciliary/list',
    name: 'Solicitudes',
    icon: 'nc-icon nc-email-85',
    rol: ['domiciliary'],
    component: RequestDomiciliaryList,
    layout: '/domiciliary',
    visible: true,
  },
  {
    path: '/editUser',
    rol: ['domiciliary'],
    name: 'Editar usuario',
    icon: 'nc-icon nc-single-02',
    component: EditUser,
    layout: '/domiciliary',
    visible: true,
  },
];
export default routesDomiciliary;


import PostTakeOrder from '../components/views/orders/public/PostTakeOrder';
import { MapOrderDealer } from '../components/views/maps/MapBox/MapOrderDealer';
import { MapOrderDealerFinish } from '../components/views/maps/MapBox/MapOrderDealerFinish';
import Login from '../components/views/auth/Login';
import Register from '../components/views/auth/Register';
import ConfirmEmail from '../components/views/auth/ConfirmEmail';
import RecoveryPassword from '../components/views/auth/RecoveryPassword';
import Politics from '../components/views/Politics';

var routesPublic = [
  {
    path: '/recoverPassword/:token',
    component: RecoveryPassword,
  },
  {
    path: '/confirmEmail/:token',
    component: ConfirmEmail,
  },
  {
    path: '/politics',
    component: Politics,
  },
  {
    path: '/map/:id',
    component: MapOrderDealer,
  },
  {
    path: '/mapFinish/:id',
    component: MapOrderDealerFinish,
  },
  {
    path: '/takeOrder/:deliveryNumber',
    component: PostTakeOrder,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/login',
    component: Login,
  },
];
export default routesPublic;

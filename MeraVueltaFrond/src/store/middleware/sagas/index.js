// sagas/index.js
import { all } from 'redux-saga/effects';

import { domiciliarySagas } from './domiciliarySagas';
import { orderSagas } from './orderSagas';
import { userSagas } from './userSagas';
import { customerSagas } from './customerSagas';

export default function* rootSaga() {
  yield all([
    ...domiciliarySagas,
    ...orderSagas,
    ...userSagas,
    ...customerSagas,
  ]);
}

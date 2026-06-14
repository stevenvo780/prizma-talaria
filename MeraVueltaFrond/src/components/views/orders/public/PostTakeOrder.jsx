import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getOrderByDeliveryNumberAction } from '../../../../store/reducer';
import TakeOrderStep1 from './TakeOrderStep1';
import TakeOrderStep2 from './TakeOrderStep2';
import TopBarTakeOrder from './TopBarTakeOrder';
import DeliveredOrder from './DeliveredOrder';

// Take Order Component
const PostTakeOrder = () => {
  const { deliveryNumber } = useParams();
  const dispatch = useDispatch();
  const orderByDeliveryNumber = useSelector(
    (state) => state.order.orderByDeliveryNumber
  );
  const orderStep = useSelector(
    (state) => state.order.orderStep
  );

  React.useEffect(() => {
    dispatch(getOrderByDeliveryNumberAction(deliveryNumber));
  }, [deliveryNumber]);
  if (orderByDeliveryNumber && (orderByDeliveryNumber.orderState !== 'EsperaDespacho' && orderByDeliveryNumber.orderState !== 'Compra')) {
    return <DeliveredOrder />
  } else if (orderByDeliveryNumber) {
    if (orderStep === 0) {
      return (
        <>
          <TopBarTakeOrder />
          <TakeOrderStep1 />
        </>
      );

    } else if (orderStep === 1) {
      return (
        <>
          <TopBarTakeOrder />
          <TakeOrderStep2 />
        </>
      );
    }
  }
  return (
    <>
      <div>No existe la orden</div>
    </>
  );
};

export default PostTakeOrder;

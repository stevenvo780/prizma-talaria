import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getOrderByDeliveryNumberAction } from '../../../../../store/reducer';
import { OrdersDomiciliaryEdit } from './OrdersDomiciliaryEdit';

const PostOrdersDomiciliaryEdit = () => {
  const { deliveryNumber } = useParams();
  const dispatch = useDispatch();
  const orderByDeliveryNumber = useSelector(
    (state) => state.order.orderByDeliveryNumber
  );

  React.useEffect(() => {
    dispatch(getOrderByDeliveryNumberAction(deliveryNumber));
  }, []);
  if (orderByDeliveryNumber)
    return <OrdersDomiciliaryEdit order={orderByDeliveryNumber} />;
  return (
    <>
      <div>No existe la orden</div>
    </>
  );
};

export default PostOrdersDomiciliaryEdit;

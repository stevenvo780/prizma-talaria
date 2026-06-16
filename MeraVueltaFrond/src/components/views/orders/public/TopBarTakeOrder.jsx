import * as React from 'react';
import { Alert } from 'prizma-ui';
import { useSelector } from 'react-redux';
import InfoAlert from '../../../hooks/InfoAlert';

const TopBarTakeOrder = () => {
  const orderByDeliveryNumber = useSelector(
    (state) => state.order.orderByDeliveryNumber
  );
  const orderSaveConfirm = useSelector((state) => state.order.orderSaveConfirm);
  return (
    <>
      {orderSaveConfirm === true && (
        <>
          <br />
          <InfoAlert
            messages={[
              'Se ha guardado la orden',
              'Puedes ver el estado de la orden en este mismo sitio',
            ]}
            color="success"
          />
        </>
      )}
      <div
        className="themed-container containerProof"
        style={{ marginTop: '2%' }}
      >
        <div className="row">
          <div className='takeOrderTopBar col-sm-6'>
            <h1 className="takeOrderTitle">Tomar Orden</h1>
            <p style={{ position: "relative", top: "-20%" }}><b>Los valores con un * son obligatorios</b></p>
          </div>
          <div className="col-sm-6">
            <br/>
            {orderByDeliveryNumber.deliveryPacket && (
              <p className='p-top-bar'>
                {' '}
                Paquete a entregar:{' '}
                {orderByDeliveryNumber.deliveryPacket}
              </p>
            )}
            <p className='p-top-bar'>
              {' '}
              # Entrega:{' '}
              {orderByDeliveryNumber.deliveryNumber}
            </p>
            <p className='p-top-bar'>
              {' '}
              Numero de compra:{' '}
              {orderByDeliveryNumber.purchaseNumber}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBarTakeOrder;

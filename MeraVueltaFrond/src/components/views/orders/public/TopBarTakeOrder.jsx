import * as React from 'react';
import {
  Button,
  Container,
  Row,
  Col,
} from 'reactstrap';
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
              'Se a guardado la orden',
              'Puedes ver el estado de la orden en este mismo sitio',
            ]}
            color="success"
          />
        </>
      )}
      <Container
        className="themed-container containerProof"
        fluid="sm"
        style={{ marginTop: '2%' }}
      >
        <Row>
          <Col className='takeOrderTopBar' sm="6">
            <h2 className="takeOrderTitle">Tomar Orden</h2>
            <p style={{ position: "relative", top: "-20%" }} ><b>Los valores con un * son obligatorios</b></p>
          </Col>
          <Col sm="6">
            <br/>
            {orderByDeliveryNumber.deliveryPacket && (
              <p className='p-top-bar' >
                {' '}
                Paquete a entregar:{' '}
                {orderByDeliveryNumber.deliveryPacket}
              </p>
            )}
            <p className='p-top-bar' >
              {' '}
              # Entrega:{' '}
              {orderByDeliveryNumber.deliveryNumber}
            </p>
            <p className='p-top-bar' >
              {' '}
              Numero de compra:{' '}
              {orderByDeliveryNumber.purchaseNumber}
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TopBarTakeOrder;

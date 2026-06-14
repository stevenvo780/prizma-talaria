import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import {
  Container,
  Col,
  Row,
  Button,
  Alert,
  Card,
  CardBody,
  CardText
} from 'reactstrap';
import moment from 'moment';
const DeliveredOrder = () => {
  const dispatch = useDispatch();
  const orderByDeliveryNumber = useSelector(
    (state) => state.order.orderByDeliveryNumber
  );

  return (
    <>
      <div>
        <Container
          className="themed-container containerProof"
          fluid="sm"
        >
          <br />
          {(orderByDeliveryNumber.orderState === 'EsperaSalida' ||
            orderByDeliveryNumber.orderState === 'Salida') && (
              <>
                <Alert color="success">
                  Esta pedido esta en proceso de entrega
                </Alert>
                <Button
                  onClick={(e) => {
                    e.preventDefault;
                    dispatch(
                      push(
                        `/map/${orderByDeliveryNumber.deliveryNumber}`
                      )
                    );
                  }}
                  color="info"
                >
                  Ver mapa{' '}
                </Button>
              </>
            )}
          {orderByDeliveryNumber.orderState === 'Entregada' && (
            <>
              <Alert color="success">
                Esta pedido ya fue entregado
              </Alert>
              <Button
                onClick={(e) => {
                  e.preventDefault;
                  dispatch(
                    push(
                      `/mapFinish/${orderByDeliveryNumber.deliveryNumber}`
                    )
                  );
                }}
                color="info"
              >
                Ver mapa{' '}
              </Button>
            </>
          )}
          <br />
          <Row>
            {orderByDeliveryNumber.orderState === 'Entregada' && (
              <Col sm={6} >
                <Card
                  className="my-2"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <CardBody style={{ width: '100%' }} >
                    <>
                      <p>Nota del domiciliario: </p>
                      <p>{orderByDeliveryNumber.dealerNote}</p>
                      <img src={orderByDeliveryNumber.pickupPicture} />
                    </>
                  </CardBody>
                </Card>
              </Col>
            )}
            <Col sm={(orderByDeliveryNumber.orderState === 'Entregada') ? 6 : 12} >
              <Card
                className="my-2"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <CardBody style={{ width: '100%' }} >
                  <CardText>
                    <CardText>
                      Numero de compra: {orderByDeliveryNumber.purchaseNumber}
                    </CardText>
                    <CardText>
                      # Entrega: {orderByDeliveryNumber.deliveryNumber}
                    </CardText>
                    <CardText>
                      Domiciliario: {orderByDeliveryNumber.domiciliary?.name}
                    </CardText>
                    <CardText>
                      Nombre: {orderByDeliveryNumber.name}  {" "}   {orderByDeliveryNumber.lastName}
                    </CardText>
                    <CardText>
                      Teléfono: +{orderByDeliveryNumber.prefix} {orderByDeliveryNumber.clientPhone}
                    </CardText>
                    <CardText>
                      Paquete: {orderByDeliveryNumber.deliveryPacket}
                    </CardText>
                    <CardText>
                      Departamento: {orderByDeliveryNumber.department}
                    </CardText>
                    <CardText>
                      Ciudad: {orderByDeliveryNumber.city}
                    </CardText>
                    <CardText>
                      Barrio: {orderByDeliveryNumber.neighborhood}
                    </CardText>
                    <CardText>
                      Grupo residencial: {orderByDeliveryNumber.residentialGroupName}
                    </CardText>
                    <CardText>
                      Número de casa o apartamento: {orderByDeliveryNumber.houseNumberOrApartment}
                    </CardText>
                    <CardText>
                      Fecha de creación: {moment(orderByDeliveryNumber.creationDate).format('HH:mm:ss YYYY/MM/DD')}
                    </CardText>
                    <CardText>
                      Ultima Actualización: {moment(orderByDeliveryNumber.updatedAt).format('HH:mm:ss YYYY/MM/DD')}
                    </CardText>
                    {(orderByDeliveryNumber.deliveryNote != null) && (
                      <CardText>
                        Nota de entrega: {orderByDeliveryNumber.deliveryNote}
                      </CardText>
                    )}
                    {(orderByDeliveryNumber.paymentMethod != null) && (
                      <CardText>
                        Metodo de pago: {orderByDeliveryNumber.paymentMethod}
                      </CardText>
                    )}
                    {(orderByDeliveryNumber.email != null) && (
                      <CardText>
                        Email: {orderByDeliveryNumber.email}
                      </CardText>
                    )}
                    {(orderByDeliveryNumber.documentNumber != null) && (
                      <CardText>
                        Documento: {orderByDeliveryNumber.documentNumber}
                      </CardText>
                    )}
                    {(orderByDeliveryNumber.documentNumber != null) && (
                      <CardText>
                        Tipo de documento: {orderByDeliveryNumber.typeDocument}
                      </CardText>
                    )}
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default DeliveredOrder;

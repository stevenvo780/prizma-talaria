import * as React from 'react';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { updateOrderAction, setOrderStep, setOrderSaveConfirm, resetOrderSave } from '../../../../store/reducer';

import { SelectPosition } from '../../maps/MapBox/SelectPosition';
const openWhatsAppNotifications = () => {
  const url = `https://api.whatsapp.com/send/?phone=%2B${process.env.REACT_APP_NUMBER_WHATSAPP}&app_absent=0`;
  window.open(url, '_blank');
};

const TakeOrderStep2 = () => {
  const dispatch = useDispatch();
  const orderByDeliveryNumber = useSelector(
    (state) => state.order.orderByDeliveryNumber
  );
  const orderTakeOrder = useSelector((state) => state.order.orderTakeOrder);
  const orderSave = useSelector((state) => state.order.orderSave);
  const locationTakeOrder = useSelector((state) => state.order.locationTakeOrder);
  const [toggles, setToggles] = useState({ saveOrder: false, form: false });
  const handleToggle = useCallback((name) => {
    if (name === "saveOrder" && !toggles[name] === false) {
      dispatch(setOrderStep(0));
      dispatch(setOrderSaveConfirm(true));
    }
    setToggles({ ...toggles, [name]: !toggles[name] });
  }, [toggles, setToggles]);

  const handleSave = () => {
    let dataAPI = {
      ...orderTakeOrder,
      geolocationDelivery: JSON.stringify(locationTakeOrder),
    };
    dispatch(
      updateOrderAction({
        id: orderByDeliveryNumber.deliveryNumber,
        data: dataAPI,
      })
    );
    handleToggle("form");
  };
  React.useEffect(() => {
    if (orderSave) {
      handleToggle("saveOrder");
      dispatch(resetOrderSave());
    }
  }, [orderSave]);
  return (
    <>
      <div>
        <Container
          className="themed-container containerProof"
          fluid="sm"
        >
          <Form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleToggle("form");
            }}
          >
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Row>
                    <Col sm="3">
                      <Button
                        color="info"
                        size="lg"
                        onClick={(e) => { e.preventDefault(); dispatch(setOrderStep(0)); }}
                      >
                        Volver
                      </Button>
                    </Col>
                    <Col sm="3">
                      <Button
                        color="success"
                        size="lg"
                        type="submit"
                      >
                        Crear Orden
                      </Button>
                    </Col>
                  </Row>
                </FormGroup>
                <Badge>
                  Seleccione la ubicación precisa donde se entregara el pedido
                </Badge>
                <SelectPosition />
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
      <SaveOrderModal
        toggle={toggles.form}
        handleChange={handleSave}
        handleClose={handleToggle}
      />
      <ReturnToWpp
        toggle={toggles.saveOrder}
        handleChange={openWhatsAppNotifications}
        handleClose={handleToggle}
      />
    </>
  );
};

const ReturnToWpp = (props) => {
  const loading = useSelector((state) => state.ui.loading);
  const { toggle, handleChange, handleClose } = props;
  return (
    <>
      <Modal
        isOpen={toggle}
        toggle={(e) => {
          e.preventDefault();
          handleChange();
        }}
      >
        <ModalHeader
          toggle={(e) => {
            e.preventDefault();
            handleClose("saveOrder");
          }}
        >
          Confirmar
        </ModalHeader>
        <ModalBody>
          <h4>Se a enviado la información con éxito</h4>
          Te llegaran una notificaciones a tu WhatsApp de todo el
          proceso de entrega
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={loading}
            color="success"
            onClick={(e) => {
              e.preventDefault();
              handleChange();
            }}
          >
            Ir a WhatsApp
          </Button>
          <Button
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleClose("saveOrder");
            }}
          >
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const SaveOrderModal = (props) => {
  const { toggle, handleChange, handleClose } = props;
  return (
    <>
      <Modal
        isOpen={toggle}
        toggle={(e) => {
          e.preventDefault();
          handleChange("form");
        }}
      >
        <ModalHeader
          toggle={(e) => {
            e.preventDefault();
            handleClose("form");
          }}
        >
          Confirmar
        </ModalHeader>
        <ModalBody>
          ¿Estás seguro/a de que los datos ingresados en el formulario
          son correctos?
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={(e) => {
              e.preventDefault();
              handleChange();
            }}
          >
            Aceptar
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleClose("form");
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default TakeOrderStep2;

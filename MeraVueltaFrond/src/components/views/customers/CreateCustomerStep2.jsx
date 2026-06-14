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
import {
  createCustomerAction,
  updateCustomerAction,
  setStepCustomer,
} from '../../../store/reducer';
import { SelectPositionCustomer } from '../maps/MapBox/SelectPositionCustomer';

const TakeCustomerStep2 = () => {
  const dispatch = useDispatch();
  const customer = useSelector(
    (state) => state.customer.customer
  );
  const locationTakeCustomer = useSelector((state) => state.order.locationTakeOrder);
  const [toggle, setToggle] = useState(false);

  const handleSave = () => {
    let dataAPI = {
      ...customer,
      geolocationDelivery: JSON.stringify(locationTakeCustomer),
    };
    if (customer.id) {
      dispatch(
        updateCustomerAction({
          id: customer.id,
          data: dataAPI,
        })
      );
    } else {
      dispatch(
        createCustomerAction(dataAPI)
      );
    }
    setToggle(!toggle);
  };
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
              handleSave();
            }}
          >
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Row>
                    <Col sm="3">
                      <Button
                        color="info"
                        onClick={(e) => { e.preventDefault(); dispatch(setStepCustomer(0)); }}
                      >
                        Volver
                      </Button>
                    </Col>
                    <Col sm="6">
                      <Button
                        color="success"
                        type="submit"
                      >
                        {customer.id ? <>Actualizar orden</> : <>Crear orden</>}
                      </Button>
                    </Col>
                  </Row>
                </FormGroup>
                <Badge>
                  Seleccione la ubicación precisa donde se entregara el pedido
                </Badge>
                <SelectPositionCustomer />
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
      <SaveCustomerModal
        toggle={toggle.form}
        handleChange={handleSave}
        handleClose={() => setToggle(!toggle)}
      />
    </>
  );
};

const SaveCustomerModal = (props) => {
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
            handleClose();
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
              handleClose();
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default TakeCustomerStep2;

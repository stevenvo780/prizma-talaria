import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import {
  Container,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from 'reactstrap';
import {
  updateOrderAction,
  getAllDomiciliaryCompanyByCompanyAction,
} from '../../../../../store/reducer';
import Select from 'react-select';
import InfoAlert from '../../../../hooks/InfoAlert';

export const OrdersDomiciliaryEdit = (props) => {
  const dispatch = useDispatch();
  const orderByDeliveryNumber = props.order;
  const dealers = useSelector(
    (state) => state.domiciliaryCompany.domiciliaryCompanys
  );
  const deliveryPacket = useFormInput(
    orderByDeliveryNumber.deliveryPacket ? orderByDeliveryNumber.deliveryPacket : ''
  );
  const pickupAddress = useFormInput(orderByDeliveryNumber.pickupAddress ? orderByDeliveryNumber.pickupAddress : '');

  const [dealerData, setDealerData] = React.useState({});
  const [toggle, setToggle] = React.useState(false);
  const [formIsValid, setFormIsValid] = React.useState(false);

  React.useEffect(() => {
    dispatch(getAllDomiciliaryCompanyByCompanyAction());
  }, []);


  const handleUpdate = (event) => {
    event.preventDefault();
    let dataAPI;
    if (dealerData.value?.toString().length > 0) {
      dataAPI = {
        deliveryPacket: deliveryPacket.value,
        orderState: 'EsperaSalida',
        domiciliary: dealerData.value?.toString(),
      };
    } else {
      dataAPI = {
        deliveryPacket: deliveryPacket.value,
        orderState: 'EsperaDespacho',
      };
    }
    dispatch(
      updateOrderAction({
        id: orderByDeliveryNumber.deliveryNumber,
        data: dataAPI,
      })
    );
  };

  const handleToggle = (e) => {
    e.preventDefault();
    setToggle(!toggle);
  };

  const goToDomiciliary = () => {
    dispatch(push('/company/domiciliary/domiciliaryList'));
  };

  const goToTakeOrder = () => {
    window.open(process.env.REACT_APP_REACT_HOST + '/takeOrder/' + orderByDeliveryNumber.deliveryNumber, '_blank')
  };

  const handleDealerChange = (dealerData) => {
    setDealerData(dealerData);
  };
  React.useEffect(() => {
    if (
      formIsValid === false &&
      orderByDeliveryNumber.city != null &&
      orderByDeliveryNumber.department != null &&
      orderByDeliveryNumber.deliveryAddress != null &&
      orderByDeliveryNumber.clientPhone != null &&
      pickupAddress.value != null &&
      pickupAddress.value != ''
    ) {
      setFormIsValid(true);
    }
  }, [
    setFormIsValid,
    orderByDeliveryNumber,
    dealerData,
  ]);
  return (
    <>
      <div>
        <Container
          className="themed-container containerProof"
          fluid="sm"
        >
          <Form className="form" onSubmit={(e) => handleUpdate(e)}>
            <Col>
              <FormGroup>
                <div className="positionButton">
                  <Button
                    color="success"
                    size="lg"
                    type="submit"
                    disabled={!formIsValid}
                  >
                    Guardar
                  </Button>{' '}
                  {``}
                </div>
                {
                  (
                    orderByDeliveryNumber.city == null ||
                    orderByDeliveryNumber.department == null ||
                    orderByDeliveryNumber.deliveryAddress == null ||
                    orderByDeliveryNumber.clientPhone == null
                  ) && (
                    <Alert color='danger' >Debe tener todos los datos obligatorios en la orden para poder asignar el domiciliario</Alert>
                  )
                }
              </FormGroup>
              <FormGroup row>
                <Col sm={10}>
                  <Badge color="primary">Domiciliario</Badge>
                  <Select
                    inputProps={{ autoComplete: 'off' }}
                    inputId="domiciliary"
                    onChange={handleDealerChange}
                    placeholder="Domiciliario"
                    options={dealers.map((dealer) => {
                      return {
                        value: dealer.domiciliary.id,
                        label: dealer.domiciliary.name + " " + dealer.domiciliary.lastName,
                      };
                    })}
                  />
                  <Button color="info" onClick={(e) => { e.preventDefault(); goToDomiciliary() }}>
                    Buscar mas domiciliarios
                  </Button>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={10}>
                  <Badge color="primary">Paquete A Entregar</Badge>
                  <Input
                    required
                    type="text"
                    id="deliveryPackage"
                    placeholder="Paquete A Entregar"
                    {...deliveryPacket}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={10}>
                  <Badge color="primary">Dirección Recogida</Badge>
                  <Input
                    type="text"
                    id="pickupAddress"
                    placeholder="Dirección Recogida"
                    {...pickupAddress}
                  />
                </Col>
              </FormGroup>
              <Col sm={10}>
                <Badge color="primary">En el enlace publico puede llenar los datos por el cliente</Badge>
                <br />
                <Button color="success" onClick={(e) => { e.preventDefault(); goToTakeOrder() }}>
                  LLenar la orden
                </Button>
              </Col>
            </Col>
          </Form>
        </Container>
      </div>
      <SaveOrderModal
        toggle={toggle}
        handleChange={handleUpdate}
        handleClose={handleToggle}
      />
    </>
  );
};
const SaveOrderModal = (props) => {
  const { toggle, handleChange, handleClose } = props;
  return (
    <>
      <Modal isOpen={toggle} toggle={handleChange}>
        <ModalHeader toggle={handleClose}>Confirmar</ModalHeader>
        <ModalBody>
          ¿Estás seguro/a de que los datos ingresados en el formulario
          son correctos?
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleChange}>
            Aceptar
          </Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const useFormInput = (initialValue) => {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

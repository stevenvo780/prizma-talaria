import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import { Button, Badge, Modal, Alert, Input } from 'prizma-ui';
import {
  updateOrderAction,
  getAllDomiciliaryCompanyByCompanyAction,
} from '../../../../../store/reducer';
import ReactSelect from 'react-select';
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
        <div className="themed-container containerProof">
          <form className="form" onSubmit={(e) => handleUpdate(e)}>
            <div>
              <div className="positionButton">
                <Button
                  variant="primary"
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
                  <Alert tone="danger">Debe tener todos los datos obligatorios en la orden para poder asignar el domiciliario</Alert>
                )
              }
              <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <div style={{ flex: '0 0 83.333%', maxWidth: '83.333%' }}>
                  <Badge tone="primary">Domiciliario</Badge>
                  <ReactSelect
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
                  <Button variant="secondary" onClick={(e) => { e.preventDefault(); goToDomiciliary() }}>
                    Buscar mas domiciliarios
                  </Button>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <div style={{ flex: '0 0 83.333%', maxWidth: '83.333%' }}>
                  <Badge tone="primary">Paquete A Entregar</Badge>
                  <Input
                    required
                    type="text"
                    id="deliveryPackage"
                    placeholder="Paquete A Entregar"
                    {...deliveryPacket}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <div style={{ flex: '0 0 83.333%', maxWidth: '83.333%' }}>
                  <Badge tone="primary">Dirección Recogida</Badge>
                  <Input
                    type="text"
                    id="pickupAddress"
                    placeholder="Dirección Recogida"
                    {...pickupAddress}
                  />
                </div>
              </div>
              <div style={{ flex: '0 0 83.333%', maxWidth: '83.333%' }}>
                <Badge tone="primary">En el enlace publico puede llenar los datos por el cliente</Badge>
                <br />
                <Button variant="primary" onClick={(e) => { e.preventDefault(); goToTakeOrder() }}>
                  LLenar la orden
                </Button>
              </div>
            </div>
          </form>
        </div>
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
    <Modal
      open={toggle}
      onClose={handleClose}
      title="Confirmar"
      footer={
        <>
          <Button variant="primary" onClick={handleChange}>
            Aceptar
          </Button>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        </>
      }
    >
      ¿Estás seguro/a de que los datos ingresados en el formulario
      son correctos?
    </Modal>
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

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import {
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import {
  updateOrderMassiveAction,
  getAllDomiciliaryCompanyByCompanyAction,
} from '../../../../../store/reducer';
import Select from 'react-select';

export const ModalAssignDomiciliarys = ({ orders, handleClose, toggle }) => {
  const dispatch = useDispatch();
  const dealers = useSelector(
    (state) => state.domiciliaryCompany.domiciliaryCompanys
  );

  const [dealerData, setDealerData] = React.useState({});
  const [toggleSave, setToggleSave] = React.useState(false);

  React.useEffect(() => {
    dispatch(getAllDomiciliaryCompanyByCompanyAction());
  }, []);


  const handleUpdate = async (event) => {
    event.preventDefault();
    const ordersSave = [];
    for (let index = 0; index < orders.length; index++) {
      const order = orders[index];
      let dataAPI = {
        id: order.id,
        purchaseNumber: order.purchaseNumber,
        deliveryNumber: order.deliveryNumber,
        orderState: 'EsperaSalida',
        domiciliary: dealerData.value?.toString(),
      };
      ordersSave.push(dataAPI);
    }
    dispatch(
      updateOrderMassiveAction({ orders: ordersSave })
    );
    handleClose();
    handleToggle(event);
  };

  const handleToggle = (e) => {
    e.preventDefault();
    setToggleSave(!toggleSave);
  };

  const goToDomiciliary = () => {
    dispatch(push('/company/domiciliary/domiciliaryList'));
  };

  const handleDealerChange = (dealerData) => {
    setDealerData(dealerData);
  };

  return (
    <>
      <div>
        <Modal isOpen={toggle} toggle={handleClose}>
          <ModalHeader toggle={handleClose}>Asignar domiciliario a varias ordenes</ModalHeader>
          <ModalBody>
            <Col sm={10}>
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
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              type="submit"
              disabled={!dealerData.value}
              onClick={handleToggle}
            >
              Guardar
            </Button>
            <Button onClick={handleClose}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
      <SaveOrderModal
        toggle={toggleSave}
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
          ¿Estás seguro/a de asignar el domiciliario a todas las ordenes seleccionadas?
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

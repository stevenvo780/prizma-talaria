import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import {
  Col,
} from 'reactstrap';
import {
  Button,
  Modal,
} from 'prizma-ui';
import {
  updateOrderMassiveAction,
  getAllDomiciliaryCompanyByCompanyAction,
} from '../../../../../store/reducer';
import ReactSelect from 'react-select';

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
      <Modal
        open={toggle}
        onClose={handleClose}
        title="Asignar domiciliario a varias ordenes"
        footer={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button
              variant="primary"
              disabled={!dealerData.value}
              onClick={handleToggle}
            >
              Guardar
            </Button>
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          </div>
        }
      >
        <Col sm={10}>
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
          <Button
            variant="secondary"
            onClick={(e) => { e.preventDefault(); goToDomiciliary(); }}
          >
            Buscar mas domiciliarios
          </Button>
        </Col>
      </Modal>
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
    <Modal
      open={toggle}
      onClose={handleClose}
      title="Confirmar"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="primary" onClick={handleChange}>
            Aceptar
          </Button>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        </div>
      }
    >
      <p>¿Estás seguro/a de asignar el domiciliario a todas las ordenes seleccionadas?</p>
    </Modal>
  );
};

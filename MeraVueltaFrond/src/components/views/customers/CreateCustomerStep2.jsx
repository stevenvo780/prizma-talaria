import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Badge, Modal } from 'prizma-ui';
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
        <div className="themed-container containerProof">
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 100%', maxWidth: '100%' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div>
                      <Button
                        variant="secondary"
                        onClick={(e) => { e.preventDefault(); dispatch(setStepCustomer(0)); }}
                      >
                        Volver
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="primary"
                        type="submit"
                      >
                        {customer.id ? <>Actualizar orden</> : <>Crear orden</>}
                      </Button>
                    </div>
                  </div>
                </div>
                <Badge tone="info">
                  Seleccione la ubicación precisa donde se entregara el pedido
                </Badge>
                <SelectPositionCustomer />
              </div>
            </div>
          </form>
        </div>
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
    <Modal
      open={!!toggle}
      onClose={handleClose}
      title="Confirmar"
      footer={
        <>
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              handleChange();
            }}
          >
            Aceptar
          </Button>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              handleClose();
            }}
          >
            Cancelar
          </Button>
        </>
      }
    >
      ¿Estás seguro/a de que los datos ingresados en el formulario
      son correctos?
    </Modal>
  );
};

export default TakeCustomerStep2;

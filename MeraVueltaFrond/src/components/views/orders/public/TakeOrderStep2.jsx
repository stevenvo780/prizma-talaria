import * as React from 'react';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Badge, Modal } from 'prizma-ui';
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
        <div className="themed-container containerProof">
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleToggle("form");
            }}
          >
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <div className="row">
                    <div className="col-sm-3">
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={(e) => { e.preventDefault(); dispatch(setOrderStep(0)); }}
                      >
                        Volver
                      </Button>
                    </div>
                    <div className="col-sm-3">
                      <Button
                        variant="accent"
                        size="lg"
                        type="submit"
                      >
                        Crear Orden
                      </Button>
                    </div>
                  </div>
                </div>
                <Badge tone="info">
                  Seleccione la ubicación precisa donde se entregara el pedido
                </Badge>
                <SelectPosition />
              </div>
            </div>
          </form>
        </div>
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
    <Modal
      open={toggle}
      onClose={() => handleClose("saveOrder")}
      title="Confirmar"
      footer={
        <>
          <Button
            disabled={loading}
            variant="accent"
            onClick={(e) => {
              e.preventDefault();
              handleChange();
            }}
          >
            Ir a WhatsApp
          </Button>
          <Button
            disabled={loading}
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              handleClose("saveOrder");
            }}
          >
            Cerrar
          </Button>
        </>
      }
    >
      <h2>Se ha enviado la información con éxito</h2>
      Te llegaran una notificaciones a tu WhatsApp de todo el
      proceso de entrega
    </Modal>
  );
};

const SaveOrderModal = (props) => {
  const { toggle, handleChange, handleClose } = props;
  return (
    <Modal
      open={toggle}
      onClose={() => handleClose("form")}
      title="Confirmar"
      footer={
        <>
          <Button
            variant="accent"
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
              handleClose("form");
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

export default TakeOrderStep2;

import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Modal,
} from "prizma-ui";
import { createPayUAction, addNotification } from '../../../store/reducer';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Selección de plan + alta de suscripción vía Mercado Pago (Checkout Pro /
 * PreApproval). Reemplaza el formulario de tarjeta de Wompi: ya no capturamos
 * datos de tarjeta en el front (los pide MP en su propio checkout). Al confirmar
 * se crea la PreApproval en el back y se redirige al `init_point` de MP.
 */
const PaymentForm = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);

  const planUser = useSelector((state) => state.login.plan);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const plans = [
    {
      id: "PLAN_300",
      label: "PLAN + 300",
      price: "49.500 / mo. ~ COP",
      orders: "300 Pedidos - $165 / pedido",
      features: [
        "3 Domiciliarios",
      ],
    },
    {
      id: "PLAN_500",
      label: "PLAN + 500",
      price: "69.500 / mo. ~ COP",
      orders: "500 Pedidos - $139 / pedido",
      features: [
        "10 Domiciliarios",
      ],
    },
    {
      id: "PLAN_1000",
      label: "PLAN + 1000",
      // Precio canónico reconciliado con el backend: $110 / pedido
      // (antes el front mostraba $120, el back cobraba $110).
      price: "110.000 / mo. ~ COP",
      orders: "1.000 Pedidos - $110 / pedido",
      features: [
        "20 Domiciliarios",
      ],
    },
    {
      id: "PLAN_2000",
      label: "PLAN + 2000",
      price: "219.500 / mo. ~ COP",
      orders: "2.000 Pedidos - $110 / pedido",
      features: [
        "Domiciliarios ilimitados",
      ],
    },
  ];

  React.useEffect(() => {
    if (planUser) {
      const userPlan = plans.find(plan => plan.id == planUser);
      if (userPlan) {
        setSelectedPlan({
          value: userPlan.id,
          label: userPlan.label,
        });
      }
    } else {
      setSelectedPlan({
        value: plans[0].id,
        label: plans[0].label,
      });
    }
  }, [planUser]);

  const blueGradientStyle = {
    minHeight: '220px',
    padding: '10px',
    background: 'linear-gradient(135deg, #095169, #0a827f)',
    color: '#fff',
    width: "100%",
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.5)'
  };

  const toggle = () => setModal(!modal);

  const confirmPayment = e => {
    e.preventDefault();
    if (selectedPlan == null) {
      dispatch(addNotification({ message: 'Por favor selecciona un plan', color: 'danger' }));
      return;
    }
    if (planUser === selectedPlan?.value) {
      dispatch(addNotification({ message: 'Ya tienes este plan', color: 'warning' }));
      return;
    }
    toggle();
  };

  const handleSubmit = e => {
    e.preventDefault();
    // El back crea la PreApproval en Mercado Pago y devuelve el init_point;
    // la saga redirige al checkout de MP. Ya no enviamos datos de tarjeta.
    dispatch(createPayUAction({ typePlan: selectedPlan?.value }));
    setModal(false);
  };

  return (
    <div className="container-fluid">
      <h1 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Selecciona tu plan</h1>
      <div className="row">
        <div className="col-sm-8" style={{ margin: '0 auto' }}>
          <div className="row">
            {plans.map((plan, index) => (
              <div className="col-xs-12 col-md-6 col-sm-6 col-xl-6" key={index} style={{ marginBottom: '20px' }}>
                <Card
                  interactive
                  onClick={() => setSelectedPlan({
                    value: plan.id,
                    label: plan.label,
                  })}
                  style={((plan.id === planUser && selectedPlan == null) || selectedPlan?.value === plan.id) ? blueGradientStyle : {
                    minHeight: '220px',
                    padding: '10px',
                    width: "100%",
                    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <CardBody>
                    <h5>{plan.label}</h5>
                    <h6>{plan.price}</h6>
                    <p>{plan.orders}</p>
                    <ul>
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px' }}>
            El pago se procesa de forma segura en Mercado Pago. Serás redirigido para
            completar la suscripción.
          </p>
          <Button variant="accent" onClick={confirmPayment} style={{
            display: 'block',
            width: '240px',
            height: '50px',
            margin: '20px auto',
            fontSize: '20px'
          }}>Pagar con Mercado Pago</Button>
        </div>
      </div>
      <Modal
        open={modal}
        onClose={toggle}
        title="Confirmación de Pago"
        footer={
          <>
            <Button variant="primary" onClick={handleSubmit}>Sí, continuar a Mercado Pago</Button>
            <Button variant="secondary" onClick={toggle}>Cancelar</Button>
          </>
        }
      >
        Serás redirigido a Mercado Pago para completar el pago de tu suscripción.
      </Modal>
    </div>
  );
};

export default PaymentForm;

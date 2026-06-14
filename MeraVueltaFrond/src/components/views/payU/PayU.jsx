import React, { useState, useMemo } from "react";
import {
  Form,
  FormGroup,
  Input,
  Button,
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label
} from "reactstrap";
import { createPayUAction } from '../../../store/reducer';
import { useDispatch, useSelector } from 'react-redux';

const PaymentForm = () => {
  const dispatch = useDispatch();
  const [expirationDate, setExpirationDate] = useState("");

  const [token, setToken] = useState(null);
  const [checked, setChecked] = useState(false);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    emailAddress: "",
    creditCard: {
      number: "",
      securityCode: "",
      expirationDate: "",
      name: "",
      paymentMethod: "VISA",
    },
  });

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    const [month, year] = expirationDate.split("/");
    const expirationDateFormat = `20${year}/${month}`;
    const data = {
      token: token,
      typePlan: selectedPlan?.value,
      emailAddress: formData.emailAddress,
      creditCard: {
        number: formData.creditCard.number,
        securityCode: formData.creditCard.securityCode,
        expirationDate: expirationDateFormat,
        name: formData.creditCard.name
      },
    };
    dispatch(createPayUAction(data));
    setModal(false);
  };

  const handleChangeCreditCard = (event) => {
    const { name, value } = event.target;
    if (name == "expirationDate") {
      if (value.length === 3 && !isNaN(parseInt(value[2]))) {
        const formattedValue = value.slice(0, 2) + "/" + value.slice(2);
        if (Number(formattedValue.slice(0, 2)) <= 12) {
          setExpirationDate(formattedValue.slice(0, 5));
        } else {
          alert("Mes de expiración inválido");
        }
      } else {
        if (Number(value.slice(0, 1)) <= 12) {
          setExpirationDate(value.slice(0, 5));
        } else {
          alert("Mes de expiración inválido");
        }
      }
    } else {
      setFormData({
        ...formData,
        creditCard: {
          ...formData.creditCard,
          [name]: value
        }
      });
    }
  };

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
      price: "119.500 / mo. ~ COP",
      orders: "1.000 Pedidos - $120 / pedido",
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
      alert("Por favor selecciona un plan");
      return;
    }
    if (planUser === selectedPlan?.value) {
      alert("Ya tienes este plan");
      return;
    }
    if (!token && !checked) {
      alert("Por favor acepta los términos y condiciones");
      return;
    }
    toggle();
  };

  const handleChangeCheckbox = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      getToken();
    } else {
      setToken(null);
    }
  };

  const getToken = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_WOMPI_URL}/merchants/${process.env.REACT_APP_WOMPI_PUBLIC_KEY}`);
      const data = await response.json();
      const token = data.data.presigned_acceptance.acceptance_token;
      setToken(token);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container fluid>
      <h2 style={{ marginBottom: '20px' }}>Selecciona tu plan:</h2>
      <Row>
        <Col sm="6">
          <Row>
            {plans.map((plan, index) => (
              <Col xs="12" md="6" sm="6" xl="6" key={index} style={{ marginBottom: '20px' }}>
                <Card onClick={() => setSelectedPlan({
                  value: plan.id,
                  label: plan.label,
                })} style={((plan.id === planUser && selectedPlan == null) || selectedPlan?.value === plan.id) ? blueGradientStyle : {
                  minHeight: '220px',
                  padding: '10px',
                  width: "100%",
                  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.5)'
                }} >
                  <CardBody>
                    <h5>{plan.label}</h5>
                    <h6>{plan.price}</h6>
                    <p>{plan.orders}</p>
                    <ul>
                      {plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col sm="6">
          <Form onSubmit={confirmPayment}>
            <Card style={{
              width: '100%',
              height: "380px",
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
            }} >
              <CardBody>
                <FormGroup>
                  <Input
                    autoComplete="off"
                    required
                    type="email"
                    name="emailAddress"
                    id="emailAddress"
                    placeholder="Correo electrónico"
                    value={formData.emailAddress}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    autoComplete="off"
                    required
                    type="number"
                    name="number"
                    id="creditCardNumber"
                    placeholder="Número de tarjeta de crédito"
                    value={formData.creditCard.number}
                    onChange={handleChangeCreditCard}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    autoComplete="off"
                    required
                    type="text"
                    name="securityCode"
                    id="securityCode"
                    placeholder="Código de seguridad"
                    value={formData.creditCard.securityCode}
                    onChange={handleChangeCreditCard}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    autoComplete="off"
                    required
                    type="text"
                    name="expirationDate"
                    id="expirationDate"
                    placeholder="MM/AA"
                    value={expirationDate}
                    onChange={handleChangeCreditCard}
                    pattern="[0-9]{2}/[0-9]{2}"
                    title="Por favor ingrese una fecha en formato MM/AA"
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    autoComplete="off"
                    required
                    type="text"
                    name="name"
                    id="cardHolderName"
                    placeholder="Titular de la tarjeta"
                    value={formData.creditCard.name}
                    onChange={handleChangeCreditCard}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleCheck" style={{ marginLeft: '10px', fontSize: '15px' }}>Acepto los <a href="https://wompi.com/es/co/terminos-condiciones-comercios" target="_blank">términos y condiciones y políticas de privacidad</a> de Wompi</Label>
                  <br />
                  <Input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChangeCheckbox}
                    label="Obtener token"
                    style={{ marginLeft: "25px", width: '30px', height: '30px' }}
                  />
                </FormGroup>
              </CardBody>
            </Card>
            <Button color="success" type="submit" style={{
              display: 'block',
              width: '200px',
              height: '50px',
              margin: '20px auto',
              fontSize: '20px'
            }}>Pagar</Button>
          </Form>
        </Col>
      </Row>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Confirmación de Pago</ModalHeader>
        <ModalBody>
          ¿Estás seguro de que quieres realizar el pago?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>Sí, confirmar</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default PaymentForm;
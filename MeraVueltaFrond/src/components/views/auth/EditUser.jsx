import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAction, cancelSubscriptionAction } from '../../../store/reducer';
import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Input,
  Button,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { AiOutlineMessage, AiOutlineHome } from 'react-icons/ai';
import { BiBuildings } from 'react-icons/bi';
import Select from 'react-select';
import moment from 'moment';
const jsonPrefix = [
  {
    value: '57',
    label: 'Colombia +57',
  },
];
const EditUser = () => {
  const validatePay = useSelector((state) => state.login.validatePay);
  const dispatch = useDispatch();
  const password = useFormInput('');
  const user = useSelector((state) => state.login.user);
  const name = useFormInput(user.name);
  const companyName = useFormInput(user.companyName);
  const lastName = useFormInput(user.lastName);
  const clientPhone = useFormInput(user.clientPhone);
  const [typeDocument, setTypeDocument] = React.useState({
    value: user.typeDocument,
    label: user.typeDocument === 'cc' ? 'Cédula' : 'NIT',
  });
  const documentNumber = useFormInput(user.documentNumber);
  const bornDate = useFormInput(
    moment(user.bornDate).format('YYYY-MM-DD')
  );
  const address = useFormInput(user.address);
  const [prefixClientPhone, setPrefixClientPhone] = React.useState(jsonPrefix.find((prefix) => prefix.value === user.prefix));

  const handlePrefixChange = (prefix) => {
    setPrefixClientPhone(prefix);
  };
  const handleRegister = (event) => {
    event.preventDefault();
    let data = {};
    if (name?.value) {
      data.name = name.value;
    }
    if (lastName?.value) {
      data.lastName = lastName.value;
    }
    if (typeDocument?.value) {
      data.typeDocument = typeDocument.value;
    }
    if (documentNumber?.value) {
      data.documentNumber = documentNumber.value;
    }
    if (bornDate?.value) {
      data.bornDate = bornDate.value;
    }
    if (address?.value) {
      data.address = address.value;
    }
    if (clientPhone?.value) {
      data.clientPhone = clientPhone.value;
    }
    if (prefixClientPhone?.value) {
      data.prefix = prefixClientPhone.value;
    }
    if (companyName?.value) {
      data.companyName = companyName.value;
    }
    if (password.value) {
      data.password = password.value
    }
    dispatch(updateUserAction({ id: user.id, data: data }));
  };

  const handleTypeDocument = (role) => {
    setTypeDocument(role);
  };
  const cardStyles = {
    background: 'linear-gradient(135deg, #095169, #2a7496)',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
    width: '100%',
    borderRadius: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: 'white',
  };

  const [modal, setModal] = React.useState(false);
  const toggle = () => setModal(!modal);

  const handleCancelSubscription = () => {
    dispatch(cancelSubscriptionAction());
    toggle();
  };

  return (
    <>
      <div>
        <Container className="themed-container" >
          {user.role === 'company' && (
            <>
              <Row style={{ height: '100%' }}>
                <Col style={{ marginTop: '10px' }} sm="4">
                  <Card style={cardStyles}>
                    <CardBody>
                      <div style={{ textAlign: 'center' }}>
                        <AiOutlineMessage size="2em" />
                      </div>
                      <p>Recibirás notificaciones de WhatsApp en tu número de celular.</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col style={{ marginTop: '10px' }} sm="4">
                  <Card style={cardStyles}>
                    <CardBody>
                      <div style={{ textAlign: 'center' }}>
                        <AiOutlineHome size="2em" />
                      </div>
                      <p>Tu dirección será la ubicación predeterminada de recolección para cada pedido.</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col style={{ marginTop: '10px' }} sm="4">
                  <Card style={cardStyles}>
                    <CardBody>
                      <div style={{ textAlign: 'center' }}>
                        <BiBuildings size="2em" />
                      </div>
                      <p>El nombre de tu empresa aparecerá en las notificaciones de WhatsApp.</p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          )}
          {user.role === 'domiciliary' && (
            <>
              <Row style={{ height: '100%' }}>
                <Col style={{ marginTop: '10px' }} sm="4">
                  <Card style={cardStyles}>
                    <CardBody>
                      <div style={{ textAlign: 'center' }}>
                        <AiOutlineMessage size="2em" />
                      </div>
                      <p>Recibirás notificaciones de WhatsApp en tu número de celular.</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col style={{ marginTop: '10px' }} sm="4">
                  <Card style={cardStyles}>
                    <CardBody>
                      <div style={{ textAlign: 'center' }}>
                        <AiOutlineHome size="2em" />
                      </div>
                      <p>Tu WhatsApp sera enviado a los clientes.</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col style={{ marginTop: '10px' }} sm="4">
                  <Card style={cardStyles}>
                    <CardBody>
                      <div style={{ textAlign: 'center' }}>
                        <BiBuildings size="2em" />
                      </div>
                      <p>Tu nombre aparecerá en las notificaciones de WhatsApp.</p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          )}
          <Form className="form" onSubmit={handleRegister}>
            <Row >
              <Col sm={6} style={{ padding: "20px", paddingBottom: "0" }} >
                {user.role === 'company' && (
                  <FormGroup row>
                    <Input
                      type="text"
                      id="companyName"
                      placeholder="Nombre de la empresa"
                      {...companyName}
                    />
                  </FormGroup>
                )}
                <FormGroup row>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Nombre del Usuario"
                    {...name}
                  />
                </FormGroup>
                <FormGroup row>
                  <Input
                    type="text"
                    id="lastName"
                    placeholder="Apellido"
                    {...lastName}
                  />
                </FormGroup>
                <FormGroup>
                  <Row >
                    <Col style={{ padding: "5px" }}>
                      <Select
                        inputProps={{ autoComplete: 'off' }}
                        onChange={handlePrefixChange}
                        value={prefixClientPhone}
                        required
                        placeholder="Prefijo"
                        options={jsonPrefix}
                      />
                    </Col>
                    <Col style={{ padding: "5px" }}>
                      <Input
                        type="phone"
                        placeholder="Celular"
                        id="phone"
                        name="phone"
                        {...clientPhone}
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup row>
                  <Col style={{ padding: "0px" }} sm={12}>
                    <Select
                      style={{ width: '100%' }}
                      inputProps={{ autoComplete: 'off' }}
                      onChange={handleTypeDocument}
                      value={typeDocument}
                      placeholder="Tipo de documento"
                      options={[
                        {
                          value: 'cc',
                          label: 'Cedula',
                        },
                        {
                          value: 'nit',
                          label: 'NIT',
                        },
                      ]}
                    />
                  </Col>
                </FormGroup>
              </Col>
              <Col sm={6} style={{ padding: "20px", paddingBottom: "0" }}  >
                <FormGroup row>
                  <Input
                    type="text"
                    id="documentNumber"
                    placeholder="Documento de Identidad"
                    name="documentNumber"
                    {...documentNumber}
                  />
                </FormGroup>
                <FormGroup row>
                  <Input
                    type="date"
                    id="date"
                    placeholder="Fecha Nacimiento"
                    {...bornDate}
                  />
                </FormGroup>
                <FormGroup row>
                  <Input
                    type="text"
                    id="address"
                    placeholder="Dirección"
                    {...address}
                  />
                </FormGroup>
                <FormGroup row>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Contraseña"
                    {...password}
                  />
                </FormGroup>
              </Col>
              <FormGroup className="">
                <div className="">
                  <Button color="success" size="lg" type="submit">
                    Guardar
                  </Button>
                </div>
              </FormGroup>
            </Row>
          </Form>

          {validatePay === true && (
            <div className="">
              <Button color="danger" size="lg" onClick={toggle}>
                Cancelar suscripción
              </Button>
              <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Confirmar cancelación</ModalHeader>
                <ModalBody>
                  ¿Estás seguro de que quieres cancelar tu suscripción?
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onClick={handleCancelSubscription}>Sí, cancelar</Button>{' '}
                  <Button color="secondary" onClick={toggle}>No, mantener suscripción</Button>
                </ModalFooter>
              </Modal>
            </div>
          )}
        </Container>
      </div>
    </>
  );
};

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

export default EditUser;

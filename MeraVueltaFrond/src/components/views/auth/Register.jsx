// React
import React from 'react';

import {
  Container,
  Button,
  Form,
  Label,
  FormGroup,
  Input,
  Row,
  Col,
  Card,
  CardBody,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { registerAction } from '../../../store/reducer';
import { AiOutlineMessage, AiOutlineHome } from 'react-icons/ai';
import { BiBuildings } from 'react-icons/bi';

const SignUp = () => {
  const dispatch = useDispatch();
  const [formIsValid, setFormIsValid] = React.useState(false);

  const [name, setName] = React.useState(null);
  const [companyName, setCompanyName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const [documentNumber, setDocumentNumber] = React.useState(null);
  const [typeDocument, setTypeDocument] = React.useState({
    value: 'cc',
    label: 'Cedula',
  });
  const [password, setPassword] = React.useState(null);
  const [passwordVerify, setPasswordVerify] = React.useState(null);
  const [bornDate, setBorndate] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [address, setAddress] = React.useState(null);
  const [clientPhone, setClientPhone] = React.useState(null);
  const [prefixClientPhone, setPrefixClientPhone] = React.useState({
    value: '57',
    label: 'Colombia (+57)',
  });
  const [role, setRole] = React.useState({
    value: 'company',
    label: 'Empresa',
  });

  const handleRegister = (event) => {
    event.preventDefault();
    if (password !== passwordVerify) {
      alert('Las contraseñas no coinciden');
      return;
    }
    let data = {
      name: name,
      lastName: lastName,
      typeDocument: typeDocument.value,
      documentNumber: documentNumber,
      email: email,
      role: role.value,
      password: password,
      bornDate: bornDate,
      address: address,
      clientPhone: clientPhone,
      prefix: prefixClientPhone.value
    };
    if (role.value === 'company') {
      data.companyName = companyName;
    }
    dispatch(registerAction(data));
  };

  const handleEmailChange = (email) => {
    setEmail(email.target.value);
  };

  const handlePasswordChange = (password) => {
    setPassword(password.target.value);
  };
  const handlePasswordVerifyChange = (passwordVerify) => {
    setPasswordVerify(passwordVerify.target.value);
  };

  const handleNameChange = (name) => {
    setName(name.target.value);
  };

  const handleCompanyNameChange = (name) => {
    setCompanyName(name.target.value);
  };

  const handleLasNameChange = (lastName) => {
    setLastName(lastName.target.value);
  };

  const handleDocumentNumber = (documentNumber) => {
    setDocumentNumber(documentNumber.target.value);
  };

  const handleTypeDocument = (role) => {
    setTypeDocument(role);
  };

  const handleBornDate = (bornDate) => {
    setBorndate(bornDate.target.value);
  };

  const handleRole = (role) => {
    setRole(role);
  };

  const handleAddressChange = (address) => {
    setAddress(address.target.value);
  };

  const handleClientPhoneChange = (address) => {
    setClientPhone(address.target.value);
  };

  const handlePrefixChange = (prefix) => {
    setPrefixClientPhone(prefix);
  };

  const [politics, setPolitics] = React.useState(null);
  const handlePolitics = (prefix) => {
    setPolitics(prefix);
  };

  React.useEffect(() => {
    if (
      formIsValid === false &&
      Object.keys(typeDocument).length &&
      Object.keys(role).length
    ) {
      setFormIsValid(true);
    }
  }, [setFormIsValid, formIsValid, typeDocument]);
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
  return (
    <>
      <Container>
        <br />
        {role.value === 'company' && (
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
                    <p>Tu dirección predeterminada será la ubicación de recolección para cada pedido.</p>
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
        {role.value === 'domiciliary' && (
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
        <br />
        <Form onSubmit={handleRegister}>
          <Row>
            <Col sm="6">
              <FormGroup>
                <Label for="bornDate">Tipo de usuario</Label>
                <Select
                  onChange={handleRole}
                  value={role}
                  inputProps={{ autoComplete: 'off', placeholder: 'Tipo de usuario' }}
                  options={[
                    {
                      value: 'domiciliary',
                      label: 'Domiciliario',
                    },
                    {
                      value: 'company',
                      label: 'Empresa',
                    },
                  ]}
                />
              </FormGroup>
              {role.value == 'company' && (
                <FormGroup>
                  <Input
                    type="text"
                    placeholder="Nombre de la empresa"
                    required
                    id="companyName"
                    name="companyName"
                    className="form-control"
                    onChange={handleCompanyNameChange}
                  />
                </FormGroup>
              )}
              <FormGroup>
                <Input
                  type="text"
                  placeholder="Nombre"
                  required
                  id="name"
                  name="name"
                  className="form-control"
                  onChange={handleNameChange}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="text"
                  placeholder="Apellido"
                  required
                  id="lastName"
                  name="lastName"
                  autoComplete="lastName"
                  className="form-control"
                  onChange={handleLasNameChange}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="email"
                  placeholder="Correo"
                  id="email"
                  name="email"
                  required
                  onChange={handleEmailChange}
                />
              </FormGroup>
              <FormGroup>
                <Select
                  onChange={handleTypeDocument} u
                  value={typeDocument}
                  inputProps={{ autoComplete: 'off', placeholder: 'Tipo de documento' }}
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
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label for="bornDate">Fecha de nacimiento</Label>
                <Input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  required
                  className="form-control"
                  id="bornDate"
                  name="bornDate"
                  onChange={handleBornDate}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="number"
                  placeholder="Numero de documento"
                  name="documentNumber"
                  id="documentNumber"
                  autoComplete="documentNumber"
                  required
                  className="form-control"
                  onChange={handleDocumentNumber}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="password"
                  placeholder="Contraseña"
                  id="password"
                  name="password"
                  required
                  onChange={handlePasswordChange}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="password"
                  placeholder="Confirma contraseña"
                  id="passwordVerity"
                  name="passwordVerity"
                  required
                  onChange={handlePasswordVerifyChange}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="address"
                  placeholder="Dirección"
                  id="address"
                  name="address"
                  required
                  onChange={handleAddressChange}
                />
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col>
                    <Select
                      onChange={handlePrefixChange}
                      value={prefixClientPhone}
                      inputProps={{ autoComplete: 'off', required: true, placeholder: 'Prefijo' }}
                      options={[
                        {
                          value: '57',
                          label: 'Colombia +57',
                        },
                      ]}
                    />
                  </Col>
                  <Col>
                    <Input
                      type="phone"
                      placeholder="Numero celular"
                      id="phone"
                      name="phone"
                      required
                      onChange={handleClientPhoneChange}
                    />
                  </Col>
                </Row>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <FormGroup style={{ marginLeft: "5%" }}>
                <Row>
                  <Col sm={1} xs={3}>
                    <Input className="form-check-input-register" onChange={handlePolitics}
                      value={politics} required type="checkbox" />
                  </Col>
                  <Col sm={11} xs={9}>
                    <Label >
                      ¿Acepta el tratamiento de datos?
                    </Label>
                  </Col>
                  <Col sm={12}>
                    <Button color="secondary" style={{ padding: "5px 10px", fontSize: "9px" }} onClick={() => window.open(process.env.REACT_APP_REACT_HOST + '/politics', '_blank')}>
                      Ir al tratamiento de datos
                    </Button>
                  </Col>
                </Row>
              </FormGroup>
            </Col>
            <Col sm={8}>
              <Button
                color="success"
                type="submit"
                size='lg'
                disabled={!formIsValid}
              >
                Registrar
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default SignUp;

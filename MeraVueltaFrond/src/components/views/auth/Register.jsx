// React
import React from 'react';

import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  Checkbox,
} from 'prizma-ui';
import { useDispatch } from 'react-redux';
import { registerAction, addNotification } from '../../../store/reducer';
import { AiOutlineMessage, AiOutlineHome } from 'react-icons/ai';
import { BiBuildings } from 'react-icons/bi';

const SignUp = () => {
  const dispatch = useDispatch();
  const [formIsValid, setFormIsValid] = React.useState(false);

  const [name, setName] = React.useState(null);
  const [companyName, setCompanyName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const [documentNumber, setDocumentNumber] = React.useState(null);
  const [typeDocument, setTypeDocument] = React.useState('cc');
  const [password, setPassword] = React.useState(null);
  const [passwordVerify, setPasswordVerify] = React.useState(null);
  const [bornDate, setBorndate] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [address, setAddress] = React.useState(null);
  const [clientPhone, setClientPhone] = React.useState(null);
  const [prefixClientPhone, setPrefixClientPhone] = React.useState('57');
  const [role, setRole] = React.useState('company');

  const handleRegister = (event) => {
    event.preventDefault();
    if (password !== passwordVerify) {
      dispatch(addNotification({ message: 'Las contraseñas no coinciden', color: 'danger' }));
      return;
    }
    let data = {
      name: name,
      lastName: lastName,
      typeDocument: typeDocument,
      documentNumber: documentNumber,
      email: email,
      role: role,
      password: password,
      bornDate: bornDate,
      address: address,
      clientPhone: clientPhone,
      prefix: prefixClientPhone,
    };
    if (role === 'company') {
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

  const handleTypeDocument = (e) => {
    setTypeDocument(e.target.value);
  };

  const handleBornDate = (bornDate) => {
    setBorndate(bornDate.target.value);
  };

  const handleRole = (e) => {
    setRole(e.target.value);
  };

  const handleAddressChange = (address) => {
    setAddress(address.target.value);
  };

  const handleClientPhoneChange = (address) => {
    setClientPhone(address.target.value);
  };

  const handlePrefixChange = (e) => {
    setPrefixClientPhone(e.target.value);
  };

  const [politics, setPolitics] = React.useState(false);
  const handlePolitics = (e) => {
    setPolitics(e.target.checked);
  };

  React.useEffect(() => {
    if (formIsValid === false && typeDocument && role) {
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
      <div className="container">
        <br />
        {role === 'company' && (
          <>
            <div className="row" style={{ height: '100%' }}>
              <div className="col-sm-4" style={{ marginTop: '10px' }}>
                <Card style={cardStyles}>
                  <CardBody>
                    <div style={{ textAlign: 'center' }}>
                      <AiOutlineMessage size="2em" />
                    </div>
                    <p>Recibirás notificaciones de WhatsApp en tu número de celular.</p>
                  </CardBody>
                </Card>
              </div>
              <div className="col-sm-4" style={{ marginTop: '10px' }}>
                <Card style={cardStyles}>
                  <CardBody>
                    <div style={{ textAlign: 'center' }}>
                      <AiOutlineHome size="2em" />
                    </div>
                    <p>Tu dirección predeterminada será la ubicación de recolección para cada pedido.</p>
                  </CardBody>
                </Card>
              </div>
              <div className="col-sm-4" style={{ marginTop: '10px' }}>
                <Card style={cardStyles}>
                  <CardBody>
                    <div style={{ textAlign: 'center' }}>
                      <BiBuildings size="2em" />
                    </div>
                    <p>El nombre de tu empresa aparecerá en las notificaciones de WhatsApp.</p>
                  </CardBody>
                </Card>
              </div>
            </div>
          </>
        )}
        {role === 'domiciliary' && (
          <>
            <div className="row" style={{ height: '100%' }}>
              <div className="col-sm-4" style={{ marginTop: '10px' }}>
                <Card style={cardStyles}>
                  <CardBody>
                    <div style={{ textAlign: 'center' }}>
                      <AiOutlineMessage size="2em" />
                    </div>
                    <p>Recibirás notificaciones de WhatsApp en tu número de celular.</p>
                  </CardBody>
                </Card>
              </div>
              <div className="col-sm-4" style={{ marginTop: '10px' }}>
                <Card style={cardStyles}>
                  <CardBody>
                    <div style={{ textAlign: 'center' }}>
                      <AiOutlineHome size="2em" />
                    </div>
                    <p>Tu WhatsApp sera enviado a los clientes.</p>
                  </CardBody>
                </Card>
              </div>
              <div className="col-sm-4" style={{ marginTop: '10px' }}>
                <Card style={cardStyles}>
                  <CardBody>
                    <div style={{ textAlign: 'center' }}>
                      <BiBuildings size="2em" />
                    </div>
                    <p>Tu nombre aparecerá en las notificaciones de WhatsApp.</p>
                  </CardBody>
                </Card>
              </div>
            </div>
          </>
        )}
        <br />
        <form onSubmit={handleRegister}>
          <div className="row">
            <div className="col-sm-6">
              <div className="mb-3">
                <label htmlFor="role">Tipo de usuario</label>
                <Select
                  id="role"
                  value={role}
                  onChange={handleRole}
                >
                  <option value="domiciliary">Domiciliario</option>
                  <option value="company">Empresa</option>
                </Select>
              </div>
              {role === 'company' && (
                <div className="mb-3">
                  <label htmlFor="companyName">Nombre de la empresa</label>
                  <Input
                    type="text"
                    placeholder="Nombre de la empresa"
                    required
                    id="companyName"
                    name="companyName"
                    onChange={handleCompanyNameChange}
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="name">Nombre</label>
                <Input
                  type="text"
                  placeholder="Nombre"
                  required
                  id="name"
                  name="name"
                  onChange={handleNameChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName">Apellido</label>
                <Input
                  type="text"
                  placeholder="Apellido"
                  required
                  id="lastName"
                  name="lastName"
                  autoComplete="lastName"
                  onChange={handleLasNameChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email">Correo electrónico</label>
                <Input
                  type="email"
                  placeholder="Correo"
                  id="email"
                  name="email"
                  required
                  onChange={handleEmailChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="typeDocument">Tipo de documento</label>
                <Select
                  id="typeDocument"
                  value={typeDocument}
                  onChange={handleTypeDocument}
                >
                  <option value="cc">Cedula</option>
                  <option value="nit">NIT</option>
                </Select>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="mb-3">
                <label htmlFor="bornDate">Fecha de nacimiento</label>
                <Input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  required
                  id="bornDate"
                  name="bornDate"
                  onChange={handleBornDate}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="documentNumber">Número de documento</label>
                <Input
                  type="number"
                  placeholder="Numero de documento"
                  name="documentNumber"
                  id="documentNumber"
                  autoComplete="documentNumber"
                  required
                  onChange={handleDocumentNumber}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password">Contraseña</label>
                <Input
                  type="password"
                  placeholder="Contraseña"
                  id="password"
                  name="password"
                  required
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="passwordVerity">Confirmar contraseña</label>
                <Input
                  type="password"
                  placeholder="Confirma contraseña"
                  id="passwordVerity"
                  name="passwordVerity"
                  required
                  onChange={handlePasswordVerifyChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address">Dirección</label>
                <Input
                  type="text"
                  placeholder="Dirección"
                  id="address"
                  name="address"
                  required
                  onChange={handleAddressChange}
                />
              </div>
              <div className="mb-3">
                <div className="row">
                  <div className="col">
                    <label htmlFor="prefixClientPhone">Prefijo</label>
                    <Select
                      id="prefixClientPhone"
                      value={prefixClientPhone}
                      onChange={handlePrefixChange}
                      required
                    >
                      <option value="57">Colombia +57</option>
                    </Select>
                  </div>
                  <div className="col">
                    <label htmlFor="phone">Número celular</label>
                    <Input
                      type="tel"
                      placeholder="Numero celular"
                      id="phone"
                      name="phone"
                      required
                      onChange={handleClientPhoneChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <div className="mb-3" style={{ marginLeft: "5%" }}>
                <div className="row">
                  <div className="col-sm-1 col-xs-3">
                    <Checkbox
                      className="form-check-input-register"
                      onChange={handlePolitics}
                      checked={!!politics}
                      required
                    />
                  </div>
                  <div className="col-sm-11 col-xs-9">
                    <label>
                      ¿Acepta el tratamiento de datos?
                    </label>
                  </div>
                  <div className="col-sm-12">
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => window.open(process.env.REACT_APP_REACT_HOST + '/politics', '_blank')}
                    >
                      Ir al tratamiento de datos
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-8">
              <Button
                variant="accent"
                type="submit"
                size="lg"
                disabled={!formIsValid}
              >
                Registrar
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;

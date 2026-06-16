import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAction, cancelSubscriptionAction } from '../../../store/reducer';
import { Button, Card, CardBody, Input, Select, Modal, ConfirmDialog } from 'prizma-ui';
import { AiOutlineMessage, AiOutlineHome } from 'react-icons/ai';
import { BiBuildings } from 'react-icons/bi';
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
  const [typeDocument, setTypeDocument] = React.useState(user.typeDocument || 'cc');
  const documentNumber = useFormInput(user.documentNumber);
  const bornDate = useFormInput(moment(user.bornDate).format('YYYY-MM-DD'));
  const address = useFormInput(user.address);
  const [prefixClientPhone, setPrefixClientPhone] = React.useState(user.prefix || '57');

  const handlePrefixChange = (e) => {
    setPrefixClientPhone(e.target.value);
  };

  const handleRegister = (event) => {
    event.preventDefault();
    let data = {};
    if (name?.value) data.name = name.value;
    if (lastName?.value) data.lastName = lastName.value;
    if (typeDocument) data.typeDocument = typeDocument;
    if (documentNumber?.value) data.documentNumber = documentNumber.value;
    if (bornDate?.value) data.bornDate = bornDate.value;
    if (address?.value) data.address = address.value;
    if (clientPhone?.value) data.clientPhone = clientPhone.value;
    if (prefixClientPhone) data.prefix = prefixClientPhone;
    if (companyName?.value) data.companyName = companyName.value;
    if (password.value) data.password = password.value;
    dispatch(updateUserAction({ id: user.id, data: data }));
  };

  const handleTypeDocument = (e) => {
    setTypeDocument(e.target.value);
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
        <div className="container">
          {(user.role === 'company' || user.role === 'domiciliary') && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div style={{ flex: 1, marginTop: '10px' }}>
                <Card style={cardStyles}>
                  <CardBody>
                    <div style={{ textAlign: 'center' }}>
                      <AiOutlineMessage size="2em" />
                    </div>
                    <p>Recibirás notificaciones de WhatsApp en tu número de celular.</p>
                  </CardBody>
                </Card>
              </div>
              <div style={{ flex: 1, marginTop: '10px' }}>
                <Card style={cardStyles}>
                  <CardBody>
                    <div style={{ textAlign: 'center' }}>
                      <AiOutlineHome size="2em" />
                    </div>
                    <p>
                      {user.role === 'company'
                        ? 'Tu dirección será la ubicación predeterminada de recolección para cada pedido.'
                        : 'Tu WhatsApp sera enviado a los clientes.'}
                    </p>
                  </CardBody>
                </Card>
              </div>
              <div style={{ flex: 1, marginTop: '10px' }}>
                <Card style={cardStyles}>
                  <CardBody>
                    <div style={{ textAlign: 'center' }}>
                      <BiBuildings size="2em" />
                    </div>
                    <p>
                      {user.role === 'company'
                        ? 'El nombre de tu empresa aparecerá en las notificaciones de WhatsApp.'
                        : 'Tu nombre aparecerá en las notificaciones de WhatsApp.'}
                    </p>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}

          <form className="form" onSubmit={handleRegister}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1, padding: '20px', paddingBottom: '0' }}>
                {user.role === 'company' && (
                  <div style={{ marginBottom: '12px' }}>
                    <Input
                      type="text"
                      id="companyName"
                      placeholder="Nombre de la empresa"
                      {...companyName}
                    />
                  </div>
                )}
                <div style={{ marginBottom: '12px' }}>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Nombre del Usuario"
                    {...name}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <Input
                    type="text"
                    id="lastName"
                    placeholder="Apellido"
                    {...lastName}
                  />
                </div>
                <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <Select
                    value={prefixClientPhone}
                    onChange={handlePrefixChange}
                    required
                  >
                    {jsonPrefix.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </Select>
                  <Input
                    type="tel"
                    placeholder="Celular"
                    id="phone"
                    name="phone"
                    {...clientPhone}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <Select
                    value={typeDocument}
                    onChange={handleTypeDocument}
                  >
                    <option value="cc">Cedula</option>
                    <option value="nit">NIT</option>
                  </Select>
                </div>
              </div>

              <div style={{ flex: 1, padding: '20px', paddingBottom: '0' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Input
                    type="text"
                    id="documentNumber"
                    placeholder="Documento de Identidad"
                    name="documentNumber"
                    {...documentNumber}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <Input
                    type="date"
                    id="date"
                    placeholder="Fecha Nacimiento"
                    {...bornDate}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <Input
                    type="text"
                    id="address"
                    placeholder="Dirección"
                    {...address}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Contraseña"
                    {...password}
                  />
                </div>
              </div>
            </div>

            <div>
              <Button variant="accent" size="lg" type="submit">
                Guardar
              </Button>
            </div>
          </form>

          {validatePay === true && (
            <div style={{ marginTop: '12px' }}>
              <Button variant="danger" size="lg" onClick={toggle}>
                Cancelar suscripción
              </Button>
              <ConfirmDialog
                open={modal}
                onClose={toggle}
                onConfirm={handleCancelSubscription}
                title="Confirmar cancelación"
                message="¿Estás seguro de que quieres cancelar tu suscripción?"
                confirmLabel="Sí, cancelar"
                cancelLabel="No, mantener suscripción"
                tone="danger"
              />
            </div>
          )}
        </div>
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

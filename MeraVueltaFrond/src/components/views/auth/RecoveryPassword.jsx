import React, { useState } from 'react';
import { Button, Alert, Card, CardBody, Input } from 'prizma-ui';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import { sendEmailRecoveryPasswordAction, recoveryPasswordAction, addNotification } from '../../../store/reducer';

const RecoveryPassword = (props) => {
  const token = props.match.params.token;
  const dispatch = useDispatch();
  const recoveryPasswordError = useSelector((state) => state.login.recoveryPasswordError);
  const recoveryPasswordState = useSelector((state) => state.login.recoveryPassword);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirm = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const recoveryPassword = (e) => {
    e.preventDefault();
    if (password === passwordConfirm) {
      dispatch(recoveryPasswordAction({
        token,
        password,
      }));
    } else {
      dispatch(addNotification({ message: 'Las contraseñas no coinciden', color: 'danger' }));
    }
  };

  return (
    <div className="container">
      <Card
        style={{
          width: '100%',
          position: 'relative',
          top: '30vh',
        }}
      >
        <CardBody>
          <h1 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>Recuperar contraseña</h1>

          {token == 'null' && (
            <div>
              <Alert tone="info">Ingresa tu correo para recuperar tu contraseña</Alert>
              <p>Te llegara un correo con una URL para recuperar tu contraseña</p>
              <label htmlFor="recovery-email">Correo electrónico</label>
              <Input
                type="email"
                id="recovery-email"
                placeholder="Correo"
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: '8px' }}
              />
              <Button variant="primary" onClick={() => dispatch(sendEmailRecoveryPasswordAction(email))}>
                Re enviar
              </Button>
            </div>
          )}

          {token != 'null' && (
            <>
              {recoveryPasswordError === true && (
                <div>
                  <Alert tone="danger">Ocurrió un error al confirmar tu correo</Alert>
                  <label htmlFor="recovery-email-retry">Correo electrónico</label>
                  <Input
                    type="email"
                    id="recovery-email-retry"
                    placeholder="Correo"
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: '8px' }}
                  />
                  <Button variant="primary" onClick={() => dispatch(sendEmailRecoveryPasswordAction(email))}>
                    Re enviar
                  </Button>
                </div>
              )}
              {recoveryPasswordError === false && (
                <>
                  {recoveryPasswordState === true && (
                    <div>
                      <Alert tone="success">Email confirmado correctamente</Alert>
                      <Button
                        variant="primary"
                        onClick={(e) => { e.preventDefault(); dispatch(push('/')); }}
                      >
                        Continuar
                      </Button>
                    </div>
                  )}
                  {recoveryPasswordState === false && (
                    <div>
                      <Alert tone="info">Ingresa tu nueva contraseña</Alert>
                      <label htmlFor="new-password">Nueva contraseña</label>
                      <Input
                        type="password"
                        id="new-password"
                        placeholder="Contraseña"
                        onChange={handlePassword}
                        style={{ marginBottom: '8px' }}
                      />
                      <br />
                      <label htmlFor="confirm-password">Confirmar contraseña</label>
                      <Input
                        type="password"
                        id="confirm-password"
                        placeholder="Confirmar contraseña"
                        onChange={handlePasswordConfirm}
                        style={{ marginBottom: '8px' }}
                      />
                      <Button variant="primary" onClick={recoveryPassword}>
                        Confirmar
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default RecoveryPassword;

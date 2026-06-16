import React, { useEffect, useState } from 'react';
import { Button, Alert, Card, CardBody, Input } from 'prizma-ui';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import { confirmEmailAction, resendEmailAction } from '../../../store/reducer';

const ConfirmEmail = (props) => {
  const token = props.match.params.token;
  const dispatch = useDispatch();
  const errorConfirmEmail = useSelector((state) => state.login.errorConfirmEmail);
  const confirmEmail = useSelector((state) => state.login.user?.confirmEmail);
  const user = useSelector((state) => state.login.user);

  useEffect(() => {
    if (token != 'null') {
      dispatch(confirmEmailAction(token));
    }
  }, []);

  useEffect(() => {
    if (user != null && user.confirmEmail === true) {
      dispatch(push('/'));
    }
  }, [user]);

  const [email, setEmail] = useState('');

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
          <h5 style={{ marginBottom: '4px' }}>Confirmar tu correo</h5>
          <p style={{ color: 'var(--cui-text-muted, #6b7280)', marginBottom: '12px' }}>
            Se requiere confirmar tu correo
          </p>

          {token == 'null' && (
            <div>
              <Alert tone="info">Ingresa a tu correo y confirma tu cuenta</Alert>
              {user == null && (
                <>
                  <Input
                    type="email"
                    placeholder="Correo"
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: '8px' }}
                  />
                  <Button variant="primary" onClick={() => dispatch(resendEmailAction(email))}>
                    Re enviar
                  </Button>
                </>
              )}
              {user != null && (
                <Button variant="primary" onClick={() => dispatch(resendEmailAction(user.email))}>
                  Re enviar
                </Button>
              )}
              <Button variant="secondary" onClick={() => dispatch(push('/'))}>
                Volver
              </Button>
            </div>
          )}

          {token != 'null' && (
            <>
              {errorConfirmEmail === true && (
                <div>
                  <Alert tone="danger">Ocurrió un error al confirmar tu correo</Alert>
                  {user == null && (
                    <>
                      <Input
                        type="email"
                        placeholder="Correo"
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: '8px' }}
                      />
                      <Button variant="primary" onClick={() => dispatch(resendEmailAction(email))}>
                        Re enviar
                      </Button>
                    </>
                  )}
                  {user != null && (
                    <Button variant="primary" onClick={() => dispatch(resendEmailAction(user.email))}>
                      Re enviar
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => dispatch(push('/'))}>
                    Volver
                  </Button>
                </div>
              )}
              {errorConfirmEmail === false && (
                <>
                  {confirmEmail === true && (
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
                  {confirmEmail === false && (
                    <div>
                      <Alert tone="info">Confirmando el correo</Alert>
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

export default ConfirmEmail;

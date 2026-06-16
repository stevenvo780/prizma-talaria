import React, { useState } from 'react';
import { Button, Input } from 'prizma-ui';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import { loginAction, addNotification } from '../../../store/reducer';

const LoginPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleLogin = (event) => {
    event.preventDefault();
    if (localStorage.getItem('acceptedCookies')) {
      if (!email || !password) {
        dispatch(addNotification({ message: 'Debe ingresar correo y contraseña', color: 'danger' }));
        return;
      }
      dispatch(loginAction({ email, password }));
    } else {
      dispatch(addNotification({ message: 'Debe aceptar las cookies para continuar', color: 'danger' }));
    }
  };

  const handleChangeEmail = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  return (
    <>
      <div className="container">
        <div className="row mt-5">
          <div className="col-sm-6 p-5 m-auto shadow rounded-lg">
            <div className="text-center mb-3">
              <img
                src="/prizma-symbol.svg"
                alt="Prizma"
                width={48}
                height={48}
                style={{ display: "block", margin: "0 auto 8px" }}
              />
              <h1 className="mb-0">Talaria</h1>
              <small className="prizma-umbrella">parte de Prizma</small>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email">Correo electrónico</label>
                <Input
                  type="email"
                  placeholder="Correo"
                  id="email"
                  name="email"
                  onChange={handleChangeEmail}
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password">Contraseña</label>
                <Input
                  type="password"
                  placeholder="Contraseña"
                  id="password"
                  name="password"
                  onChange={handleChangePassword}
                  autoComplete="current-password"
                />
              </div>
              <Button variant="primary" type="submit">
                Iniciar Sesión
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => dispatch(push(`/register`))}
              >
                Registrarse
              </Button>
              <br />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => dispatch(push("/recoverPassword/null"))}
              >
                Recuperar Contraseña
              </Button>
            </form>
          </div>
          <div className="col-sm-6">
            <img
              width={"85%"}
              src={"https://firebasestorage.googleapis.com/v0/b/domicilios-fc429.appspot.com/o/assets%2FDise%C3%B1o%20nuevo%20logo%201080.png?alt=media&token=81605ee7-c7d6-4b25-9857-0b0b19509ffb"}
              alt="Login Image"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

import { Router } from 'react-router';
import { Switch, Route } from 'react-router-dom'; // Librería react-router-dom
import { history } from './store/configureStore';
import { useSelector, useDispatch } from 'react-redux';
import CompanyLayout from './layouts/CompanyLayout';
import NoAuth from './layouts/NoAuth';
import routesCompany from './routes/routesCompany'
import routesDomiciliary from './routes/routesDomiciliary';
import routesPublic from './routes/routesPublic';
import { restoreSessionStateAction, updateUserDoneAction } from './store/reducer';
import { userApi } from './store/middleware/api';
import { getSessionCookie } from './session';
import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import InfoAlert from './components/hooks/InfoAlert';
import RingLoader from "react-spinners/RingLoader";
const override = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
};

function App() {
  const user = useSelector((state) => state.login.user);
  const loading = useSelector((state) => state.ui.loading);
  const dispatch = useDispatch();
  React.useEffect(async () => {
    if (!user) {
      const userSessionInfo = getSessionCookie();
      if (Object.keys(userSessionInfo).length > 0) {
        dispatch(restoreSessionStateAction());
        const userUpdate = await userApi.getStatusLogin();
        if (userUpdate?.data?.user) {
          dispatch(updateUserDoneAction(userUpdate.data.user));
        }
      }
    }
  }, []);

  React.useEffect(() => {
    if (loading) {
      document.body.style.cursor = 'wait';
    } else {
      document.body.style.cursor = 'default';
    }
  }, [loading]);
  const [acceptedCookies, setAcceptedCookies] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('acceptedCookies')) {
      setAcceptedCookies(true);
    }
  }, []);
  const handleAcceptCookies = () => {
    setAcceptedCookies(true);
    localStorage.setItem('acceptedCookies', true);
  };
  return (
    <div className="cui-root" data-module="meravuelta">
      {loading === true && (
        <div className="loader">
          <RingLoader
            color={'#0a827f'}
            loading={loading}
            cssOverride={override}
            size={100}
            aria-label="Cargando"
            data-testid="loader"
          />
        </div>
      )}
      {!acceptedCookies && (
        <div className="cookie-message">
          Este sitio utiliza cookies para mejorar su experiencia.
          <Button onClick={handleAcceptCookies}>Aceptar</Button>
        </div>
      )}
      <Router history={history}>
        <Switch>
          {user && user.role === 'domiciliary' && (
            <Route
              path="/domiciliary"
              render={(props) => (
                <CompanyLayout {...props} routes={routesDomiciliary} />
              )}
            />
          )}
          {user && user.role === 'company' && (
            <Route
              path="/company"
              render={(props) => (
                <CompanyLayout {...props} routes={routesCompany} />
              )}
            />
          )}
          <Route
            path="*"
            render={(props) => (
              <NoAuth {...props} routes={routesPublic} />
            )}
          />
        </Switch>
      </Router>
      <InfoAlert />
    </div>
  );
}

export default App;

import React from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import { Route, Switch, useLocation } from 'react-router-dom';
import Footer from '../components/Base/Footer/Footer';
import Sidebar from '../components/Base/Sidebar/Sidebar';
import Navbar from '../components/Base/Navbars/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
let ps;

function AdminLayout(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);
  const mainPanel = React.useRef();
  const location = useLocation();
  React.useEffect(() => {
    if (user) {
      if (user.confirmEmail == null || user.confirmEmail == false) {
        dispatch(push('/confirmEmail/null'));
      }
    }
  }, [user]);
  React.useEffect(() => {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle('perfect-scrollbar-on');
    }
    return function cleanup() {
      if (navigator.platform.indexOf('Win') > -1) {
        ps.destroy();
        document.body.classList.toggle('perfect-scrollbar-on');
      }
    };
  });
  React.useEffect(() => {
    mainPanel.current.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location]);

  return (
    <div className="wrapper">
      <Sidebar
        {...props}
        routes={props.routes}
        bgColor={'black'}
        activeColor={'warning'}
      />
      <div className="main-panel" ref={mainPanel}>
      <Navbar {...props} />
        <div style={{ marginTop: "60px" }} className="content">
          <Switch>
            {props.routes.map((prop, key) => {
              let validateRol = false;
              prop.rol.forEach((rol) => {
                if (rol === user?.role) {
                  validateRol = true;
                }
              });
              if (validateRol) {
                return (
                  <Route
                    path={prop.layout + prop.path}
                    component={prop.component}
                    key={key}
                  />
                );
              }
            })}
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

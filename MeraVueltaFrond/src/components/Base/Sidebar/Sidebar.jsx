import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';
import PerfectScrollbar from 'perfect-scrollbar';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllOrderDoneAction,
  searchAllOrdersDoneAction,
} from '../../../store/reducer';
var ps;

function Sidebar(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);
  const validatePay = useSelector((state) => state.login.validatePay);
  const plan = useSelector((state) => state.login.plan);
  const sidebar = React.useRef();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1
      ? 'active'
      : '';
  };
  React.useEffect(() => {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf('Win') > -1) {
        ps.destroy();
      }
    };
  });
  function handleNavLinkClick() {
    dispatch(getAllOrderDoneAction([]));
    dispatch(searchAllOrdersDoneAction([]));
  }
  return (
    <div
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo">
        <a href="#" className="simple-text logo-mini">
          <div >
            <img className="logo-img" src="/cauce-symbol.svg" alt="Olympo" />
          </div>
        </a>
        <a href="https://www.meravuelta.com/" className="simple-text logo-normal">
          Mera Vuelta
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          {(
            (validatePay === false ||
              plan !== "PLAN_2000") &&
            user.role === "company"
          ) && (
              <li
                className={
                  activeRoute('/company/upgrade')
                }
              >
                <NavLink
                  to="/company/upgrade"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="nc-icon nc-spaceship" />
                  <p>Upgrade</p>
                </NavLink>
              </li>
            )}
          {props.routes.map((prop, key) => {
            let validateRol = false;
            prop.rol.forEach((rol) => {
              if (rol === user?.role) {
                validateRol = true;
              }
            });
            if (validateRol && prop.visible) {
              return (
                <li
                  className={
                    activeRoute(prop.path)
                  }
                  key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                    onClick={() => handleNavLinkClick(prop.layout, prop.path)}
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            }
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;

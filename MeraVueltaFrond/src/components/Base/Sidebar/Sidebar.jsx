import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'prizma-ui';
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
        <span className="simple-text logo-mini" aria-hidden="true">
          <div>
            <img className="logo-img" src="/prizma-symbol.svg" alt="" />
          </div>
        </span>
        <a href="https://www.talaria.com/" className="simple-text logo-normal">
          Talaria
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          {(
            (validatePay === false ||
              plan !== "PLAN_2000") &&
            user.role === "company"
          ) && (
              <NavItem
                active={activeRoute('/company/upgrade') === 'active'}
                icon={<i className="nc-icon nc-spaceship" />}
              >
                <NavLink
                  to="/company/upgrade"
                  className="nav-link"
                  activeClassName="active"
                >
                  Upgrade
                </NavLink>
              </NavItem>
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
                <NavItem
                  key={key}
                  active={activeRoute(prop.path) === 'active'}
                  icon={<i className={prop.icon} />}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                    onClick={() => handleNavLinkClick(prop.layout, prop.path)}
                    {...(prop.path === '/vueltas' ? { 'data-tour': 'sidebar-vueltas' } : {})}
                  >
                    {prop.name}
                  </NavLink>
                </NavItem>
              );
            }
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;

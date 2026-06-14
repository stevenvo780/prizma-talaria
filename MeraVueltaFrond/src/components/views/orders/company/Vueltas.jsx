import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import classnames from 'classnames';
import OrdersByStatus from './Orders/OrdersByStatus';

import {
  setVueltasTabIndex,
  getAllOrderDoneAction,
  searchAllOrdersDoneAction,
} from '../../../../store/reducer';

const Vueltas = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.ui.vueltasTabIndex);
  function handleNavLinkClick() {
    dispatch(getAllOrderDoneAction([]));
    dispatch(searchAllOrdersDoneAction([]));
  }
  return (
    <>
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'EsperaSalida' })}
              onClick={() => {
                handleNavLinkClick();
                dispatch(setVueltasTabIndex('EsperaSalida'));
              }}
            >
              <i className="nc-icon nc-watch-time" /> Asignadas
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'Aceptada' })}
              onClick={() => {
                handleNavLinkClick();
                dispatch(setVueltasTabIndex('Aceptada'));
              }}
            >
              <i className="nc-icon nc-bullet-list-67" /> En ruta
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'Salida' })}
              onClick={() => {
                handleNavLinkClick();
                dispatch(setVueltasTabIndex('Salida'));
              }}
            >
              <i className="nc-icon nc-delivery-fast" /> En curso
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'Entregada' })}
              onClick={() => {
                handleNavLinkClick();
                dispatch(setVueltasTabIndex('Entregada'));
              }}
            >
              <i className="nc-icon nc-check-2" /> Finalizadas
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="EsperaSalida">
            {activeTab === 'EsperaSalida' && <OrdersByStatus state={"EsperaSalida"} />}
          </TabPane>
          <TabPane tabId="Aceptada">
            {activeTab === 'Aceptada' && <OrdersByStatus state={"Aceptada"} />}
          </TabPane>
          <TabPane tabId="Salida">
            {activeTab === 'Salida' && <OrdersByStatus state={"Salida"} />}
          </TabPane>
          <TabPane tabId="Entregada">
            {activeTab === 'Entregada' && <OrdersByStatus state={"Entregada"} />}
          </TabPane>
        </TabContent>
      </div>
    </>
  );
};

export default Vueltas;

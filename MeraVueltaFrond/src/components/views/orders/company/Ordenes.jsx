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
  setOrderTabIndex,
  getAllOrderDoneAction,
  searchAllOrdersDoneAction,
} from '../../../../store/reducer';

const Ordenes = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.ui.orderTabIndex);
  function handleNavLinkClick() {
    dispatch(getAllOrderDoneAction([]));
    dispatch(searchAllOrdersDoneAction([]));
  }
  return (
    <>
      <Nav tabs>
        <NavItem >
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => {
              handleNavLinkClick();
              dispatch(setOrderTabIndex('1'));
            }}
          >
            <i className="nc-icon nc-delivery-fast" /> Compras
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => {
              handleNavLinkClick();
              dispatch(setOrderTabIndex('2'));
            }}
          >
            <i className="nc-icon nc-bus-front-12" /> Entregas
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          {activeTab === '1' && <OrdersByStatus state={"Compra"} />}
        </TabPane>
        <TabPane tabId="2">
          {activeTab === '2' && <OrdersByStatus state={"EsperaDespacho"} />}
        </TabPane>
      </TabContent>
    </>
  );
};

export default Ordenes;

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
import OrdersByStatusSearch from '../Orders/OrdersByStatusSearch';

import {
  searchAllOrdersAction,
} from '../../../../../store/reducer';

const OrdenesSearch = (props) => {
  const { word } = props.match.params;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState('all');
  const orders = useSelector((state) => state.order.ordersSearch);
  React.useEffect(() => {
    if (orders?.length === 0) {
      dispatch(
        searchAllOrdersAction({
          word: word,
          take: 50,
          skip: 0,
        }),
      );
    }
  }, []);
  return (
    <>
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'all' })}
              onClick={() => {
                setActiveTab('all');
              }}
            >
              <i className="nc-icon nc-app" /> Todas
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'Compra' })}
              onClick={() => {
                setActiveTab('Compra');
              }}
            >
              <i className="nc-icon nc-watch-time" /> Compras
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'EsperaSalida' })}
              onClick={() => {
                setActiveTab('EsperaSalida');
              }}
            >
              <i className="nc-icon nc-watch-time" /> Asignadas
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'Aceptada' })}
              onClick={() => {
                setActiveTab('Aceptada');
              }}
            >
              <i className="nc-icon nc-bullet-list-67" /> En ruta
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'Salida' })}
              onClick={() => {
                setActiveTab('Salida');
              }}
            >
              <i className="nc-icon nc-delivery-fast" /> En curso
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'Entregada' })}
              onClick={() => {
                setActiveTab('Entregada');
              }}
            >
              <i className="nc-icon nc-check-2" /> Finalizadas
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="all">
            {activeTab === 'all' && <OrdersByStatusSearch word={word} stateOrder={"all"} />}
          </TabPane>
          <TabPane tabId="Compra">
            {activeTab === 'Compra' && <OrdersByStatusSearch word={word} stateOrder={"Compra"} />}
          </TabPane>
          <TabPane tabId="EsperaSalida">
            {activeTab === 'EsperaSalida' && <OrdersByStatusSearch word={word} stateOrder={"EsperaSalida"} />}
          </TabPane>
          <TabPane tabId="Aceptada">
            {activeTab === 'Aceptada' && <OrdersByStatusSearch word={word} stateOrder={"Aceptada"} />}
          </TabPane>
          <TabPane tabId="Salida">
            {activeTab === 'Salida' && <OrdersByStatusSearch word={word} stateOrder={"Salida"} />}
          </TabPane>
          <TabPane tabId="Entregada">
            {activeTab === 'Entregada' && <OrdersByStatusSearch word={word} stateOrder={"Entregada"} />}
          </TabPane>
        </TabContent>
      </div>
    </>
  );
};

export default OrdenesSearch;

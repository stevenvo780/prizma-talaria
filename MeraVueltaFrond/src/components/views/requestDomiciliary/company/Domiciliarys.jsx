import * as React from 'react';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
} from 'reactstrap';
import classnames from 'classnames';
import MyDomiciliaryList from './MyDomiciliaryList';
import RequestDomiciliaryList from './RequestDomiciliaryList';
import RequestWaitingDomiciliaryList from './RequestWaitingDomiciliaryList';
import { MapAllDealer } from '../../maps/MapBox/MapAllDealer';

const Domiciliarys = () => {
  const [activeTab, setActiveTab] = React.useState('1');
  return (
    <>
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => {
                setActiveTab('1');
              }}
            >
              <i className="nc-icon nc-delivery-fast" /> Ubicacion
              domiciliarios
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => {
                setActiveTab('2');
              }}
            >
              <i className="nc-icon nc-delivery-fast" /> Mis
              domiciliarios
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '3' })}
              onClick={() => {
                setActiveTab('3');
              }}
            >
              <i className="nc-icon nc-bus-front-12" /> Todos los
              domiciliarios
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '4' })}
              onClick={() => {
                setActiveTab('4');
              }}
            >
              <i className="nc-icon nc-email-85" /> Solicitudes
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            {activeTab === '1' && <MapAllDealer />}
          </TabPane>
          <TabPane tabId="2">
            {activeTab === '2' && <MyDomiciliaryList />}
          </TabPane>
          <TabPane tabId="3">
            {activeTab === '3' && <RequestDomiciliaryList />}
          </TabPane>
          <TabPane tabId="4">
            {activeTab === '4' && <RequestWaitingDomiciliaryList />}
          </TabPane>
        </TabContent>
      </div>
    </>
  );
};

export default Domiciliarys;

import * as React from 'react';
import { Tabs } from 'prizma-ui';
import MyDomiciliaryList from './MyDomiciliaryList';
import RequestDomiciliaryList from './RequestDomiciliaryList';
import RequestWaitingDomiciliaryList from './RequestWaitingDomiciliaryList';
import { MapAllDealer } from '../../maps/MapBox/MapAllDealer';

const Domiciliarys = () => {
  const [activeTab, setActiveTab] = React.useState('1');

  const tabs = [
    {
      key: '1',
      label: (
        <>
          <i className="nc-icon nc-delivery-fast" /> Ubicacion domiciliarios
        </>
      ),
      content: activeTab === '1' ? <MapAllDealer /> : null,
    },
    {
      key: '2',
      label: (
        <>
          <i className="nc-icon nc-delivery-fast" /> Mis domiciliarios
        </>
      ),
      content: activeTab === '2' ? <MyDomiciliaryList /> : null,
    },
    {
      key: '3',
      label: (
        <>
          <i className="nc-icon nc-bus-front-12" /> Todos los domiciliarios
        </>
      ),
      content: activeTab === '3' ? <RequestDomiciliaryList /> : null,
    },
    {
      key: '4',
      label: (
        <>
          <i className="nc-icon nc-email-85" /> Solicitudes
        </>
      ),
      content: activeTab === '4' ? <RequestWaitingDomiciliaryList /> : null,
    },
  ];

  return (
    <Tabs
      tabs={tabs}
      value={activeTab}
      onChange={setActiveTab}
    />
  );
};

export default Domiciliarys;

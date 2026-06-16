import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'prizma-ui';
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

  const tabs = [
    {
      key: 'EsperaSalida',
      label: (
        <>
          <i className="nc-icon nc-watch-time" /> Asignadas
        </>
      ),
      content: activeTab === 'EsperaSalida' ? <OrdersByStatus state="EsperaSalida" /> : null,
    },
    {
      key: 'Aceptada',
      label: (
        <>
          <i className="nc-icon nc-bullet-list-67" /> En ruta
        </>
      ),
      content: activeTab === 'Aceptada' ? <OrdersByStatus state="Aceptada" /> : null,
    },
    {
      key: 'Salida',
      label: (
        <>
          <i className="nc-icon nc-delivery-fast" /> En curso
        </>
      ),
      content: activeTab === 'Salida' ? <OrdersByStatus state="Salida" /> : null,
    },
    {
      key: 'Entregada',
      label: (
        <>
          <i className="nc-icon nc-check-2" /> Finalizadas
        </>
      ),
      content: activeTab === 'Entregada' ? <OrdersByStatus state="Entregada" /> : null,
    },
  ];

  return (
    <Tabs
      tabs={tabs}
      value={activeTab}
      onChange={(key) => {
        handleNavLinkClick();
        dispatch(setVueltasTabIndex(key));
      }}
    />
  );
};

export default Vueltas;

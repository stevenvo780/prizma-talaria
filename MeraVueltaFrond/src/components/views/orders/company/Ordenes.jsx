import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, PrizmaTour, usePrizmaTour } from 'prizma-ui';
import OrdersByStatus from './Orders/OrdersByStatus';

import {
  setOrderTabIndex,
  getAllOrderDoneAction,
  searchAllOrdersDoneAction,
  setTourRun,
} from '../../../../store/reducer';

const TOUR_STEPS = [
  {
    target: undefined,
    title: 'Bienvenido a Talaria',
    body: 'Este tutorial te muestra el flujo central para gestionar domicilios y repartos. Dura menos de un minuto.',
    placement: 'center',
  },
  {
    target: '#buscar',
    title: 'Buscar pedidos',
    body: 'Escribe el nombre del cliente, número de compra o dirección para filtrar los pedidos en pantalla de forma instantánea.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="tab-compras"]',
    title: 'Pestaña Compras',
    body: 'Aquí aparecen los pedidos recién ingresados que aún no tienen orden de entrega. Desde cada tarjeta puedes verlos, editarlos o convertirlos en entrega.',
    placement: 'bottom',
  },
  {
    target: '#new',
    title: 'Crear nueva orden',
    body: 'Pulsa "Nueva" para registrar un pedido manual con número de compra y teléfono del cliente. También puedes subir órdenes masivas con el botón "masivas".',
    placement: 'bottom',
  },
  {
    target: '[data-tour="tab-entregas"]',
    title: 'Pestaña Entregas',
    body: 'Los pedidos listos para despachar aparecen aquí. Selecciona una o varias órdenes y asígnalas a un domiciliario con el botón del camión.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="sidebar-vueltas"]',
    title: 'Vueltas — seguimiento en ruta',
    body: 'Desde "Vueltas" en el menú lateral puedes ver qué entregas están asignadas, en ruta, en curso o ya finalizadas. Así controlas toda la operación en tiempo real.',
    placement: 'right',
  },
];

const Ordenes = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.ui.orderTabIndex);
  const tourRunFromStore = useSelector((state) => state.ui.tourRun);

  const { tourProps, start } = usePrizmaTour({
    runKey: 'talaria-v1',
    total: TOUR_STEPS.length,
  });

  // Sync Redux trigger → local tour state
  React.useEffect(() => {
    if (tourRunFromStore) {
      start(0);
      dispatch(setTourRun(false));
    }
  }, [tourRunFromStore, start, dispatch]);

  function handleNavLinkClick() {
    dispatch(getAllOrderDoneAction([]));
    dispatch(searchAllOrdersDoneAction([]));
  }

  const tabs = [
    {
      key: '1',
      label: (
        <span data-tour="tab-compras">
          <i className="nc-icon nc-delivery-fast" /> Compras
        </span>
      ),
      content: activeTab === '1' ? <OrdersByStatus state="Compra" /> : null,
    },
    {
      key: '2',
      label: (
        <span data-tour="tab-entregas">
          <i className="nc-icon nc-bus-front-12" /> Entregas
        </span>
      ),
      content: activeTab === '2' ? <OrdersByStatus state="EsperaDespacho" /> : null,
    },
  ];

  return (
    <>
      <Tabs
        tabs={tabs}
        value={activeTab}
        onChange={(key) => {
          handleNavLinkClick();
          dispatch(setOrderTabIndex(key));
        }}
      />
      <PrizmaTour
        steps={TOUR_STEPS}
        runKey="talaria-v1"
        autoStart
        onFinish={() => {}}
        {...tourProps}
      />
    </>
  );
};

export default Ordenes;
